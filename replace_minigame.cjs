const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const startIndex = html.indexOf('<!-- Mini Game Hint -->');
const endIndex = html.indexOf('// --- END MINI GAME LOGIC ---');

if (startIndex === -1 || endIndex === -1) {
    console.log("Could not find boundaries.");
    process.exit(1);
}

const endString = '// --- END MINI GAME LOGIC ---';

const newGameHTML = `<!-- Mini Game Hint -->
    <div id="play-hint" class="fixed z-[9999] pointer-events-none opacity-0 transition-opacity duration-300 font-mono text-[10px] md:text-[12px] tracking-[0.2em] text-lightText bg-simbionBlue/90 backdrop-blur px-3 py-1.5 rounded-full flex items-center gap-2" style="transform: translate(-50%, -150%);">
        <span>[ SPACE ] TO PLAY</span>
    </div>

    <!-- Mini Game Overlay -->
    <div id="game-overlay" class="fixed inset-0 z-[99999] bg-darkBg hidden flex-col items-center justify-center pointer-events-auto overflow-hidden">
        <button id="close-game" class="absolute top-6 right-6 md:top-10 md:right-10 text-lightText hover:text-simbionBlue font-mono text-sm tracking-widest uppercase transition-colors z-50">CLOSE [X]</button>
        
        <!-- Game Area constraints -->
        <div class="relative w-full max-w-2xl h-[70vh] md:h-[80vh] border-x-2 border-white/10 overflow-hidden bg-black" id="game-area" style="touch-action: none;">
            
            <!-- Speed lines illusion for falling -->
            <div id="speed-lines" class="absolute inset-0 opacity-30 pointer-events-none" style="background: repeating-linear-gradient(180deg, transparent, transparent 40px, rgba(255,255,255,0.05) 40px, rgba(255,255,255,0.05) 80px); animation: speedDrift 0.5s linear infinite;"></div>
            
            <div class="absolute top-6 right-6 font-mono text-xl md:text-2xl text-lightText font-bold z-10" id="game-score">00000</div>
            
            <div id="game-start-msg" class="absolute inset-0 flex flex-col items-center justify-center bg-darkBg/80 z-20">
                <p class="font-mono text-xl md:text-3xl text-lightText mb-4 text-center">FREE FALL DODGE</p>
                <p class="font-mono text-xs md:text-sm text-lightText/60 tracking-widest text-center px-4">USE ARROW KEYS OR SWIPE TO DODGE</p>
                <button id="start-btn-click" class="mt-8 font-mono text-xs md:text-sm bg-simbionBlue text-white px-6 py-2 rounded uppercase tracking-widest hover:bg-blue-600 transition-colors">START JUMP</button>
            </div>
            
            <div id="game-over-msg" class="absolute inset-0 flex flex-col items-center justify-center bg-darkBg/90 z-20 hidden">
                <p class="font-mono text-2xl md:text-4xl text-simbionBlue font-bold mb-2">CRASHED!</p>
                <p class="font-mono text-sm md:text-base text-lightText mb-6 text-center px-4">THE CAMERAMAN HIT AN OBSTACLE.</p>
                <button id="restart-btn-click" class="mt-4 font-mono text-xs md:text-sm bg-simbionBlue text-white px-6 py-2 rounded uppercase tracking-widest hover:bg-blue-600 transition-colors">PLAY AGAIN</button>
            </div>

            <!-- Player (Falling Cameraman) -->
            <div id="game-player" class="absolute top-[15%] md:top-[20%] left-1/2 -translate-x-1/2 w-[60px] md:w-[80px] h-auto z-10 will-change-transform">
                <img src="orang jatuh.gif" class="w-full h-auto object-contain drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
            </div>
        </div>
        <p class="mt-4 font-mono text-[10px] text-lightText/40 tracking-[0.3em] uppercase">Simbion Easter Egg</p>
    </div>
    <style>
        @keyframes speedDrift {
            from { background-position: 0 0; }
            to { background-position: 0 -80px; }
        }
    </style>
`;

