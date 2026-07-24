#!/usr/bin/env python3
"""
Process video with sync-safe segment cutting.
Usage: python process_video.py INPUT.mp4 OUTPUT.mp4 --segments silence_segments.json [--enhance-audio]
"""
import argparse
import subprocess
import json
import os
import shutil
import tempfile

BATCH_SIZE = 40  # Max segments per filter_complex

AUDIO_ENHANCE_FILTER = (
    "highpass=f=80,"
    "lowpass=f=12000,"
    "compand=attacks=0.1:decays=0.3:points=-80/-80|-45/-35|-27/-25|0/-10:soft-knee=6:gain=3,"
    "loudnorm=I=-16:TP=-1.5:LRA=11"
)

def process_batch(input_video, segments, output_file, crf=17):
    """Process a batch of segments using filter_complex."""
    filter_parts = []
    v_labels = []
    a_labels = []

    for i, seg in enumerate(segments):
        filter_parts.append(
            f"[0:v]trim=start={seg['start']:.4f}:end={seg['end']:.4f},setpts=PTS-STARTPTS[v{i}]"
        )
        filter_parts.append(
            f"[0:a]atrim=start={seg['start']:.4f}:end={seg['end']:.4f},asetpts=PTS-STARTPTS[a{i}]"
        )
        v_labels.append(f"[v{i}]")
        a_labels.append(f"[a{i}]")

    v_concat = ''.join(v_labels) + f"concat=n={len(segments)}:v=1:a=0[vout]"
    a_concat = ''.join(a_labels) + f"concat=n={len(segments)}:v=0:a=1[aout]"
    filter_complex = ';'.join(filter_parts) + ';' + v_concat + ';' + a_concat

    cmd = [
        'ffmpeg', '-y', '-i', input_video,
        '-filter_complex', filter_complex,
        '-map', '[vout]', '-map', '[aout]',
        '-c:v', 'libx264', '-preset', 'fast', '-crf', str(crf),
        '-c:a', 'aac', '-b:a', '192k',
        '-vsync', 'cfr',
        '-loglevel', 'error',
        output_file
    ]

    result = subprocess.run(cmd, capture_output=True, text=True)
    return result.returncode == 0

def main():
    parser = argparse.ArgumentParser(description='Process video with sync-safe editing')
    parser.add_argument('input', help='Input video file')
    parser.add_argument('output', help='Output video file')
    parser.add_argument('--segments', required=True, help='JSON file with keep_segments')
    parser.add_argument('--enhance-audio', action='store_true', help='Apply audio enhancement')
    parser.add_argument('--crf', type=int, default=17, help='Quality (lower=better, 15-23)')
    args = parser.parse_args()

    with open(args.segments) as f:
        data = json.load(f)

    segments = data['keep_segments']
    print(f"Processing {len(segments)} segments...")

    temp_dir = tempfile.mkdtemp()
    try:
        total_batches = (len(segments) + BATCH_SIZE - 1) // BATCH_SIZE
        batch_files = []

        for batch_idx in range(total_batches):
            start = batch_idx * BATCH_SIZE
            end = min(start + BATCH_SIZE, len(segments))
            batch_segments = segments[start:end]

            batch_file = os.path.join(temp_dir, f'batch_{batch_idx:03d}.mkv')
            print(f"  Batch {batch_idx + 1}/{total_batches}...", end=' ', flush=True)

            if process_batch(args.input, batch_segments, batch_file, args.crf):
                batch_files.append(batch_file)
                print("✓")
            else:
                print("✗")

        # Concatenate batches
        concat_file = os.path.join(temp_dir, 'concat.txt')
        with open(concat_file, 'w') as f:
            for bf in batch_files:
                f.write(f"file '{bf}'\n")

        print("Concatenating...")
        intermediate = os.path.join(temp_dir, 'intermediate.mkv')

        cmd = [
            'ffmpeg', '-y', '-f', 'concat', '-safe', '0',
            '-i', concat_file, '-c', 'copy',
            '-loglevel', 'error', intermediate
        ]
        subprocess.run(cmd, check=True)

        # Final encode
        print("Final encoding...")
        cmd = [
            'ffmpeg', '-y', '-i', intermediate,
            '-c:v', 'libx264', '-preset', 'medium', '-crf', str(args.crf),
            '-profile:v', 'high', '-pix_fmt', 'yuv420p',
        ]

        if args.enhance_audio:
            cmd.extend(['-af', AUDIO_ENHANCE_FILTER])

        cmd.extend([
            '-c:a', 'aac', '-b:a', '192k',
            '-vsync', 'cfr', '-movflags', '+faststart',
            '-loglevel', 'error', args.output
        ])

        subprocess.run(cmd, check=True)

        # Verify
        probe = subprocess.run(
            ['ffprobe', '-v', 'error', '-show_entries', 'format=duration',
             '-show_entries', 'stream=codec_type,start_time', '-of', 'json', args.output],
            capture_output=True, text=True
        )
        probe_data = json.loads(probe.stdout)
        duration = float(probe_data['format']['duration'])

        v_start = a_start = 0
        for s in probe_data.get('streams', []):
            if s.get('codec_type') == 'video':
                v_start = float(s.get('start_time', 0))
            elif s.get('codec_type') == 'audio':
                a_start = float(s.get('start_time', 0))

        sync_diff = abs(v_start - a_start)

        print(f"\n✓ Complete: {args.output}")
        print(f"  Duration: {duration:.1f}s ({duration/60:.2f} min)")
        print(f"  Sync offset: {sync_diff*1000:.1f}ms {'✓' if sync_diff < 0.05 else '⚠'}")

    finally:
        shutil.rmtree(temp_dir)

if __name__ == '__main__':
    main()
