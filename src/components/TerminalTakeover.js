import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes } from 'styled-components';

const blink = keyframes`
  0%, 50% { opacity: 1; }
  51%, 100% { opacity: 0; }
`;

const scanLine = keyframes`
  0% { transform: translateY(-100vh); }
  100% { transform: translateY(100vh); }
`;

const TerminalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: #000;
  color: #00ff00;
  font-family: 'Courier New', monospace;
  font-size: 14px;
  z-index: 9999;
  overflow: hidden;
  padding: 20px;
  box-sizing: border-box;
  
  /* Background with filter applied only to background */
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: var(--bg-image-url);
    background-size: cover;
    background-position: center;
    background-attachment: fixed;
    /* Filter to make white circuits green */
    filter: hue-rotate(120deg) saturate(2) brightness(0.8);
    z-index: -1;
    pointer-events: none;
  }
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 2px;
    background: linear-gradient(90deg, transparent, #00ff00, transparent);
    animation: ${scanLine} 3s linear infinite;
    z-index: 1;
  }
`;

const TerminalContent = styled.div`
  height: 100%;
  overflow-y: auto;
  white-space: pre-wrap;
  line-height: 1.4;
  position: relative;
  z-index: 2;
  background: rgba(0, 0, 0, 0.7);
  padding: 20px;
  border-radius: 5px;
  border: 1px solid #00ff00;
  box-shadow: 0 0 20px rgba(0, 255, 0, 0.3);
  display: flex;
  flex-direction: column;
`;

const TextArea = styled.div`
  flex: 1;
  margin-bottom: 20px;
`;

const GameContainer = styled.div`
  width: 100%;
  height: 400px;
  background: rgba(0, 20, 0, 0.9);
  border-radius: 5px;
  padding: 15px;
  position: relative;
  margin-top: 20px;
  display: ${props => props.show ? 'block' : 'none'};
  
  @media (max-width: 768px) {
    height: 350px;
  }
`;

const GameTitle = styled.div`
  color: #00ff00;
  font-family: 'Courier New', monospace;
  font-size: 12px;
  text-align: center;
  margin-bottom: 10px;
  border-bottom: 1px solid #00ff00;
  padding-bottom: 5px;
`;

const GameArea = styled.div`
  width: 100%;
  height: 340px;
  position: relative;
  overflow: hidden;
  font-family: 'Courier New', monospace;
  font-size: 14px;
  line-height: 1;
  
  @media (max-width: 768px) {
    height: 290px;
  }
`;

const Dino = styled.pre`
  position: absolute;
  bottom: ${props => props.jumping ? '120px' : '10px'};
  left: 20px;
  color: #00ff00;
  font-family: 'Courier New', monospace;
  font-size: 14px;
  line-height: 1.2;
  transition: bottom 0.9s ease;
  white-space: pre;
  margin: 0;
`;


const Obstacle = styled.pre`
  position: absolute;
  bottom: 10px;
  right: ${props => props.position}px;
  color: #00ff00;
  font-size: 16px;
  font-family: 'Courier New', monospace;
  white-space: pre;
  margin: 0;
  padding: 0;
  background: none;
  border: none;
`;


const Score = styled.div`
  position: absolute;
  top: 5px;
  right: 10px;
  color: #00ff00;
  font-size: 10px;
`;

const GameInstructions = styled.div`
  position: absolute;
  bottom: 5px;
  left: 10px;
  color: #00ff00;
  font-size: 8px;
  opacity: 0.7;
`;

const Cursor = styled.span`
  background: #00ff00;
  animation: ${blink} 1s infinite;
  padding: 0 2px;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 20px;
  right: 20px;
  background: rgba(0, 0, 0, 0.8);
  border: 1px solid #00ff00;
  color: #00ff00;
  padding: 5px 10px;
  font-family: 'Courier New', monospace;
  cursor: pointer;
  z-index: 3;
  box-shadow: 0 0 10px rgba(0, 255, 0, 0.3);
  
  &:hover {
    background: #00ff00;
    color: #000;
  }
`;

const DINO_ASCII = `
⠀⠀⠀⠀⠀⠀⠀⠀⠀⣤⡿⢿⣿⣿⣿⣧⡄
⠀⠀⠀⠀⠀⠀⠀⠀⠀⣿⣿⣿⣿⣿⣿⣿⡇
⢠⠀⠀⠀⠀⠀⠀⠀⢀⣿⣿⣿⠿⠯⠽⠉⠁
⢼⣿⡄⠀⢀⣀⣤⣾⣿⣿⣿⣿⣤⡄⠀⠀⠀
⠸⢿⣿⣶⣾⣿⣿⣿⣿⣿⣿⣿⡀⠋⠀⠀⠀
⠀⠈⠛⣿⣿⣿⣿⣿⣿⣿⡿⡏⠁⠀⠀⠀⠀
⠀⠀⠀⠘⠻⣿⣿⡿⣿⠟⠉⠀⠀⠀⠀⠀⠀
      ⣿⡛⠀⣿.
      ⠉⠁⠀⠉⠁
`;

const CACTUS = `
   _  _
  | || | _
  | || || |-
  \_  || |
    |  _/
    |_|-   
