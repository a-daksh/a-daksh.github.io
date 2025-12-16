---
title: 'Unitree G1 Soccer Ball Kicking'
cover: './image.gif'
github: 'https://github.com/a-daksh/16745_Unitree_G1_Goal_Kicking'
external: 'https://drive.google.com/drive/folders/1bkAzpjAIa1z8fcTbUcF7YR9m2Zbwwave?usp=sharing'
tech:
  - Julia
  - IHLQR
  - TVLQR
  - QP
  - DIRCOL
showInProjects: true
---
Built as part of the Optimal Control and Reinforcement Learning course at CMU, this project simulated a penalty-style soccer kick using the Unitree G1 humanoid. The system computed the required impulse to strike the ball toward a target, generated a feasible motion with direct collocation, and used infinite-horizon LQR for balancing along with time-varying LQR for trajectory tracking.