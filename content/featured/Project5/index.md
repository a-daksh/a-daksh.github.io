---
title: 'MMOsaic: Combining Specialist Policies for Generalist Multi-Agent Play'
cover: './image.gif'
github: 'https://github.com/MMO-saic/'
external: 'https://drive.google.com/drive/folders/1THEhzcVMJ8EumUixfRKF9vyV5RAXd-dU?usp=sharing'
tech:
  - Python 
  - PyTorch 
  - IMPALA
  - Distributed RL
  - MARL
showInProjects: true
---
Built as part of the Deep Reinforcement Learning Control course at CMU, this project developed a hierarchical multi-agent framework for Neural MMO. The system trains specialist policies (Combat, Forage, Survival) via distributed self-play using IMPALA and composes them into a generalist agent using a Mixture-of-Experts approach. We trained using PPO and UPGO, outperforming all baselines to achieve 2nd place.