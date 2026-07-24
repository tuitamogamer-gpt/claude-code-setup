#!/usr/bin/env python3
"""Detect silences in a video's audio track using ffmpeg's silencedetect filter.

Usage:
    python detect_silences.py INPUT.mp4 [--threshold 0.02] [--min-silence 0.4]
                              [--padding 0.15] [--output silence_segments.json]

Outputs a JSON file (default: silence_segments.json) containing:
  - "silences":      detected silent ranges
  - "keep_segments": the speech ranges to KEEP (silences removed, with padding
                     preserved around each cut so speech never sounds clipped)

process_video.py consumes the "keep_segments" list directly.

--threshold is a linear amplitude (0.02 ~= -34 dB), matching common practice.
No Python dependencies beyond the standard library; ffmpeg/ffprobe required.
"""
import argparse
import json
import math
import re
import subprocess
import sys


def probe_duration(path):
    out = subprocess.run(
        ["ffprobe", "-v", "error", "-show_entries", "format=duration",
         "-of", "json", path],
        capture_output=True, text=True, check=True)
    return float(json.loads(out.stdout)["format"]["duration"])


def detect(path, threshold, min_silence):
    """Run silencedetect; returns list of {'start': s, 'end': e} silences."""
    noise_db = 20 * math.log10(max(threshold, 1e-6))
    proc = subprocess.run(
        ["ffmpeg", "-hide_banner", "-i", path, "-af",
         f"silencedetect=noise={noise_db:.1f}dB:d={min_silence}",
         "-f", "null", "-"],
        capture_output=True, text=True)
    silences, start = [], None
    for line in proc.stderr.splitlines():
        m = re.search(r"silence_start:\s*([\d.]+)", line)
        if m:
            start = float(m.group(1))
            continue
        m = re.search(r"silence_end:\s*([\d.]+)", line)
        if m and start is not None:
            silences.append({"start": start, "end": float(m.group(1))})
            start = None
    return silences, start  # `start` non-None => file ends in silence


def build_keep_segments(duration, silences, trailing_start, padding):
    """Invert silences into keep-segments, preserving `padding` seconds of
    each pause so cuts breathe naturally."""
    cuts = []
    for s in silences:
        cut_start = s["start"] + padding
        cut_end = s["end"] - padding
        if cut_end - cut_start > 0.05:  # ignore pauses that padding swallows
            cuts.append((cut_start, cut_end))
    if trailing_start is not None:  # silence running to end of file
        cut_start = trailing_start + padding
        if duration - cut_start > 0.05:
            cuts.append((cut_start, duration))

    keep, pos = [], 0.0
    for cs, ce in cuts:
        if cs > pos + 0.02:
            keep.append({"start": round(pos, 4), "end": round(cs, 4)})
        pos = max(pos, ce)
    if duration > pos + 0.02:
        keep.append({"start": round(pos, 4), "end": round(duration, 4)})
    return keep


def main():
    ap = argparse.ArgumentParser(description="Detect removable silences in a video.")
    ap.add_argument("input")
    ap.add_argument("--threshold", type=float, default=0.02,
                    help="Linear amplitude below which audio counts as silence (default 0.02 ~ -34dB).")
    ap.add_argument("--min-silence", type=float, default=0.4,
                    help="Minimum silence duration in seconds to be removable (default 0.4).")
    ap.add_argument("--padding", type=float, default=0.15,
                    help="Seconds of each pause to KEEP on both sides of a cut (default 0.15).")
    ap.add_argument("--output", default="silence_segments.json")
    args = ap.parse_args()

    duration = probe_duration(args.input)
    silences, trailing = detect(args.input, args.threshold, args.min_silence)
    keep = build_keep_segments(duration, silences, trailing, args.padding)

    removed = duration - sum(s["end"] - s["start"] for s in keep)
    data = {
        "input": args.input,
        "duration": round(duration, 4),
        "params": {"threshold": args.threshold, "min_silence": args.min_silence,
                   "padding": args.padding},
        "silences": silences,
        "keep_segments": keep,
        "estimated_removed_seconds": round(max(removed, 0), 2),
    }
    with open(args.output, "w") as f:
        json.dump(data, f, indent=2)
    print(f"Duration {duration:.2f}s | {len(silences)} silences | "
          f"{len(keep)} keep-segments | ~{data['estimated_removed_seconds']}s removable")
    print(f"Wrote {args.output}")
    if not silences:
        print("No removable silences found — try a higher --threshold or lower --min-silence.",
              file=sys.stderr)


if __name__ == "__main__":
    main()
