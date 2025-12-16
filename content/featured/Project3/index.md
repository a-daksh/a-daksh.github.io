---
title: 'CMU Vision Language Autonomy Challenge'
cover: './image.png'
github: 'https://github.com/a-daksh/CMU-VLA-Challenge-copypasta.git'
external: 'https://drive.google.com/drive/folders/1OA9SbvrHb39ljxXzefxj5CtzCdYZuzCI?usp=drive_link'
tech:
  - Python 
  - ROS
  - Gemini 2.5 Pro
  - Docker
showInProjects: true
---
Built for the CMU Vision-Language-Autonomy Challenge (IROS 2025), this project developed a Vision-Language Navigation system combining Gemini 2.5 Pro's embodied reasoning with a custom ROS state machine. The system intelligently resolves spatial queries (e.g., "closest to the window") to produce object references and waypoint plans under a strict 10-minute limit. The entire stack was containerized via Docker for reliable deployment on real robot hardware, achieving 3rd place in the competition.