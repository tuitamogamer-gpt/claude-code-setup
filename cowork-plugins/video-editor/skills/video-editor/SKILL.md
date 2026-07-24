---
name: video-editor
description: Professional video editing with FFmpeg. Use when the user wants to edit video files (.mp4, .mov, .mkv, .avi, .webm) including removing silences/pauses, trimming, adding zoom effects, enhancing audio, cutting segments, concatenating clips, adjusting speed, or any video manipulation task. Triggers on keywords like "edit video", "remove pauses", "cut silences", "trim video", "enhance audio", "add zooms", "speed up video", "compress video".
---

# Video Editor

Professional video editing using FFmpeg and Python. Handles silence removal, zoom effects, audio enhancement, and maintains A/V sync.

## Dependencies

```bash
pip install pydub scipy numpy
```

FFmpeg must be available (pre-installed in most environments).

## Core Workflow

### 1. Analyze Video

```bash
ffprobe -v error -show_entries format=duration,size,bit_rate -show_entries stream=codec_name,width,height,r_frame_rate,channels,sample_rate -of json "INPUT.mp4"
```

### 2. Detect Silences

Extract audio and analyze for pauses. Run `scripts/detect_silences.py`:

```bash
python scripts/detect_silences.py "INPUT.mp4" --threshold 0.02 --min-silence 0.4
```

Output: `silence_segments.json` with removable pauses.

### 3. Process Video (Sync-Safe)

**Critical for A/V sync**: Use FFmpeg's `filter_complex` with `trim` + `setpts=PTS-STARTPTS` in batched passes. Never extract segments individually with `-ss` as this causes sync drift.

Run `scripts/process_video.py`:

```bash
python scripts/process_video.py "INPUT.mp4" "OUTPUT.mp4" --segments silence_segments.json
```

### 4. Add Zoom Effects (Optional)

Apply smooth zoom-in effects at intervals using scale+crop:

```bash
python scripts/add_zooms.py "INPUT.mp4" "OUTPUT.mp4" --interval 45 --factor 1.15
```

### 5. Enhance Audio

Apply in final encoding pass:

```
highpass=f=80,lowpass=f=12000,compand=attacks=0.1:decays=0.3:points=-80/-80|-45/-35|-27/-25|0/-10:soft-knee=6:gain=3,loudnorm=I=-16:TP=-1.5:LRA=11
```

## Sync-Safe Editing Pattern

**Problem**: Cutting many small segments causes A/V drift.

**Solution**: Process in batches using filter_complex:

```python
# Build filter for batch of segments
filter_parts = []
for i, seg in enumerate(segments):
    filter_parts.append(f"[0:v]trim=start={seg['start']:.4f}:end={seg['end']:.4f},setpts=PTS-STARTPTS[v{i}]")
    filter_parts.append(f"[0:a]atrim=start={seg['start']:.4f}:end={seg['end']:.4f},asetpts=PTS-STARTPTS[a{i}]")

# Concat
v_concat = ''.join(f'[v{i}]' for i in range(len(segments))) + f"concat=n={len(segments)}:v=1:a=0[vout]"
a_concat = ''.join(f'[a{i}]' for i in range(len(segments))) + f"concat=n={len(segments)}:v=0:a=1[aout]"

filter_complex = ';'.join(filter_parts) + ';' + v_concat + ';' + a_concat
```

**Batch size**: 40 segments max per filter_complex to avoid complexity limits.

**Final encode flags**:
- `-vsync cfr` - Constant frame rate
- `-movflags +faststart` - Web optimization

## Zoom Effect Pattern

Static zoom per segment (reliable):

```python
factor = 1.15  # 15% zoom
scale_w = int(width * factor)
scale_h = int(height * factor)
crop_x = (scale_w - width) // 2
crop_y = (scale_h - height) // 2

vf = f"scale={scale_w}:{scale_h},crop={width}:{height}:{crop_x}:{crop_y}"
```

## Quality Settings

| Use Case | Preset | CRF | Notes |
|----------|--------|-----|-------|
| High quality | medium | 17 | Near-lossless |
| Balanced | medium | 20 | Good quality, smaller |
| Fast preview | ultrafast | 23 | Quick processing |

Always use `-profile:v high -pix_fmt yuv420p` for compatibility.

## Common Tasks

### Remove silences only
```bash
python scripts/detect_silences.py input.mp4
python scripts/process_video.py input.mp4 output.mp4 --segments silence_segments.json
```

### Full edit (silences + zooms + audio)
```bash
python scripts/detect_silences.py input.mp4
python scripts/process_video.py input.mp4 temp.mp4 --segments silence_segments.json --enhance-audio
python scripts/add_zooms.py temp.mp4 output.mp4
```

### Verify sync
```bash
ffprobe -v error -show_entries stream=codec_type,start_time -of json output.mp4
```

Video and audio `start_time` should both be `0.000000`.
