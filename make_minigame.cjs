const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const gameHTML = `
    <!-- Mini Game Hint -->
    <div id="play-hint" class="fixed z-[9999] pointer-events-none opacity-0 transition-opacity duration-300 font-mono text-[10px] md:text-[12px] tracking-[0.2em] text-lightText bg-simbionBlue/90 backdrop-blur px-3 py-1.5 rounded-full flex items-center gap-2" style="transform: translate(-50%, -150%);">
        <span>[ SPACE ] TO PLAY</span>
    </div>

    <!-- Mini Game Overlay -->
    <div id="game-overlay" class="fixed inset-0 z-[99999] bg-darkBg hidden flex-col items-center justify-center pointer-events-auto">
        <button id="close-game" class="absolute top-6 right-6 md:top-10 md:right-10 text-lightText hover:text-simbionBlue font-mono text-sm tracking-widest uppercase transition-colors z-50">CLOSE [X]</button>
        
        <div class="relative w-full max-w-5xl h-[50vh] md:h-[60vh] border-b-2 border-white/20 overflow-hidden" id="game-area">
            <div class="absolute top-6 right-6 font-mono text-xl md:text-2xl text-lightText font-bold z-10" id="game-score">00000</div>
            
            <div id="game-start-msg" class="absolute inset-0 flex flex-col items-center justify-center bg-darkBg/80 z-20">
                <p class="font-mono text-xl md:text-3xl text-lightText mb-4">THE CAMERAMAN RUNNER</p>
                <p class="font-mono text-xs md:text-sm text-lightText/60 tracking-widest">TAP OR PRESS SPACE TO JUMP</p>
            </div>
            
            <div id="game-over-msg" class="absolute inset-0 flex flex-col items-center justify-center bg-darkBg/90 z-20 hidden">
                <p class="font-mono text-2xl md:text-4xl text-simbionBlue font-bold mb-2">CUT!</p>
                <p class="font-mono text-sm md:text-base text-lightText mb-6">YOU DROPPED THE CAMERA.</p>
                <p class="font-mono text-xs md:text-sm text-lightText/60 tracking-widest">TAP OR PRESS SPACE TO RESTART</p>
            </div>

            <!-- Player -->
            <div id="game-player" class="absolute left-[10%] bottom-0 w-[50px] md:w-[70px] h-auto origin-bottom">
                <img src="ORANGSHOOTINGALPHACREDIT-ezgif.com-video-to-gif-converter.gif" class="w-full h-auto object-contain drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">
            </div>
        </div>
        <p class="mt-8 font-mono text-[10px] text-lightText/40 tracking-[0.3em] uppercase">Simbion Easter Egg</p>
    </div>
`;

// Insert the HTML just before the fake-loader
html = html.replace('    <div id="fake-loader"', gameHTML + '\n    <div id="fake-loader"');

