# Video Editor Plugin

Professional video editing with FFmpeg for Cowork.

## Features

- **Remove silences** - Automatically detect and cut out pauses
- **Add zoom effects** - Dynamic zooms at intervals for visual interest
- **Enhance audio** - Noise reduction, compression, loudness normalization
- **Maintain A/V sync** - Sync-safe editing prevents audio drift

## Usage

### Quick Command

```
/edit-video myfile.mp4
```

Options:
- `--no-zooms` - Skip zoom effects
- `--no-audio-enhance` - Skip audio enhancement
- `--threshold 0.02` - Adjust silence detection sensitivity

### Natural Language

Just ask Claude to edit your video:
- "Edit this video and remove the pauses"
- "Cut out silences from recording.mp4"
- "Enhance the audio in my screencast"

## Requirements

- FFmpeg (pre-installed in Cowork)
- Python packages: `pydub`, `scipy`, `numpy` (installed automatically)

## How It Works

1. **Silence Detection** - Analyzes audio to find pauses >0.4 seconds
2. **Sync-Safe Cutting** - Uses FFmpeg filter_complex with batched trim+concat
3. **Zoom Effects** - Scale+crop method for reliable zoom rendering
4. **Audio Enhancement** - Professional filter chain (highpass → lowpass → compressor → loudnorm)

## Output

Edited videos are saved with `_edited` suffix in the same folder as the original.
