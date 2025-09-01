---
title: 'Stamp Pixel art using Franka arm'
cover: './image.gif'
github: 
external: 'https://drive.google.com/drive/folders/1fLW2rSwOEIGwB48E1Zd0QJzGh6RTqoWj?usp=sharing'
tech:
  - ROS1
  - Python
  - FrankaPy
showInProjects: true
---
Built as part of the Robot Autonomy course at CMU, this project used a Franka Emika Panda arm with a stamping mechanism to autonomously generate pixel art. The system converts images into grid patterns, optimizes stamping order with Christofides’ algorithm to minimize travel, and uses force-controlled stamping with ArUco tagged ink pads for adaptability.