const newGameJS = `            // --- MINI GAME LOGIC ---
            const heroSection = document.getElementById('hero');
            const playHint = document.getElementById('play-hint');
            const gameOverlay = document.getElementById('game-overlay');
            const closeGameBtn = document.getElementById('close-game');
            const gameArea = document.getElementById('game-area');
            const playerEl = document.getElementById('game-player');
            const scoreEl = document.getElementById('game-score');
            const startMsg = document.getElementById('game-start-msg');
            const overMsg = document.getElementById('game-over-msg');
            const startBtnClick = document.getElementById('start-btn-click');
            const restartBtnClick = document.getElementById('restart-btn-click');
            
            let isGameActive = false;
            let gameState = 'ready'; // ready, playing, gameover
            let gameLoopId;
            let score = 0;
            let obstacles = [];
            
            // Player Horizontal Physics
            let playerX = 0; // Relative to the center line
            let targetPlayerX = 0;
            let playerSpeed = 10;
            let keys = { ArrowLeft: false, ArrowRight: false };
            
            // Environment falling speed
            let fallSpeed = 8;
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
            
            // Mobile trigger: 3 taps on logo
            const logoTrigger = document.querySelector('nav img[alt="SIMBION FILM"]');
            let logoTaps = 0;
            let logoTapTimeout;
            if (logoTrigger) {
                logoTrigger.parentElement.addEventListener('click', (e) => {
                    if (window.innerWidth < 1024) {
                        logoTaps++;
                        clearTimeout(logoTapTimeout);
                        if (logoTaps >= 3) {
                            e.preventDefault();
                            logoTaps = 0;
                            openGame();
                        } else {
                            logoTapTimeout = setTimeout(() => { logoTaps = 0; }, 400);
                        }
                    }
                });
            }

            if (playHint) {
                playHint.style.pointerEvents = 'auto'; 
                playHint.style.cursor = 'pointer';
                playHint.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    openGame();
                });
            }

            function openGame() {
                isGameActive = true;
                playHint.classList.add('opacity-0');
                gameOverlay.classList.remove('hidden');
                gameOverlay.classList.add('flex');
                document.body.style.overflow = 'hidden';
                if (window.lenis) window.lenis.stop();
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
                if (window.lenis) window.lenis.start();
                cancelAnimationFrame(gameLoopId);
                clearObstacles();
            }

            function resetGame() {
                score = 0;
                fallSpeed = window.innerWidth < 768 ? 6 : 9;
                playerX = 0;
                targetPlayerX = 0;
                frameCount = 0;
                keys = { ArrowLeft: false, ArrowRight: false };
                updateScore();
                playerEl.style.transform = \`translateX(-50%)\`;
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

            function createObstacle() {
                const el = document.createElement('div');
                const isMobile = window.innerWidth < 768;
                const obsWidth = isMobile ? 35 : 55;
                
                // Randomly style it as debris (e.g. white boxes or red boxes)
                const isRed = Math.random() > 0.8;
                el.className = \`absolute border-2 \${isRed ? 'bg-red-600 border-red-400' : 'bg-white border-gray-300'}\`;
                el.style.width = obsWidth + 'px';
                el.style.height = obsWidth + 'px';
                
                // Spawn at the bottom of the game area, moving UP towards the falling player
                const areaWidth = gameArea.clientWidth;
                const x = Math.random() * (areaWidth - obsWidth);
                const y = gameArea.clientHeight + 20; 
                
                el.style.left = x + 'px';
                el.style.top = y + 'px';
                // Add some random rotation
                el.style.transform = \`rotate(\${Math.random() * 360}deg)\`;
                
                gameArea.appendChild(el);
                obstacles.push({ el, x, y, size: obsWidth, passed: false });
            }

            function updateGame() {
                if (gameState !== 'playing') return;

                // Move Player Target (Keyboard)
                if (keys.ArrowLeft) targetPlayerX -= playerSpeed;
                if (keys.ArrowRight) targetPlayerX += playerSpeed;

                // Clamp boundaries
                const pWidth = playerEl.clientWidth;
                const areaWidth = gameArea.clientWidth;
                const maxTravel = (areaWidth / 2) - (pWidth / 2);
                targetPlayerX = Math.max(-maxTravel, Math.min(maxTravel, targetPlayerX));
                
                // Smooth follow (easing)
                playerX += (targetPlayerX - playerX) * 0.2;
                
                // Base transform is centering (-50%), then we add our calculated X offset
                playerEl.style.transform = \`translateX(calc(-50% + \${playerX}px))\`;

                // Spawn Obstacles
                frameCount++;
                const spawnRate = Math.max(15, Math.floor(40 - (frameCount / 200)));
                if (frameCount % spawnRate === 0) {
                    createObstacle();
                }

                // Increase fall speed over time
                if (frameCount % 300 === 0) {
                    fallSpeed += 0.5;
                }
                
                // Score based on distance/time survived
                if (frameCount % 10 === 0) {
                    score += Math.floor(fallSpeed);
                    updateScore();
                }

                // Collision Logic
                const pRect = playerEl.getBoundingClientRect();
                const shrink = 12; // Hitbox forgiveness so it doesn't feel unfair
                
                for (let i = 0; i < obstacles.length; i++) {
                    let obs = obstacles[i];
                    
                    // Obstacles fly upwards to simulate falling down
                    obs.y -= fallSpeed; 
                    obs.el.style.top = obs.y + 'px';
                    
                    const oRect = obs.el.getBoundingClientRect();

                    // Collision Check
                    if (pRect.left + shrink < oRect.right - shrink &&
                        pRect.right - shrink > oRect.left + shrink &&
                        pRect.top + shrink < oRect.bottom - shrink &&
                        pRect.bottom - shrink > oRect.top + shrink) {
                        gameOver();
                        return;
                    }
                }

                // Clean up obstacles that pass the top of the screen
                if (obstacles.length > 0 && obstacles[0].y < -100) {
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
                
                // Screen shake
                gsap.fromTo(gameArea, {x: -15, y: -10}, {x: 15, y: 10, duration: 0.1, yoyo: true, repeat: 5, clearProps: "all"});
                
                // Red flash overlay
                const flash = document.createElement('div');
                flash.className = 'absolute inset-0 bg-red-600/50 z-[100] pointer-events-none mix-blend-screen';
                gameArea.appendChild(flash);
                gsap.to(flash, {opacity: 0, duration: 0.6, onComplete: () => flash.remove()});
            }

            // Controls
            window.addEventListener('keydown', (e) => {
                if (e.code === 'Space') {
                    if (!isGameActive) {
                        if (window.pageYOffset < window.innerHeight * 0.8) {
                            e.preventDefault();
                            openGame();
                        }
                    } else {
                        e.preventDefault();
                        if (gameState === 'ready' || gameState === 'gameover') {
                            startGameLoop();
                        }
                    }
                }
                if (e.code === 'Escape' && isGameActive) {
                    closeGame();
                }
                
                if (isGameActive && (e.code === 'ArrowLeft' || e.code === 'KeyA')) keys.ArrowLeft = true;
                if (isGameActive && (e.code === 'ArrowRight' || e.code === 'KeyD')) keys.ArrowRight = true;
            });
            
            window.addEventListener('keyup', (e) => {
                if (e.code === 'ArrowLeft' || e.code === 'KeyA') keys.ArrowLeft = false;
                if (e.code === 'ArrowRight' || e.code === 'KeyD') keys.ArrowRight = false;
            });

            // Touch / Mouse Drag controls for movement
            let isDragging = false;
            if (gameArea) {
                gameArea.addEventListener('pointerdown', (e) => {
                    if (gameState === 'playing') {
                        isDragging = true;
                        updateDragPosition(e);
                    }
                });
                
                window.addEventListener('pointermove', (e) => {
                    if (isDragging && gameState === 'playing') {
                        updateDragPosition(e);
                    }
                });
                
                window.addEventListener('pointerup', () => {
                    isDragging = false;
                });
            }
            
            function updateDragPosition(e) {
                const rect = gameArea.getBoundingClientRect();
                const xPos = e.clientX - rect.left;
                const center = rect.width / 2;
                targetPlayerX = xPos - center;
            }

            if (startBtnClick) startBtnClick.addEventListener('click', () => { if(gameState === 'ready') startGameLoop(); });
            if (restartBtnClick) restartBtnClick.addEventListener('click', () => { if(gameState === 'gameover') startGameLoop(); });
            if (closeGameBtn) closeGameBtn.addEventListener('click', closeGame);

            // --- END MINI GAME LOGIC ---`;

const part1 = html.substring(0, startIndex);
const part2 = html.substring(endIndex + endString.length);

fs.writeFileSync('index.html', part1 + newGameHTML + '\n    <div id="fake-loader"' + part2.split('    <div id="fake-loader"')[1].replace('            // Accurate Realtime Full Page Scroll Progress Calculator', newGameJS + '\n            // Accurate Realtime Full Page Scroll Progress Calculator'), 'utf8');

console.log("Mini game completely rewritten");