const gameJS = `
            // --- MINI GAME LOGIC ---
            const heroSection = document.getElementById('hero');
            const playHint = document.getElementById('play-hint');
            const gameOverlay = document.getElementById('game-overlay');
            const closeGameBtn = document.getElementById('close-game');
            const gameArea = document.getElementById('game-area');
            const playerEl = document.getElementById('game-player');
            const scoreEl = document.getElementById('game-score');
            const startMsg = document.getElementById('game-start-msg');
            const overMsg = document.getElementById('game-over-msg');
            
            let isGameActive = false;
            let gameState = 'ready'; // ready, playing, gameover
            let gameLoopId;
            let score = 0;
            let obstacles = [];
            
            // Physics
            let playerY = 0; // 0 is ground
            let playerVel = 0;
            const gravity = -0.6;
            const jumpForce = 12;
            let gameSpeed = 6;
            let frameCount = 0;

            // Hint logic
            if (heroSection && playHint) {
                heroSection.addEventListener('mousemove', (e) => {
                    if (isGameActive) return;
                    playHint.style.left = e.clientX + 'px';
                    playHint.style.top = e.clientY + 'px';
                });
                
                heroSection.addEventListener('mouseenter', () => {
                    if (!isGameActive) playHint.classList.remove('opacity-0');
                });
                heroSection.addEventListener('mouseleave', () => {
                    playHint.classList.add('opacity-0');
                });
            }

            function openGame() {
                isGameActive = true;
                playHint.classList.add('opacity-0');
                gameOverlay.classList.remove('hidden');
                gameOverlay.classList.add('flex');
                document.body.style.overflow = 'hidden';
                if (lenis) lenis.stop();
                resetGame();
                gameState = 'ready';
                startMsg.classList.remove('hidden');
                overMsg.classList.add('hidden');
            }

            function closeGame() {
                isGameActive = false;
                gameOverlay.classList.add('hidden');
                gameOverlay.classList.remove('flex');
                document.body.style.overflow = '';
                if (lenis) lenis.start();
                cancelAnimationFrame(gameLoopId);
                clearObstacles();
            }

            function resetGame() {
                score = 0;
                gameSpeed = window.innerWidth < 768 ? 4 : 6;
                playerY = 0;
                playerVel = 0;
                frameCount = 0;
                updateScore();
                playerEl.style.transform = \`translateY(0px)\`;
                clearObstacles();
            }

            function clearObstacles() {
                obstacles.forEach(obs => obs.el.remove());
                obstacles = [];
            }

            function startGameLoop() {
                gameState = 'playing';
                startMsg.classList.add('hidden');
                overMsg.classList.add('hidden');
                resetGame();
                gameLoopId = requestAnimationFrame(updateGame);
            }

            function jump() {
                if (playerY === 0) {
                    playerVel = window.innerWidth < 768 ? 10 : 13;
                }
            }

            function createObstacle() {
                const el = document.createElement('div');
                el.className = 'absolute bottom-0 w-[20px] md:w-[30px] h-[30px] md:h-[50px] bg-white border border-borderGray';
                // randomly vary height a bit
                const h = (Math.random() * 20) + (window.innerWidth < 768 ? 20 : 30);
                el.style.height = h + 'px';
                
                // start at right edge
                const x = gameArea.clientWidth;
                el.style.transform = \`translateX(\${x}px)\`;
                
                gameArea.appendChild(el);
                obstacles.push({ el, x, width: window.innerWidth < 768 ? 20 : 30, height: h, passed: false });
            }

            function updateGame() {
                if (gameState !== 'playing') return;

                // Physics
                playerVel += gravity;
                playerY += playerVel;
                if (playerY <= 0) {
                    playerY = 0;
                    playerVel = 0;
                }
                playerEl.style.transform = \`translateY(\${-playerY}px)\`;

                // Obstacles
                frameCount++;
                if (frameCount % Math.floor(Math.random() * 60 + 70) === 0) {
                    createObstacle();
                }

                // Speed increase over time
                if (frameCount % 600 === 0) {
                    gameSpeed += 0.5;
                }

                const pRect = playerEl.getBoundingClientRect();
                const gameAreaRect = gameArea.getBoundingClientRect();
                // Player coordinates relative to game area
                const px = pRect.left - gameAreaRect.left;
                const pWidth = pRect.width;
                // Add a little forgiveness box
                const px_start = px + pWidth * 0.3;
                const px_end = px + pWidth * 0.7;

                for (let i = 0; i < obstacles.length; i++) {
                    let obs = obstacles[i];
                    obs.x -= gameSpeed;
                    obs.el.style.transform = \`translateX(\${obs.x}px)\`;

                    // Collision Check
                    if (obs.x < px_end && obs.x + obs.width > px_start) {
                        // check vertical
                        if (playerY < obs.height - 10) { // 10px forgiveness
                            gameOver();
                            return;
                        }
                    }

                    // Score
                    if (!obs.passed && obs.x < px) {
                        obs.passed = true;
                        score += 10;
                        updateScore();
                    }
                }

                // Clean up old obstacles
                if (obstacles.length > 0 && obstacles[0].x < -100) {
                    obstacles[0].el.remove();
                    obstacles.shift();
                }

                gameLoopId = requestAnimationFrame(updateGame);
            }

            function updateScore() {
                scoreEl.innerText = score.toString().padStart(5, '0');
            }

            function gameOver() {
                gameState = 'gameover';
                overMsg.classList.remove('hidden');
                // Shake effect
                gsap.fromTo(gameArea, {x: -10}, {x: 10, duration: 0.1, yoyo: true, repeat: 5, clearProps: "x"});
            }

            // Controls
            window.addEventListener('keydown', (e) => {
                if (e.code === 'Space') {
                    if (!isGameActive) {
                        // Only trigger if hovering hero (hint is visible) or at top of page
                        if (window.pageYOffset < window.innerHeight * 0.8) {
                            e.preventDefault();
                            openGame();
                        }
                    } else {
                        e.preventDefault();
                        if (gameState === 'ready' || gameState === 'gameover') {
                            startGameLoop();
                        } else if (gameState === 'playing') {
                            jump();
                        }
                    }
                }
                if (e.code === 'Escape' && isGameActive) {
                    closeGame();
                }
            });

            // Touch controls for mobile
            if (gameArea) {
                gameArea.addEventListener('pointerdown', (e) => {
                    e.preventDefault();
                    if (gameState === 'ready' || gameState === 'gameover') {
                        startGameLoop();
                    } else if (gameState === 'playing') {
                        jump();
                    }
                });
            }
            if (startMsg) {
                startMsg.addEventListener('click', () => { if(gameState === 'ready') startGameLoop(); });
            }
            if (overMsg) {
                overMsg.addEventListener('click', () => { if(gameState === 'gameover') startGameLoop(); });
            }

            if (closeGameBtn) closeGameBtn.addEventListener('click', closeGame);

            // --- END MINI GAME LOGIC ---
`;

// Insert the JS logic near the end of the script, e.g., before closeCmsModal();
html = html.replace('            // Accurate Realtime Full Page Scroll Progress Calculator', gameJS + '\n            // Accurate Realtime Full Page Scroll Progress Calculator');

fs.writeFileSync('index.html', html, 'utf8');
console.log("Mini game injected!");
