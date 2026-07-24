---
name: edit-video
description: Edit a video file - remove silences, add zooms, enhance audio
allowed-tools:
  - Read
  - Write
  - Bash
  - Glob
---

# Edit Video Command

Edit a video file with professional-grade processing.

## Arguments

- `<file>` - Path to video file (optional, will prompt if not provided)
- `--no-zooms` - Skip adding zoom effects
- `--no-audio-enhance` - Skip audio enhancement
- `--threshold <value>` - Silence detection threshold (default: 0.02)

## Instructions

1. If no file provided, ask the user which video to edit
2. Invoke the video-editor skill by reading its SKILL.md
3. Follow the skill's workflow:
   - Analyze the video with ffprobe
   - Detect silences using the detection script
   - Process with sync-safe editing
   - Add zoom effects (unless --no-zooms)
   - Enhance audio (unless --no-audio-enhance)
4. Save output with `_edited` suffix in the same directory
5. Report the results: duration reduction, file size, sync verification
