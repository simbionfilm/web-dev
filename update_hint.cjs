const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// Replace the play-hint HTML
const hintRegex = /<div id="play-hint"[\s\S]*?<\/div>/;
const newHintHTML = `<div id="play-hint" class="fixed bottom-8 left-1/2 -translate-x-1/2 z-[9999] pointer-events-none opacity-0 transition-all duration-700 font-mono text-[10px] md:text-[12px] tracking-[0.3em] text-lightText/80 bg-darkBg/80 border border-white/10 backdrop-blur-md px-6 py-2 rounded-full flex items-center justify-center transform translate-y-4">
        <span>[ SPACE ] TO PLAY</span>
    </div>`;

html = html.replace(hintRegex, newHintHTML);

// Find JS logic bounds
const jsStart = html.indexOf('// --- MINI GAME LOGIC ---');
const jsEnd = html.indexOf('// --- END MINI GAME LOGIC ---');
if (jsStart === -1 || jsEnd === -1) {
    console.error("Could not find JS bounds");
    process.exit(1);
}

// We will replace the JS logic completely to ensure it's clean
const newGameJS = `            // --- MINI GAME LOGIC ---
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

            // Hint logic: Show every 10 seconds across all pages
            let hintInterval;
            let hintTimeout;
            
            function triggerHint() {
                if (isGameActive || !playHint) return;
                
                // Show hint
                playHint.classList.remove('opacity-0', 'translate-y-4');
                
                // Hide after 3 seconds
                clearTimeout(hintTimeout);
                hintTimeout = setTimeout(() => {
                    playHint.classList.add('opacity-0', 'translate-y-4');
                }, 3000);
            }
            
            // Start the interval (10s)
            hintInterval = setInterval(triggerHint, 10000);
            // Trigger once initially after 3s
            setTimeout(triggerHint, 3000);
            
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

            function openGame() {
                isGameActive = true;
                if(playHint) playHint.classList.add('opacity-0', 'translate-y-4');
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
                const minSize = isMobile ? 80 : 150;
                const maxSize = isMobile ? 140 : 250;
                const obsWidth = Math.floor(Math.random() * (maxSize - minSize) + minSize);
                
                el.className = 'absolute z-10';
                el.style.width = obsWidth + 'px';
                el.style.height = obsWidth + 'px';
                el.innerHTML = equipmentSVGs[Math.floor(Math.random() * equipmentSVGs.length)];
                
                const areaWidth = gameArea.clientWidth;
                let x;
                if (forceX !== null) {
                    x = forceX;
                } else {
                    x = Math.random() * (areaWidth - obsWidth);
                }
                
                const y = gameArea.clientHeight + 50; 
                
                el.style.left = x + 'px';
                el.style.top = y + 'px';
                
                const rotation = Math.random() * 360;
                el.style.transform = \`rotate(\${rotation}deg)\`;
                
                gameArea.appendChild(el);
                
                obstacles.push({ el, x, y, size: obsWidth, passed: false });
            }

            function updateGame() {
                if (gameState !== 'playing') return;

                if (keys.ArrowLeft) targetPlayerX -= playerSpeed;
                if (keys.ArrowRight) targetPlayerX += playerSpeed;

                const areaWidth = gameArea.clientWidth;
                const maxTravel = (areaWidth / 2) - 50; 
                targetPlayerX = Math.max(-maxTravel, Math.min(maxTravel, targetPlayerX));
                
                playerX += (targetPlayerX - playerX) * 0.15;
                playerEl.style.transform = \`translateX(calc(-50% + \${playerX}px))\`;

                frameCount++;
                
                const spawnRate = Math.max(10, Math.floor(35 - (frameCount / 250)));
                if (frameCount % spawnRate === 0) {
                    if (Math.random() > 0.7 && areaWidth > 600) {
                        const gapCenter = Math.random() * (areaWidth - 300) + 150;
                        createObstacle(gapCenter - 300);
                        createObstacle(gapCenter + 150);
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

                const pRect = playerEl.getBoundingClientRect();
                const hitboxWidth = window.innerWidth < 768 ? 60 : 120;
                const hitboxHeight = window.innerWidth < 768 ? 100 : 200;
                
                const pCenterX = pRect.left + (pRect.width / 2);
                const pCenterY = pRect.top + (pRect.height / 2);
                
                const pLeft = pCenterX - (hitboxWidth / 2);
                const pRight = pCenterX + (hitboxWidth / 2);
                const pTop = pCenterY - (hitboxHeight / 2) + 20;
                const pBottom = pCenterY + (hitboxHeight / 2);
                
                for (let i = 0; i < obstacles.length; i++) {
                    let obs = obstacles[i];
                    obs.y -= fallSpeed; 
                    obs.el.style.top = obs.y + 'px';
                    
                    const oRect = obs.el.getBoundingClientRect();
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
                        e.preventDefault();
                        openGame();
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
                targetPlayerX = (xPos - center) * 1.5; 
            }

            if (closeGameBtn) closeGameBtn.addEventListener('click', closeGame);`;

const finalHtml = html.substring(0, jsStart) + newGameJS + html.substring(jsEnd + '// --- END MINI GAME LOGIC ---'.length);
fs.writeFileSync('index.html', finalHtml, 'utf8');
console.log("Updated!");
