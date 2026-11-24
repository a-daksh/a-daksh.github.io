---
title: 'RL Post-Training of a Flow-Based VLA'
cover: './cover.jpg'
video: './video.mp4'
github: 'https://github.com/a-daksh/RLT-lerobot'
external: 'https://drive.google.com/drive/folders/1GTqD60x7lDk_GR6dy1xD2Gtjt3eG7BQ1?usp=sharing'
tech:
  - SmolVLA
  - LeRobot
  - TD3
  - PyTorch
  - Meta-World
showInProjects: true
---

Implemented RL Token (RLT) on SmolVLA, compressing frozen VLM embeddings into a single token that conditions a lightweight TD3 actor-critic, so the policy improves through online RL without extra demonstrations. Validated the token with PCA and t-SNE, where last-step embeddings cleanly separate success from failure episodes, and raised Meta-World peg-insert success from 72% to 88% over the BC baseline.
