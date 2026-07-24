---
name: video-editor
description: Professional video editing with FFmpeg. Use when the user wants to edit video files (.mp4, .mov, .mkv, .avi, .webm) including removing silences/pauses, trimming, adding zoom effects, enhancing audio, cutting segments, concatenating clips, adjusting speed, or any video manipulation task. Triggers on keywords like "edit video", "remove pauses", "cut silences", "trim video", "enhance audio", "add zooms", "speed up video", "compress video".
---

# Video Editor

Professional video editing using FFmpeg and Python. Handles silence removal, zoom effects, audio enhancement, and maintains A/V sync.

## Dependencies

The bundled scripts use **only the Python standard library** — no pip installs
needed. FFmpeg/ffprobe must be available (pre-installed in most environments).

```bash
# $SKILL = this skill's folder (where this SKILL.md lives)
```

## Core Workflow

### 1. Analyze Video

```bash
ffprobe -v error -show_entries format=duration,size,bit_rate -show_entries stream=codec_name,width,height,r_frame_rate,channels,sample_rate -of json "INPUT.mp4"
```

### 2. Detect Silences

Analyze the audio for removable pauses (uses ffmpeg silencedetect internally):

```bash
python "$SKILL/scripts/detect_silences.py" "INPUT.mp4" --threshold 0.02 --min-silence 0.4 --padding 0.15
```

Output: `silence_segments.json` containing both the detected `silences` and the
inverted `keep_segments` (the speech to keep). `--padding` preserves a slice of
each pause on both sides of a cut so speech never sounds clipped — raise it to
0.25–0.35 for a calmer editing rhythm, lower for aggressive jump-cuts.

### 3. Process Video (Sync-Safe)

**Critical for A/V sync**: Use FFmpeg's `filter_complex` with `trim` + `setpts=PTS-STARTPTS` in batched passes. Never extract segments individually with `-ss` as this causes sync drift.

Run the bundled script:

```bash
python "$SKILL/scripts/process_video.py" "INPUT.mp4" "OUTPUT.mp4" --segments silence_segments.json
```

Optional flags: `--enhance-audio` (applies the audio chain below in the same
pass), `--crf 20 --preset medium` (quality), `--batch-size 40` (segments per
filter_complex pass; batches are joined losslessly).

### 4. Add Zoom Effects (Optional)

Apply smooth zoom-in effects at intervals using scale+crop:

```bash
python "$SKILL/scripts/add_zooms.py" "INPUT.mp4" "OUTPUT.mp4" --interval 45 --factor 1.15 --zoom-duration 6
```

Audio passes through untouched, so sync is preserved.

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

vf = f"scale={scale_w}:{scale_h},crop={width}:{height}:{crop_x}:{crop_y},setsar=1"
```

**`setsar=1` is mandatory** when zoomed segments will be concat-joined with
normal ones — scale+crop shifts the sample aspect ratio and concat refuses to
join streams whose SAR doesn't match.

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
python "$SKILL/scripts/detect_silences.py" input.mp4
python "$SKILL/scripts/process_video.py" input.mp4 output.mp4 --segments silence_segments.json
```

### Full edit (silences + zooms + audio)
```bash
python "$SKILL/scripts/detect_silences.py" input.mp4
python "$SKILL/scripts/process_video.py" input.mp4 temp.mp4 --segments silence_segments.json --enhance-audio
python "$SKILL/scripts/add_zooms.py" temp.mp4 output.mp4
```

### Verify sync
```bash
ffprobe -v error -show_entries stream=codec_type,start_time -of json output.mp4
```

Video and audio `start_time` should both be `0.000000`.
