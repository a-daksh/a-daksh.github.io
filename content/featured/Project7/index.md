---
title: 'DexterLab: Benchmarking Generative Dexterous Policies'
label: 'MaxLab · CMU'
cover: './cover.jpg'
video: './video.mp4'
tech:
  - MuJoCo
  - PyTorch
  - Flow Matching
  - RL
  - Leap Motion
showInProjects: true
---

Built at Prof. Max Simchowitz's lab at CMU, DexterLab is a benchmark for training and evaluating generative dexterous policies on a UR5e arm and Allegro hand, modeled as a single 22-DoF system. Existing benchmarks treat the hand in isolation with a floating wrist; DexterLab co-optimizes arm and hand together. I built a Leap Motion teleoperation pipeline with QP-based arm IK and neural finger retargeting (GeoRT), trained flow-matching BC policies on ~10 minutes of demos, and used OGPO RL post-training to raise pick-and-place success from 30% to 64%.
