#!/usr/bin/env bash
# make-cover.sh — turn a source video/GIF (or a folder of PNG frames) into a project cover:
#   <out_dir>/video.mp4  short, silent, looping H.264 clip (web-optimised, max 1600 px wide)
#   <out_dir>/cover.jpg  first frame, used as the poster / still cover
#
# Usage:
#   tools/media/make-cover.sh <input> <out_dir> [options]
#
# Options:
#   --start SEC        start time in the source (default 0)
#   --duration SEC     length of the source segment to use (default: whole input)
#   --speed X          playback speed-up, e.g. 2 = twice as fast (default 1)
#   --crop W:H:X:Y     crop rectangle in source pixels, applied before scaling
#   --width PX         output width, never upscaled beyond the source (default 1600)
#   --fps N            output frame rate (default 30)
#   --frame-rate N     input frame rate when <input> is a folder of frames (default 10)
#   --crf N            x264 quality, lower = better/bigger (default 24)
#
# Examples:
#   tools/media/make-cover.sh demo.mp4 content/featured/Project4 --start 98.5 --duration 22 --speed 2
#   tools/media/make-cover.sh frames/ content/featured/Project1 --frame-rate 10
#
# Requires ffmpeg (on Windows run it from WSL or Git Bash with ffmpeg on PATH).
set -euo pipefail

usage() { sed -n '2,25p' "$0"; exit 1; }
[[ $# -lt 2 ]] && usage

input=$1; out=$2; shift 2
start=0; duration=""; speed=1; crop=""; width=1600; fps=30; in_rate=10; crf=24

while [[ $# -gt 0 ]]; do
  case $1 in
    --start) start=$2; shift 2 ;;
    --duration) duration=$2; shift 2 ;;
    --speed) speed=$2; shift 2 ;;
    --crop) crop=$2; shift 2 ;;
    --width) width=$2; shift 2 ;;
    --fps) fps=$2; shift 2 ;;
    --frame-rate) in_rate=$2; shift 2 ;;
    --crf) crf=$2; shift 2 ;;
    *) echo "Unknown option: $1" >&2; usage ;;
  esac
done

mkdir -p "$out"

if [[ -d $input ]]; then
  first=$(ls "$input" | grep -iE '\.(png|jpe?g)$' | sort | head -1)
  ext=${first##*.}
  src_args=(-framerate "$in_rate" -pattern_type glob -i "$input/*.$ext")
else
  src_args=(-ss "$start" ${duration:+-t "$duration"} -i "$input")
fi

filters=()
[[ -n $crop ]] && filters+=("crop=$crop")
filters+=("setpts=PTS/$speed")
# Scale down to the target width (never up), keep even dimensions for H.264.
filters+=("scale='min($width,iw)':-2:flags=lanczos")
filters+=("fps=$fps" "format=yuv420p")
vf=$(IFS=,; echo "${filters[*]}")

ffmpeg -y -loglevel error "${src_args[@]}" -an -vf "$vf" \
  -c:v libx264 -preset slow -crf "$crf" -movflags +faststart "$out/video.mp4"
ffmpeg -y -loglevel error -i "$out/video.mp4" -frames:v 1 -q:v 3 "$out/cover.jpg"

dims=$(ffprobe -v error -select_streams v:0 -show_entries stream=width,height -of csv=p=0 "$out/video.mp4")
secs=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$out/video.mp4")
kb=$(( $(stat -c %s "$out/video.mp4") / 1024 ))
echo "$out/video.mp4  ${dims}  ${secs%.*}s  ${kb} KB  (+ cover.jpg)"
