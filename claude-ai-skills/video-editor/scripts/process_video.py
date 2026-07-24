#!/usr/bin/env python3
"""Sync-safe silence removal: re-assemble a video from keep-segments using
batched filter_complex trim/atrim + concat (never per-segment -ss extraction,
which drifts A/V sync).

Usage:
    python process_video.py INPUT.mp4 OUTPUT.mp4 --segments silence_segments.json
                            [--enhance-audio] [--crf 20] [--preset medium]
                            [--batch-size 40]

Reads the "keep_segments" list produced by detect_silences.py. If more than
--batch-size segments exist, processes them in batches to intermediate files
and losslessly concatenates the batches (concat demuxer, stream copy).
"""
import argparse
import json
import os
import subprocess
import sys
import tempfile

AUDIO_ENHANCE = ("highpass=f=80,lowpass=f=12000,"
                 "compand=attacks=0.1:decays=0.3:"
                 "points=-80/-80|-45/-35|-27/-25|0/-10:soft-knee=6:gain=3,"
                 "loudnorm=I=-16:TP=-1.5:LRA=11")


def run(cmd):
    proc = subprocess.run(cmd, capture_output=True, text=True)
    if proc.returncode != 0:
        sys.exit(f"ffmpeg failed:\n{proc.stderr[-2000:]}")


def build_filter(segments, enhance_audio):
    parts = []
    for i, seg in enumerate(segments):
        parts.append(f"[0:v]trim=start={seg['start']:.4f}:end={seg['end']:.4f},"
                     f"setpts=PTS-STARTPTS[v{i}]")
        parts.append(f"[0:a]atrim=start={seg['start']:.4f}:end={seg['end']:.4f},"
                     f"asetpts=PTS-STARTPTS[a{i}]")
    n = len(segments)
    v_in = ''.join(f"[v{i}]" for i in range(n))
    a_in = ''.join(f"[a{i}]" for i in range(n))
    parts.append(f"{v_in}concat=n={n}:v=1:a=0[vout]")
    if enhance_audio:
        parts.append(f"{a_in}concat=n={n}:v=0:a=1[araw]")
        parts.append(f"[araw]{AUDIO_ENHANCE}[aout]")
    else:
        parts.append(f"{a_in}concat=n={n}:v=0:a=1[aout]")
    return ';'.join(parts)


def encode_batch(inp, out, segments, args, enhance_audio):
    cmd = ["ffmpeg", "-y", "-hide_banner", "-loglevel", "error", "-i", inp,
           "-filter_complex", build_filter(segments, enhance_audio),
           "-map", "[vout]", "-map", "[aout]",
           "-c:v", "libx264", "-preset", args.preset, "-crf", str(args.crf),
           "-profile:v", "high", "-pix_fmt", "yuv420p",
           "-c:a", "aac", "-b:a", "192k",
           "-vsync", "cfr", "-movflags", "+faststart", out]
    run(cmd)


def main():
    ap = argparse.ArgumentParser(description="Remove silences sync-safely.")
    ap.add_argument("input")
    ap.add_argument("output")
    ap.add_argument("--segments", required=True,
                    help="JSON from detect_silences.py (uses its keep_segments).")
    ap.add_argument("--enhance-audio", action="store_true",
                    help="Apply highpass/lowpass/compand/loudnorm chain in the same pass.")
    ap.add_argument("--crf", type=int, default=20)
    ap.add_argument("--preset", default="medium")
    ap.add_argument("--batch-size", type=int, default=40,
                    help="Max segments per filter_complex pass (default 40).")
    args = ap.parse_args()

    with open(args.segments) as f:
        data = json.load(f)
    segments = data.get("keep_segments") or data.get("segments")
    if not segments:
        sys.exit("No keep_segments in JSON — run detect_silences.py first.")

    batches = [segments[i:i + args.batch_size]
               for i in range(0, len(segments), args.batch_size)]

    if len(batches) == 1:
        encode_batch(args.input, args.output, batches[0], args, args.enhance_audio)
    else:
        # Encode each batch, then losslessly join. Audio enhancement (loudnorm)
        # must run on the FINAL joined audio, so batches encode clean and the
        # enhance pass (if requested) happens during the join re-mux.
        with tempfile.TemporaryDirectory() as tmp:
            listfile = os.path.join(tmp, "list.txt")
            parts = []
            for bi, batch in enumerate(batches):
                part = os.path.join(tmp, f"part{bi:03d}.mp4")
                encode_batch(args.input, part, batch, args, enhance_audio=False)
                parts.append(part)
            with open(listfile, "w") as f:
                for p in parts:
                    f.write(f"file '{p}'\n")
            if args.enhance_audio:
                run(["ffmpeg", "-y", "-hide_banner", "-loglevel", "error",
                     "-f", "concat", "-safe", "0", "-i", listfile,
                     "-c:v", "copy", "-af", AUDIO_ENHANCE,
                     "-c:a", "aac", "-b:a", "192k",
                     "-movflags", "+faststart", args.output])
            else:
                run(["ffmpeg", "-y", "-hide_banner", "-loglevel", "error",
                     "-f", "concat", "-safe", "0", "-i", listfile,
                     "-c", "copy", "-movflags", "+faststart", args.output])

    kept = sum(s["end"] - s["start"] for s in segments)
    print(f"Wrote {args.output} | {len(segments)} segments kept "
          f"(~{kept:.1f}s of content) in {len(batches)} pass(es)")


if __name__ == "__main__":
    main()