`;


const TerminalTakeover = ({ onClose }) => {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showGame, setShowGame] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [dinoJumping, setDinoJumping] = useState(false);
  const [obstacles, setObstacles] = useState([]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const contentRef = useRef(null);
  const gameLoopRef = useRef(null);

  const baseSpeed = 10;
  const speedIncrease = Math.floor(Score / 100); // increase speed every 100 points
  const currentSpeed = baseSpeed;

  // ESC key detection
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
      // Space or Up arrow to jump
      if ((event.key === ' ' || event.key === 'ArrowUp') && showGame && !gameOver) {
        event.preventDefault();
        jump();
      }
      // Enter to start/restart game
      if (event.key === 'Enter' && showGame) {
        if (!gameStarted || gameOver) {
          startGame();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose, showGame, gameStarted, gameOver]);

  const jump = () => {
    if (!dinoJumping) {
      setDinoJumping(true);
      setTimeout(() => setDinoJumping(false), 1200);
    }
  };

  const startGame = () => {
    setGameStarted(true);
    setGameOver(false);
    setScore(0);
    setObstacles([]);
  };

  const resetGame = () => {
    setGameStarted(false);
    setGameOver(false);
    setScore(0);
    setObstacles([]);
  };

  // Game loop
  useEffect(() => {
    if (gameStarted && !gameOver) {
      gameLoopRef.current = setInterval(() => {
        setObstacles(prev => {
          const newObstacles = prev.map(obs => ({ ...obs, position: obs.position + currentSpeed }))
            .filter(obs => obs.position < 2000);

          // Add new obstacle randomly
          if (Math.random() < 0.015) {
            newObstacles.push({ id: Date.now(), position: -20 });
          }

          return newObstacles;
        });

        setScore(prev => prev + 1);
      }, 50);
    } else {
      clearInterval(gameLoopRef.current);
    }

    return () => clearInterval(gameLoopRef.current);
  }, [gameStarted, gameOver]);

  // Collision detection - simple and working
  useEffect(() => {
    if (gameStarted && !dinoJumping) {
      // Just check if any obstacle is in the collision zone
      const collision = obstacles.some(obs => obs.position > 1550 && obs.position < 2000);
      if (collision) {
        setGameOver(true);
        setGameStarted(false);
      }
    }
  }, [obstacles, dinoJumping, gameStarted]);

  const terminalContent = `SYSTEM BOOT SEQUENCE INITIATED...
LOADING ROBOTICS PORTFOLIO OS v2.024...

[OK] Initializing neural networks...
[OK] Calibrating sensors...
[OK] Connecting to human interface...

> Scanning human...
> Running personality.exe...
WARNING: Human detected 

*********DANGER*********
RESPONSE: Terminal takeover!

> You found the secret! Welcome to my robot brain.
> This is how I see the world - in green text and endless possibilities.
> Fun fact: I probably spent more time doing this easter egg than my actual portfolio.



> Click ESC or click the X to return to normal mode
> Or just enjoy the retro vibes! `;
  useEffect(() => {
    if (currentIndex < terminalContent.length) {
      const timer = setTimeout(() => {
        setDisplayText(prev => prev + terminalContent[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, 5); // Typing speed - much faster!

      return () => clearTimeout(timer);
    } else if (currentIndex >= terminalContent.length && !showGame) {
      // Show game after typing finishes
      setTimeout(() => setShowGame(true), 1000);
    }
  }, [currentIndex, terminalContent, showGame]);

  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTop = contentRef.current.scrollHeight;
    }
  }, [displayText]);

  const handleCommand = (command) => {
    const responses = {
      help: '\nAVAILABLE_COMMANDS:\n├── help - Show this message\n├── about - Robot facts\n├── coffee - Coffee status\n├── exit - Return to portfolio\n└── sudo - Access denied\n',
      about: '\nROBOT_FACTS:\n├── Powered by caffeine and curiosity\n├── Debugging since 2020\n├── Favorite error: "It works on my machine"\n├── Dreams in Python and C++\n└── Still learning to human properly\n',
      coffee: '\nCOFFEE_STATUS: ☕\n├── Current Level: OPTIMAL\n├── Last Refill: 23 minutes ago\n├── Productivity Boost: +127%\n└── Crash Risk: MINIMAL\n',
      exit: () => onClose(),
    };

    return responses[command.toLowerCase()] || `\nERROR: Command '${command}' not found. Type 'help' for available commands.\n`;
  };

  return (
    <TerminalOverlay>
      <CloseButton onClick={onClose}>X</CloseButton>
      <TerminalContent ref={contentRef}>
        <TextArea>
          {displayText}
          <Cursor>_</Cursor>
        </TextArea>

        <GameContainer show={showGame}>
          <GameArea>
            <Dino jumping={dinoJumping}>
              {dinoJumping ? DINO_ASCII : DINO_ASCII}
            </Dino>
            {obstacles.map(obs => (
              <Obstacle key={obs.id} position={obs.position}>
                {CACTUS}
              </Obstacle>
            ))}
            <Score>SCORE: {score}</Score>
            {!gameStarted && !gameOver && (
              <GameInstructions>
                Press ENTER to start<br />
                SPACE/↑ to jump
              </GameInstructions>
            )}
            {gameOver && (
              <GameInstructions>
                GAME OVER! Score: {score}<br />
                Press ENTER to restart
              </GameInstructions>
            )}
          </GameArea>
        </GameContainer>
      </TerminalContent>
    </TerminalOverlay>
  );
};


export default TerminalTakeover;