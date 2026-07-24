#!/usr/bin/env python3
"""
Add smooth zoom effects to video at intervals.
Usage: python add_zooms.py INPUT.mp4 OUTPUT.mp4 [--interval 45] [--factor 1.15] [--duration 5]
"""
import argparse
import subprocess
import json
import random

def get_video_info(path):
    """Get video duration and dimensions."""
    probe = subprocess.run(
        ['ffprobe', '-v', 'error', '-show_entries', 'format=duration',
         '-show_entries', 'stream=width,height', '-of', 'json', path],
        capture_output=True, text=True
    )
    data = json.loads(probe.stdout)
    duration = float(data['format']['duration'])

    width, height = 1920, 1080
    for s in data.get('streams', []):
        if 'width' in s:
            width, height = s['width'], s['height']
            break

    return duration, width, height

def main():
    parser = argparse.ArgumentParser(description='Add zoom effects to video')
    parser.add_argument('input', help='Input video')
    parser.add_argument('output', help='Output video')
    parser.add_argument('--interval', type=float, default=45, help='Seconds between zooms')
    parser.add_argument('--factor', type=float, default=1.15, help='Zoom factor (1.1-1.3)')
    parser.add_argument('--duration', type=float, default=5, help='Zoom duration (seconds)')
    parser.add_argument('--seed', type=int, default=42, help='Random seed')
    parser.add_argument('--crf', type=int, default=17, help='Quality (lower=better)')
    args = parser.parse_args()

    random.seed(args.seed)
    video_duration, width, height = get_video_info(args.input)

    print(f"Input: {video_duration:.1f}s, {width}x{height}")

    # Generate zoom points
    zooms = []
    t = 30  # Start first zoom after 30s
    while t < video_duration - 10:
        zooms.append({
            'start': t,
            'duration': args.duration + random.uniform(-1, 1),
            'factor': args.factor + random.uniform(-0.03, 0.03)
        })
        t += args.interval + random.uniform(-5, 10)

    print(f"Adding {len(zooms)} zoom effects...")

    # Build segments
    segments = []
    current = 0

    for z in zooms:
        if z['start'] > current + 0.1:
            segments.append({'start': current, 'end': z['start'], 'zoom': None})
        segments.append({
            'start': z['start'],
            'end': z['start'] + z['duration'],
            'zoom': z['factor']
        })
        current = z['start'] + z['duration']

    if current < video_duration:
        segments.append({'start': current, 'end': video_duration, 'zoom': None})

    # Build filter_complex
    filter_parts = []
    v_labels = []
    a_labels = []

    for i, seg in enumerate(segments):
        start, end = seg['start'], seg['end']

        if seg['zoom']:
            factor = seg['zoom']
            sw = int(width * factor)
            sh = int(height * factor)
            cx = (sw - width) // 2
            cy = (sh - height) // 2

            filter_parts.append(
                f"[0:v]trim=start={start:.4f}:end={end:.4f},setpts=PTS-STARTPTS,"
                f"scale={sw}:{sh},crop={width}:{height}:{cx}:{cy}[v{i}]"
            )
        else:
            filter_parts.append(
                f"[0:v]trim=start={start:.4f}:end={end:.4f},setpts=PTS-STARTPTS[v{i}]"
            )

        filter_parts.append(
            f"[0:a]atrim=start={start:.4f}:end={end:.4f},asetpts=PTS-STARTPTS[a{i}]"
        )
        v_labels.append(f"[v{i}]")
        a_labels.append(f"[a{i}]")

    v_concat = ''.join(v_labels) + f"concat=n={len(segments)}:v=1:a=0[vout]"
    a_concat = ''.join(a_labels) + f"concat=n={len(segments)}:v=0:a=1[aout]"
    filter_complex = ';'.join(filter_parts) + ';' + v_concat + ';' + a_concat

    print(f"Processing {len(segments)} segments...")

    cmd = [
        'ffmpeg', '-y', '-i', args.input,
        '-filter_complex', filter_complex,
        '-map', '[vout]', '-map', '[aout]',
        '-c:v', 'libx264', '-preset', 'medium', '-crf', str(args.crf),
        '-profile:v', 'high', '-pix_fmt', 'yuv420p',
        '-c:a', 'aac', '-b:a', '192k',
        '-vsync', 'cfr', '-movflags', '+faststart',
        '-loglevel', 'error',
        args.output
    ]

    result = subprocess.run(cmd, capture_output=True, text=True)

    if result.returncode == 0:
        probe = subprocess.run(
            ['ffprobe', '-v', 'error', '-show_entries', 'format=duration,size', '-of', 'json', args.output],
            capture_output=True, text=True
        )
        data = json.loads(probe.stdout)
        out_dur = float(data['format']['duration'])
        out_size = int(data['format']['size'])

        print(f"\n✓ Complete: {args.output}")
        print(f"  Duration: {out_dur:.1f}s ({out_dur/60:.2f} min)")
        print(f"  Size: {out_size/(1024*1024):.1f} MB")
        print(f"  Zooms: {len(zooms)}")
    else:
        print(f"Error: {result.stderr[:500]}")

if __name__ == '__main__':
    main()
