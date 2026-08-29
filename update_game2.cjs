const fs = require('fs');

const lines = fs.readFileSync('index.html', 'utf8').split('\n');

const htmlStart = lines.findIndex(l => l.includes('<!-- Mini Game Hint -->'));
const jsEnd = lines.findIndex(l => l.includes('// --- END MINI GAME LOGIC ---'));

if (htmlStart === -1 || jsEnd === -1) {
    console.log('Bounds not found');
    process.exit(1);
}

const newGameHTML = `    <!-- Mini Game Hint -->
    <div id="play-hint" class="fixed z-[9999] pointer-events-none opacity-0 transition-opacity duration-300 font-mono text-[10px] md:text-[12px] tracking-[0.2em] text-lightText bg-simbionBlue/90 backdrop-blur px-3 py-1.5 rounded-full flex items-center gap-2" style="transform: translate(-50%, -150%);">
        <span>[ SPACE ] TO PLAY</span>
    </div>

    <!-- Mini Game Overlay -->
    <div id="game-overlay" class="fixed inset-0 z-[99999] bg-darkBg hidden flex-col items-center justify-center pointer-events-auto overflow-hidden">
        <div id="close-game" class="absolute top-6 right-6 md:top-10 md:right-10 text-lightText/50 hover:text-lightText font-mono text-xs md:text-sm tracking-widest uppercase z-50 pointer-events-auto" style="cursor: none;">[ ESC ] TO CLOSE</div>
        
        <!-- Game Area constraints (Full Screen) -->
        <div class="relative w-full h-[100dvh] overflow-hidden bg-darkBg flex flex-col items-center" id="game-area" style="touch-action: none; cursor: none !important;">
            
            <!-- Speed lines illusion for falling (Blue, more visible) -->
            <div id="speed-lines" class="absolute inset-0 opacity-60 pointer-events-none z-0" style="background: repeating-linear-gradient(180deg, transparent, transparent 40px, rgba(0, 10, 194, 0.5) 40px, rgba(0, 10, 194, 0.5) 80px); animation: speedDrift 0.2s linear infinite;"></div>
            
            <!-- Seamless fade on left and right edges -->
            <div class="absolute inset-0 pointer-events-none z-10" style="background: linear-gradient(90deg, #0a0a0a 0%, transparent 15%, transparent 85%, #0a0a0a 100%);"></div>
            
            <div class="absolute top-6 left-6 font-mono text-2xl md:text-4xl text-lightText font-black z-30 drop-shadow-md" id="game-score">00000</div>
            
            <div id="game-start-msg" class="absolute inset-0 flex flex-col items-center justify-center bg-darkBg/60 z-40 pointer-events-none">
                <p class="font-mono text-sm md:text-base text-lightText/80 tracking-widest text-center px-4 mb-8 drop-shadow-lg">USE ARROW KEYS OR SWIPE TO DODGE</p>
                <p class="font-mono text-base md:text-xl text-simbionBlue tracking-[0.3em] uppercase animate-pulse font-bold drop-shadow-lg">[ PRESS SPACE TO START ]</p>
            </div>
            
            <div id="game-over-msg" class="absolute inset-0 flex flex-col items-center justify-center bg-darkBg/80 z-40 hidden pointer-events-none">
                <p class="font-mono text-4xl md:text-6xl text-simbionBlue font-black mb-2 uppercase drop-shadow-[0_0_20px_rgba(0,10,194,0.8)]">CUT!</p>
                <p class="font-mono text-base md:text-xl text-lightText mb-12 text-center px-4">YOU HIT THE EQUIPMENT.</p>
                <p class="font-mono text-base md:text-xl text-simbionBlue tracking-[0.3em] uppercase animate-pulse font-bold drop-shadow-lg">[ PRESS SPACE TO RESTART ]</p>
            </div>

            <!-- Player (Falling Cameraman - HUGE) -->
            <div id="game-player" class="absolute top-[5%] md:top-[10%] left-1/2 -translate-x-1/2 w-[1000px] max-w-none h-auto z-20 will-change-transform pointer-events-none">
                <img src="orang jatuh.gif" class="w-full h-auto object-contain drop-shadow-[0_0_30px_rgba(255,255,255,0.15)]">
            </div>
        </div>
        <p class="absolute bottom-4 font-mono text-[10px] text-lightText/20 tracking-[0.3em] uppercase z-50 pointer-events-none">Simbion Easter Egg</p>
    </div>
    <style>
        #game-overlay, #game-overlay * {
            cursor: none !important;
        }
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
            
            let isGameActive = false;
            let gameState = 'ready'; // ready, playing, gameover
            let gameLoopId;
            let score = 0;
            let obstacles = [];
            
            // Player Horizontal Physics
            let playerX = 0; 
            let targetPlayerX = 0;
            let playerSpeed = 18;
            let keys = { ArrowLeft: false, ArrowRight: false };
            
            // Environment falling speed
            let fallSpeed = 9;
            let frameCount = 0;

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
                fallSpeed = window.innerWidth < 768 ? 8 : 12;
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

            const equipmentSVGs = [
                // Clapperboard
                '<svg viewBox="0 0 24 24" fill="#000AC2" class="w-full h-full drop-shadow-[0_0_10px_rgba(0,10,194,0.8)]"><path d="M18 4l2 4h-3l-2-4h-2l2 4h-3l-2-4H8l2 4H7L5 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4h-4z"/></svg>',
                // Video Camera
                '<svg viewBox="0 0 24 24" fill="#000AC2" class="w-full h-full drop-shadow-[0_0_10px_rgba(0,10,194,0.8)]"><path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z"/></svg>',
                // Film Reel
                '<svg viewBox="0 0 24 24" fill="#000AC2" class="w-full h-full drop-shadow-[0_0_10px_rgba(0,10,194,0.8)]"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-2.5-8.5c0 .83-.67 1.5-1.5 1.5s-1.5-.67-1.5-1.5.67-1.5 1.5-1.5 1.5.67 1.5 1.5zm5 0c0 .83-.67 1.5-1.5 1.5s-1.5-.67-1.5-1.5.67-1.5 1.5-1.5 1.5.67 1.5 1.5zm-2.5 4c1.38 0 2.5-1.12 2.5-2.5s-1.12-2.5-2.5-2.5-2.5 1.12-2.5 2.5 1.12 2.5 2.5 2.5z"/></svg>',
                // Lightbulb / Lighting
                '<svg viewBox="0 0 24 24" fill="#000AC2" class="w-full h-full drop-shadow-[0_0_10px_rgba(0,10,194,0.8)]"><path d="M9 21c0 .55.45 1 1 1h4c.55 0 1-.45 1-1v-1H9v1zm3-19C8.14 2 5 5.14 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.86-3.14-7-7-7zm2.85 11.1l-.85.6V16h-4v-2.3l-.85-.6C7.8 12.16 7 10.63 7 9c0-2.76 2.24-5 5-5s5 2.24 5 5c0 1.63-.8 3.16-2.15 4.1z"/></svg>'
            ];

            function createObstacle(forceX = null) {
                const el = document.createElement('div');
                const isMobile = window.innerWidth < 768;
                // Make obstacles significantly larger to be challenging
                const minSize = isMobile ? 80 : 150;
                const maxSize = isMobile ? 140 : 250;
                const obsWidth = Math.floor(Math.random() * (maxSize - minSize) + minSize);
                
                el.className = 'absolute z-10';
                el.style.width = obsWidth + 'px';
                el.style.height = obsWidth + 'px';
                el.innerHTML = equipmentSVGs[Math.floor(Math.random() * equipmentSVGs.length)];
                
                const areaWidth = gameArea.clientWidth;
                // Determine X position: either forced (for walls) or random
                let x;
                if (forceX !== null) {
                    x = forceX;
                } else {
                    x = Math.random() * (areaWidth - obsWidth);
                }
                
                const y = gameArea.clientHeight + 50; 
                
                el.style.left = x + 'px';
                el.style.top = y + 'px';
                
                // Add random rotation for chaos
                const rotation = Math.random() * 360;
                el.style.transform = \`rotate(\${rotation}deg)\`;
                
                gameArea.appendChild(el);
                
                // For collision hitbox, reduce the bounds slightly compared to visual SVG size
                obstacles.push({ el, x, y, size: obsWidth, passed: false });
            }

            function updateGame() {
                if (gameState !== 'playing') return;

                // Keyboard movement
                if (keys.ArrowLeft) targetPlayerX -= playerSpeed;
                if (keys.ArrowRight) targetPlayerX += playerSpeed;

                const areaWidth = gameArea.clientWidth;
                // Player visual width is 1000px, but movement bounds should allow the "center" of the player to reach the edges
                const maxTravel = (areaWidth / 2) - 50; 
                targetPlayerX = Math.max(-maxTravel, Math.min(maxTravel, targetPlayerX));
                
                playerX += (targetPlayerX - playerX) * 0.15;
                playerEl.style.transform = \`translateX(calc(-50% + \${playerX}px))\`;

                frameCount++;
                
                // Dynamic Spawning: create challenging walls/gaps
                const spawnRate = Math.max(10, Math.floor(35 - (frameCount / 250)));
                if (frameCount % spawnRate === 0) {
                    // 30% chance to spawn a "wall" of 2-3 obstacles with a gap
                    if (Math.random() > 0.7 && areaWidth > 600) {
                        const gapCenter = Math.random() * (areaWidth - 300) + 150;
                        createObstacle(gapCenter - 300); // Left side
                        createObstacle(gapCenter + 150); // Right side
                    } else {
                        createObstacle();
                    }
                }

                if (frameCount % 300 === 0) {
                    fallSpeed += 0.5;
                }
                
                if (frameCount % 10 === 0) {
                    score += Math.floor(fallSpeed);
                    updateScore();
                }

                // Hitbox calculations
                const pRect = playerEl.getBoundingClientRect();
                
                // Custom Hitbox for the 1000px GIF. 
                // The actual "body" in the center is much smaller than 1000px.
                // Assuming the body is roughly in the center 15-20% of the image.
                const hitboxWidth = window.innerWidth < 768 ? 60 : 120;
                const hitboxHeight = window.innerWidth < 768 ? 100 : 200;
                
                const pCenterX = pRect.left + (pRect.width / 2);
                const pCenterY = pRect.top + (pRect.height / 2);
                
                const pLeft = pCenterX - (hitboxWidth / 2);
                const pRight = pCenterX + (hitboxWidth / 2);
                const pTop = pCenterY - (hitboxHeight / 2) + 20; // Offset slightly down
                const pBottom = pCenterY + (hitboxHeight / 2);
                
                for (let i = 0; i < obstacles.length; i++) {
                    let obs = obstacles[i];
                    obs.y -= fallSpeed; 
                    obs.el.style.top = obs.y + 'px';
                    
                    const oRect = obs.el.getBoundingClientRect();
                    // Shrink obstacle hitbox slightly to be forgiving
                    const oShrink = obs.size * 0.2; 
                    const oLeft = oRect.left + oShrink;
                    const oRight = oRect.right - oShrink;
                    const oTop = oRect.top + oShrink;
                    const oBottom = oRect.bottom - oShrink;

                    if (pLeft < oRight &&
                        pRight > oLeft &&
                        pTop < oBottom &&
                        pBottom > oTop) {
                        gameOver();
                        return;
                    }
                }

                if (obstacles.length > 0 && obstacles[0].y < -300) {
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
                
                gsap.fromTo(gameArea, {x: -25, y: -20}, {x: 25, y: 20, duration: 0.1, yoyo: true, repeat: 7, clearProps: "all"});
                
                const flash = document.createElement('div');
                flash.className = 'absolute inset-0 bg-simbionBlue/60 z-[100] pointer-events-none mix-blend-screen';
                gameArea.appendChild(flash);
                gsap.to(flash, {opacity: 0, duration: 0.8, onComplete: () => flash.remove()});
            }

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
                
                if (isGameActive && (e.code === 'ArrowLeft' || e.code === 'KeyA')) { e.preventDefault(); keys.ArrowLeft = true; }
                if (isGameActive && (e.code === 'ArrowRight' || e.code === 'KeyD')) { e.preventDefault(); keys.ArrowRight = true; }
            });
            
            window.addEventListener('keyup', (e) => {
                if (e.code === 'ArrowLeft' || e.code === 'KeyA') keys.ArrowLeft = false;
                if (e.code === 'ArrowRight' || e.code === 'KeyD') keys.ArrowRight = false;
            });

            let isDragging = false;
            if (gameArea) {
                gameArea.addEventListener('pointerdown', (e) => {
                    // Check if it's the close button to ignore
                    if (e.target.id === 'close-game') return;
                    
                    if (gameState === 'ready' || gameState === 'gameover') {
                        startGameLoop();
                    } else if (gameState === 'playing') {
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
                targetPlayerX = (xPos - center) * 1.5; // Multiply for higher sensitivity on drag
            }

            if (closeGameBtn) closeGameBtn.addEventListener('click', closeGame);
            // --- END MINI GAME LOGIC ---`;

const part1 = lines.slice(0, htmlStart).join('\n');
const part3 = lines.slice(jsEnd + 1).join('\n');
const part2 = lines.slice(lines.findIndex(l => l.includes('<div id="fake-loader"')), lines.findIndex(l => l.includes('// --- MINI GAME LOGIC ---'))).join('\n');

const finalHtml = [part1, newGameHTML, part2, newGameJS, part3].join('\n');
fs.writeFileSync('index.html', finalHtml, 'utf8');
console.log("Game updated again.");
