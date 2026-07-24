#!/usr/bin/env python3
"""Add periodic static zoom-in segments to a video (scale+crop pattern —
reliable, no zoompan jitter). Audio passes through untouched, so A/V sync
is preserved.

Usage:
    python add_zooms.py INPUT.mp4 OUTPUT.mp4 [--interval 45] [--factor 1.15]
                        [--zoom-duration 6] [--crf 20] [--preset medium]

Every --interval seconds the video holds a centered zoom of --factor for
--zoom-duration seconds, then cuts back to normal. This mimics the "punch-in"
style common in talking-head edits.
"""
import argparse
import json
import subprocess
import sys


def probe(path):
    out = subprocess.run(
        ["ffprobe", "-v", "error", "-select_streams", "v:0",
         "-show_entries", "stream=width,height",
         "-show_entries", "format=duration", "-of", "json", path],
        capture_output=True, text=True, check=True)
    info = json.loads(out.stdout)
    s = info["streams"][0]
    return int(s["width"]), int(s["height"]), float(info["format"]["duration"])


def main():
    ap = argparse.ArgumentParser(description="Add periodic punch-in zooms.")
    ap.add_argument("input")
    ap.add_argument("output")
    ap.add_argument("--interval", type=float, default=45,
                    help="Seconds between zoom punch-ins (default 45).")
    ap.add_argument("--factor", type=float, default=1.15,
                    help="Zoom factor (default 1.15 = 15%% punch-in).")
    ap.add_argument("--zoom-duration", type=float, default=6,
                    help="How long each zoom segment holds (default 6s).")
    ap.add_argument("--crf", type=int, default=20)
    ap.add_argument("--preset", default="medium")
    args = ap.parse_args()

    width, height, duration = probe(args.input)

    # Even dimensions keep yuv420p happy.
    scale_w = int(width * args.factor) // 2 * 2
    scale_h = int(height * args.factor) // 2 * 2
    crop_x = (scale_w - width) // 2
    crop_y = (scale_h - height) // 2
    zoom_vf = f"scale={scale_w}:{scale_h},crop={width}:{height}:{crop_x}:{crop_y},setsar=1"

    # Build alternating normal/zoom timeline. First zoom starts at `interval`.
    segments, pos, zooming = [], 0.0, False
    t = args.interval
    while pos < duration - 0.05:
        if not zooming:
            end = min(t, duration)
            segments.append((pos, end, False))
            pos, zooming = end, True
        else:
            end = min(pos + args.zoom_duration, duration)
            segments.append((pos, end, True))
            pos, zooming = end, False
            t = max(pos + args.interval - args.zoom_duration, pos + 1)

    if len(segments) <= 1:
        sys.exit(f"Video ({duration:.1f}s) is shorter than --interval "
                 f"({args.interval}s) — nothing to zoom. Lower --interval.")

    parts = []
    for i, (s, e, zoom) in enumerate(segments):
        vf = f",{zoom_vf}" if zoom else ",setsar=1"
        parts.append(f"[0:v]trim=start={s:.4f}:end={e:.4f},"
                     f"setpts=PTS-STARTPTS{vf}[v{i}]")
    v_in = ''.join(f"[v{i}]" for i in range(len(segments)))
    parts.append(f"{v_in}concat=n={len(segments)}:v=1:a=0[vout]")
    filter_complex = ';'.join(parts)

    cmd = ["ffmpeg", "-y", "-hide_banner", "-loglevel", "error", "-i", args.input,
           "-filter_complex", filter_complex,
           "-map", "[vout]", "-map", "0:a?",
           "-c:v", "libx264", "-preset", args.preset, "-crf", str(args.crf),
           "-profile:v", "high", "-pix_fmt", "yuv420p",
           "-c:a", "aac", "-b:a", "192k",
           "-vsync", "cfr", "-movflags", "+faststart", args.output]
    proc = subprocess.run(cmd, capture_output=True, text=True)
    if proc.returncode != 0:
        sys.exit(f"ffmpeg failed:\n{proc.stderr[-2000:]}")

    zooms = sum(1 for *_, z in segments if z)
    print(f"Wrote {args.output} | {zooms} zoom punch-in(s) at factor {args.factor}")


if __name__ == "__main__":
    main()
