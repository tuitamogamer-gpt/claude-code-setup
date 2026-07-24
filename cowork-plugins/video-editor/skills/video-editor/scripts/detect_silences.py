#!/usr/bin/env python3
"""
Detect silent pauses in video audio for editing.
Usage: python detect_silences.py INPUT.mp4 [--threshold 0.02] [--min-silence 0.4]
"""
import argparse
import subprocess
import json
import tempfile
import os
import numpy as np
from scipy.io import wavfile

def extract_audio(video_path, output_path):
    """Extract audio as mono WAV for analysis."""
    cmd = [
        'ffmpeg', '-y', '-i', video_path,
        '-vn', '-acodec', 'pcm_s16le', '-ar', '16000', '-ac', '1',
        '-loglevel', 'error', output_path
    ]
    subprocess.run(cmd, check=True)

def detect_silences(audio_path, threshold=0.02, min_silence=0.4, min_speech=0.15):
    """Detect silence segments in audio."""
    sample_rate, audio = wavfile.read(audio_path)
    audio = audio.astype(np.float32) / np.max(np.abs(audio))

    window_size = int(sample_rate * 0.05)
    hop_size = int(sample_rate * 0.025)

    energies = []
    for i in range(0, len(audio) - window_size, hop_size):
        rms = np.sqrt(np.mean(audio[i:i + window_size] ** 2))
        energies.append(rms)

    energies = np.array(energies)
    is_silence = energies < threshold

    silence_segments = []
    in_silence = False
    start_idx = 0

    for i, silent in enumerate(is_silence):
        time = i * hop_size / sample_rate
        if silent and not in_silence:
            start_idx = i
            in_silence = True
        elif not silent and in_silence:
            silence_start = start_idx * hop_size / sample_rate
            silence_duration = time - silence_start
            if silence_duration >= min_silence:
                silence_segments.append({
                    'start': silence_start,
                    'end': time,
                    'duration': silence_duration
                })
            in_silence = False

    total_duration = len(audio) / sample_rate
    if in_silence:
        silence_start = start_idx * hop_size / sample_rate
        if total_duration - silence_start >= min_silence:
            silence_segments.append({
                'start': silence_start,
                'end': total_duration,
                'duration': total_duration - silence_start
            })

    return silence_segments, total_duration

def build_keep_segments(silences, total_duration, keep_gap=0.1):
    """Build segments to keep (inverse of silences)."""
    silences = sorted(silences, key=lambda x: x['start'])
    keep_segments = []
    current = 0

    for s in silences:
        if s['start'] > current + 0.1:
            keep_segments.append({'start': current, 'end': s['start'] + keep_gap})
        current = s['end'] - keep_gap

    if current < total_duration:
        keep_segments.append({'start': max(0, current), 'end': total_duration})

    return keep_segments

def main():
    parser = argparse.ArgumentParser(description='Detect silences in video')
    parser.add_argument('input', help='Input video file')
    parser.add_argument('--threshold', type=float, default=0.02, help='Silence threshold (0-1)')
    parser.add_argument('--min-silence', type=float, default=0.4, help='Min silence duration (seconds)')
    parser.add_argument('--output', default='silence_segments.json', help='Output JSON file')
    args = parser.parse_args()

    with tempfile.NamedTemporaryFile(suffix='.wav', delete=False) as tmp:
        wav_path = tmp.name

    try:
        print(f"Extracting audio from {args.input}...")
        extract_audio(args.input, wav_path)

        print("Analyzing for silences...")
        silences, total_duration = detect_silences(wav_path, args.threshold, args.min_silence)

        keep_segments = build_keep_segments(silences, total_duration)
        total_silence = sum(s['duration'] for s in silences)
        new_duration = sum(seg['end'] - seg['start'] for seg in keep_segments)

        print(f"\n=== Results ===")
        print(f"Total duration: {total_duration:.1f}s ({total_duration/60:.2f} min)")
        print(f"Silences found: {len(silences)}")
        print(f"Removable time: {total_silence:.1f}s ({total_silence/60:.2f} min)")
        print(f"New duration: {new_duration:.1f}s ({new_duration/60:.2f} min)")

        output_data = {
            'silences': silences,
            'keep_segments': keep_segments,
            'total_duration': total_duration,
            'new_duration': new_duration,
            'total_silence': total_silence
        }

        with open(args.output, 'w') as f:
            json.dump(output_data, f, indent=2)

        print(f"\nSaved to {args.output}")

    finally:
        if os.path.exists(wav_path):
            os.remove(wav_path)

if __name__ == '__main__':
    main()
