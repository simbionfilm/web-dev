const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// 1. Favicon
html = html.replace('href="LOGOmuter.gif"', 'href="orang.png"');

// 2. Revert images and lazy loading
html = html.replace(/ decoding="async" loading="lazy"/g, ' decoding="async"');
html = html.replace(/src="https:\/\/placehold\.co\/300x200\/111111\/FFFFFF\?text=BTS\+(\d+)"/g, 'src="$1.webp" onerror="this.src=\'https://placehold.co/300x200/111111/FFFFFF?text=BTS+$1\'"');

// 3. Mini game replace
const htmlStart = html.indexOf('<!-- Mini Game Hint -->');
const htmlEnd = html.indexOf('<div id="fake-loader"');

const jsStartStr = '// --- MINI GAME LOGIC ---';
const jsEndStr = '// Accurate Realtime Full Page Scroll Progress Calculator';
const jsStart = html.indexOf(jsStartStr);
const jsEnd = html.indexOf(jsEndStr);

if (htmlStart === -1 || htmlEnd === -1 || jsStart === -1 || jsEnd === -1) {
    console.error("Bounds not found");
    process.exit(1);
}

const newGameHTML = `    <!-- Mini Game Hint -->
    <div id="play-hint" class="fixed bottom-8 left-1/2 -translate-x-1/2 z-[9999] pointer-events-none opacity-0 transition-all duration-700 font-mono text-[10px] md:text-[12px] tracking-[0.3em] text-lightText/80 bg-[#0a0a0a] border border-white/10 backdrop-blur-md px-6 py-2 rounded-full flex items-center justify-center transform translate-y-4">
        <span>[ SPACE ] TO PLAY</span>
    </div>

    <!-- Mini Game Overlay -->
    <div id="game-overlay" class="fixed inset-0 z-[99999] bg-[#0a0a0a] hidden flex-col md:flex-row items-stretch justify-center pointer-events-auto overflow-hidden">
        
        <!-- Game Area constraints -->
        <div class="relative flex-1 h-[100dvh] overflow-hidden bg-[#0a0a0a] flex flex-col items-center" id="game-area" style="touch-action: none; cursor: none !important;">
            <div id="close-game" class="absolute top-6 right-6 md:left-6 md:right-auto text-lightText/50 hover:text-lightText font-mono text-xs md:text-sm tracking-widest uppercase z-50 pointer-events-auto cursor-pointer" style="cursor: pointer;">[ ESC ] TO CLOSE</div>
            
            <!-- Flat vertical speed lines -->
            <div id="speed-lines-container" class="absolute inset-0 pointer-events-none z-0">
                <div class="speed-line" style="left: 15%; animation-duration: 0.8s"></div>
                <div class="speed-line" style="left: 35%; animation-duration: 0.6s"></div>
                <div class="speed-line" style="left: 55%; animation-duration: 0.9s"></div>
                <div class="speed-line" style="left: 75%; animation-duration: 0.7s"></div>
                <div class="speed-line" style="left: 85%; animation-duration: 1.0s"></div>
            </div>
            
            <!-- Plain Score -->
            <div class="absolute top-14 md:top-6 right-6 md:right-auto md:left-6 md:top-14 font-mono text-base md:text-lg text-lightText font-bold z-30 tracking-wider" id="game-score">SCORE: 0</div>
            
            <!-- Collected Word -->
            <div class="absolute top-6 md:top-6 left-1/2 -translate-x-1/2 font-mono text-xl md:text-4xl text-[#000AC2] font-black z-30 tracking-[0.3em] drop-shadow-md" id="game-word">_ _ _ _ _ _ _</div>
            
            <div id="game-start-msg" class="absolute inset-0 flex flex-col items-center justify-center bg-[#0a0a0a]/95 z-40 pointer-events-auto" style="cursor: auto;">
                <input type="text" id="player-name-input" placeholder="ENTER YOUR NAME" class="bg-transparent border-b-2 border-[#000AC2] text-white font-mono text-center text-xl md:text-2xl outline-none mb-8 uppercase py-2 w-64 md:w-80 focus:border-white transition-colors" autocomplete="off" maxlength="12">
                <p class="font-mono text-sm md:text-base text-lightText/80 tracking-widest text-center px-4 mb-8">USE ARROW KEYS OR SWIPE TO DODGE</p>
                <p class="font-mono text-base md:text-xl text-white tracking-[0.3em] uppercase animate-pulse font-bold cursor-pointer" id="start-btn">[ PRESS SPACE OR CLICK TO START ]</p>
            </div>
            
            <div id="game-over-msg" class="absolute inset-0 flex flex-col items-center justify-center bg-[#0a0a0a]/95 z-40 hidden pointer-events-auto" style="cursor: auto;">
                <p class="font-mono text-4xl md:text-6xl text-[#000AC2] font-black mb-2 uppercase drop-shadow-md">CUT!</p>
                <p class="font-mono text-sm md:text-base text-lightText/80 mb-12 text-center px-4">YOU HIT THE EQUIPMENT.</p>
                <p class="font-mono text-base md:text-xl text-white tracking-[0.3em] uppercase animate-pulse font-bold cursor-pointer" id="restart-btn">[ PRESS SPACE TO TRY AGAIN ]</p>
            </div>
            
            <div id="game-win-msg" class="absolute inset-0 flex flex-col items-center justify-center bg-white z-40 hidden pointer-events-auto text-black" style="cursor: auto;">
                <p class="font-mono text-4xl md:text-6xl text-[#000AC2] font-black mb-2 uppercase drop-shadow-md">IT'S A WRAP!</p>
                <p class="font-mono text-sm md:text-base opacity-80 mb-12 text-center px-4">YOU COLLECTED ALL LETTERS.</p>
                <p class="font-mono text-base md:text-xl text-black tracking-[0.3em] uppercase animate-pulse font-bold cursor-pointer" id="play-again-btn">[ PRESS SPACE TO PLAY AGAIN ]</p>
            </div>

            <!-- Player (Falling Cameraman - 700px) -->
            <div id="game-player" class="absolute top-[10%] left-1/2 -translate-x-1/2 w-[700px] max-w-none h-auto z-20 will-change-transform pointer-events-none">
                <img src="orang jatuh.gif" class="w-full h-auto object-contain">
            </div>
        </div>

        <!-- Scoreboard Sidebar -->
        <div id="scoreboard-panel" class="hidden md:flex w-64 h-full bg-[#111] border-l border-white/10 flex-col shrink-0 z-50 pointer-events-auto" style="cursor: auto;">
            <div class="p-6 border-b border-white/10">
                <h3 class="font-mono text-[#000AC2] font-black text-xl tracking-widest uppercase text-center">HIGH SCORES</h3>
            </div>
            <div id="score-list" class="flex-1 overflow-y-auto p-6 flex flex-col gap-4 font-mono text-sm text-lightText">
                <!-- Scores injected by JS -->
            </div>
        </div>
    </div>
    <style>
        .speed-line {
            position: absolute;
            top: 0;
            width: 1px;
            height: 200%;
            background: repeating-linear-gradient(180deg, transparent, transparent 15vh, rgba(255,255,255,0.2) 15vh, rgba(255,255,255,0.2) 30vh);
            animation: moveSpeedLines linear infinite;
        }
        @keyframes moveSpeedLines {
            from { transform: translateY(0); }
            to { transform: translateY(-50%); }
        }
    </style>
`;

const newGameJS = `// --- MINI GAME LOGIC ---
            const playHint = document.getElementById('play-hint');
            const gameOverlay = document.getElementById('game-overlay');
            const closeGameBtn = document.getElementById('close-game');
            const gameArea = document.getElementById('game-area');
            const playerEl = document.getElementById('game-player');
            const scoreEl = document.getElementById('game-score');
            const wordEl = document.getElementById('game-word');
            const startMsg = document.getElementById('game-start-msg');
            const overMsg = document.getElementById('game-over-msg');
            const winMsg = document.getElementById('game-win-msg');
            
            const nameInput = document.getElementById('player-name-input');
            const scoreList = document.getElementById('score-list');
            
            let isGameActive = false;
            let gameState = 'ready'; // ready, playing, gameover, win
            let gameLoopId;
            let score = 0;
            let entities = [];
            
            let playerX = 0; 
            let targetPlayerX = 0;
            let playerSpeed = 15;
            let keys = { ArrowLeft: false, ArrowRight: false };
            
            let fallSpeed = 4;
            let frameCount = 0;
            
            const targetWord = "SIMBION";
            let collectedCount = 0;
            let currentPlayerName = "";
            let hasSavedScore = false;

            let highScores = [];
            try {
                const stored = localStorage.getItem('simbion_highscores');
                if (stored) highScores = JSON.parse(stored);
            } catch(e) {}

            function renderLeaderboard() {
                if (!scoreList) return;
                scoreList.innerHTML = '';
                if (highScores.length === 0) {
                    scoreList.innerHTML = '<div class="text-white/30 text-center text-xs mt-10 tracking-widest">NO SCORES YET</div>';
                    return;
                }
                const sorted = [...highScores].sort((a, b) => b.score - a.score).slice(0, 10);
                sorted.forEach((entry, idx) => {
                    const row = document.createElement('div');
                    row.className = 'flex justify-between items-center border-b border-white/5 pb-2';
                    const colorClass = idx === 0 ? 'text-[#000AC2] font-black' : (idx === 1 ? 'text-white font-bold' : 'text-lightText/70');
                    row.innerHTML = \`<span class="\${colorClass}">\${idx + 1}. \${entry.name}</span><span class="\${colorClass}">\${entry.score}</span>\`;
                    scoreList.appendChild(row);
                });
            }

            function saveScore() {
                if (score > 0 && currentPlayerName && !hasSavedScore) {
                    highScores.push({ name: currentPlayerName, score: score });
                    highScores.sort((a, b) => b.score - a.score);
                    highScores = highScores.slice(0, 10);
                    try {
                        localStorage.setItem('simbion_highscores', JSON.stringify(highScores));
                    } catch(e) {}
                    hasSavedScore = true;
                    renderLeaderboard();
                }
            }

            let hintInterval;
            let hintTimeout;
            
            function triggerHint() {
                if (isGameActive || !playHint) return;
                playHint.classList.remove('opacity-0', 'translate-y-4');
                clearTimeout(hintTimeout);
                hintTimeout = setTimeout(() => {
                    playHint.classList.add('opacity-0', 'translate-y-4');
                }, 3000);
            }
            
            hintInterval = setInterval(triggerHint, 10000);
            setTimeout(triggerHint, 3000);
            
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
                renderLeaderboard();
                showStartScreen();
            }

            function closeGame() {
                isGameActive = false;
                gameOverlay.classList.add('hidden');
                gameOverlay.classList.remove('flex');
                document.body.style.overflow = '';
                if (window.lenis) window.lenis.start();
                cancelAnimationFrame(gameLoopId);
                clearEntities();
            }

            function showStartScreen() {
                gameState = 'ready';
                startMsg.classList.remove('hidden');
                overMsg.classList.add('hidden');
                winMsg.classList.add('hidden');
                nameInput.value = currentPlayerName; // Keep last name if exists
                if (window.innerWidth > 768) {
                    setTimeout(() => nameInput.focus(), 100);
                }
                resetGameStats();
            }

            function resetGameStats() {
                score = 0;
                collectedCount = 0;
                fallSpeed = window.innerWidth < 768 ? 3.5 : 4.5; // Medium speed, gentler start
                playerX = 0;
                targetPlayerX = 0;
                frameCount = 0;
                hasSavedScore = false;
                keys = { ArrowLeft: false, ArrowRight: false };
                updateScore();
                updateWordDisplay();
                playerEl.style.transform = \`translateX(-50%)\`;
                clearEntities();
            }

            function clearEntities() {
                entities.forEach(ent => ent.el.remove());
                entities = [];
            }

            function updateWordDisplay() {
                let display = "";
                for (let i = 0; i < targetWord.length; i++) {
                    if (i < collectedCount) {
                        display += targetWord[i] + " ";
                    } else {
                        display += "_ ";
                    }
                }
                wordEl.innerText = display.trim();
            }

            function tryStartGame() {
                if (gameState !== 'ready') {
                    showStartScreen();
                    return;
                }
                const val = nameInput.value.trim();
                if (val.length === 0) {
                    nameInput.focus();
                    nameInput.style.borderColor = 'red';
                    setTimeout(() => nameInput.style.borderColor = '#000AC2', 300);
                    return;
                }
                currentPlayerName = val.substring(0, 12).toUpperCase();
                nameInput.blur();
                
                gameState = 'playing';
                startMsg.classList.add('hidden');
                overMsg.classList.add('hidden');
                winMsg.classList.add('hidden');
                resetGameStats();
                gameLoopId = requestAnimationFrame(updateGame);
            }

            const equipmentSVGs = [
                // Camera
                '<svg viewBox="0 0 24 24" fill="white" class="w-full h-full"><path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z"/></svg>',
                // Clapper
                '<svg viewBox="0 0 24 24" fill="white" class="w-full h-full"><path d="M18 4l2 4h-3l-2-4h-2l2 4h-3l-2-4H8l2 4H7L5 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4h-4z"/></svg>',
                // C-stand
                '<svg viewBox="0 0 24 24" fill="white" class="w-full h-full"><path d="M13 2h-2v15H6v2h12v-2h-5V2z"/><path d="M5 21h14v2H5z"/></svg>',
                // Dolly
                '<svg viewBox="0 0 24 24" fill="white" class="w-full h-full"><path d="M19 15H5c-1.1 0-2 .9-2 2v2h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-2c0-1.1-.9-2-2-2zm-11 4c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm8 0c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm-4-6h4v-2h-4v2zm-2-4V4H7v5h3zm6-5v5h3V4h-3z"/></svg>',
                // Lighting
                '<svg viewBox="0 0 24 24" fill="white" class="w-full h-full"><path d="M9 21c0 .55.45 1 1 1h4c.55 0 1-.45 1-1v-1H9v1zm3-19C8.14 2 5 5.14 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.86-3.14-7-7-7z"/></svg>'
            ];

            function createEntity() {
                const isMobile = window.innerWidth < 768;
                const el = document.createElement('div');
                el.className = 'absolute z-10 flex items-center justify-center';
                
                const spawnLetter = (Math.random() > 0.85) && (collectedCount < targetWord.length);
                let size, isObstacle;

                if (spawnLetter) {
                    size = isMobile ? 48 : 64;
                    isObstacle = false;
                    const letterToCollect = targetWord[collectedCount];
                    // Blue font, white bg
                    el.innerHTML = \`<div class="bg-white text-[#000AC2] font-black font-mono w-full h-full flex items-center justify-center border-4 border-[#000AC2] rounded-md drop-shadow-[0_0_10px_rgba(0,10,194,0.5)]" style="font-size: \${isMobile ? 32 : 44}px">\${letterToCollect}</div>\`;
                } else {
                    size = isMobile ? 40 : 60;
                    isObstacle = true;
                    el.innerHTML = equipmentSVGs[Math.floor(Math.random() * equipmentSVGs.length)];
                }
                
                el.style.width = size + 'px';
                el.style.height = size + 'px';
                
                const areaWidth = gameArea.clientWidth;
                const x = Math.random() * (areaWidth - size);
                const y = gameArea.clientHeight + 50; 
                
                el.style.left = x + 'px';
                el.style.top = y + 'px';
                
                if (isObstacle) {
                    el.style.transform = \`rotate(\${Math.random() * 360}deg)\`;
                }
                
                gameArea.appendChild(el);
                entities.push({ el, x, y, size: size, isObstacle: isObstacle });
            }

            function updateGame() {
                if (gameState !== 'playing') return;

                if (keys.ArrowLeft) targetPlayerX -= playerSpeed;
                if (keys.ArrowRight) targetPlayerX += playerSpeed;

                const areaWidth = gameArea.clientWidth;
                const maxTravel = (areaWidth / 2) - 40; 
                targetPlayerX = Math.max(-maxTravel, Math.min(maxTravel, targetPlayerX));
                
                playerX += (targetPlayerX - playerX) * 0.15;
                playerEl.style.transform = \`translateX(calc(-50% + \${playerX}px))\`;

                frameCount++;
                
                // Gentler spawn rate
                const spawnRate = Math.max(30, Math.floor(60 - (frameCount / 150)));
                if (frameCount % spawnRate === 0) {
                    createEntity();
                }

                // Gentler acceleration, max speed 12
                if (frameCount % 400 === 0 && fallSpeed < 12) {
                    fallSpeed += 0.5;
                }
                
                if (frameCount % 10 === 0) {
                    score += Math.floor(fallSpeed);
                    updateScore();
                }

                const pRect = playerEl.getBoundingClientRect();
                const hitboxWidth = window.innerWidth < 768 ? 40 : 60;
                const hitboxHeight = window.innerWidth < 768 ? 80 : 120;
                
                const pCenterX = pRect.left + (pRect.width / 2);
                const pCenterY = pRect.top + (pRect.height / 2);
                
                const pLeft = pCenterX - (hitboxWidth / 2);
                const pRight = pCenterX + (hitboxWidth / 2);
                const pTop = pCenterY - (hitboxHeight / 2) + 10;
                const pBottom = pCenterY + (hitboxHeight / 2);
                
                for (let i = 0; i < entities.length; i++) {
                    let ent = entities[i];
                    ent.y -= fallSpeed; 
                    ent.el.style.top = ent.y + 'px';
                    
                    const oRect = ent.el.getBoundingClientRect();
                    const oShrink = ent.size * 0.2; 
                    const oLeft = oRect.left + oShrink;
                    const oRight = oRect.right - oShrink;
                    const oTop = oRect.top + oShrink;
                    const oBottom = oRect.bottom - oShrink;

                    if (pLeft < oRight && pRight > oLeft && pTop < oBottom && pBottom > oTop) {
                        if (ent.isObstacle) {
                            gameOver();
                            return;
                        } else {
                            // Collect letter
                            ent.el.remove();
                            entities.splice(i, 1);
                            i--;
                            collectedCount++;
                            updateWordDisplay();
                            score += 1000;
                            updateScore();
                            
                            const flash = document.createElement('div');
                            flash.className = 'absolute inset-0 bg-white z-[100] pointer-events-none opacity-20';
                            gameArea.appendChild(flash);
                            setTimeout(() => {
                                flash.style.transition = 'opacity 0.2s';
                                flash.style.opacity = '0';
                                setTimeout(() => flash.remove(), 200);
                            }, 50);

                            if (collectedCount === targetWord.length) {
                                gameWin();
                                return;
                            }
                        }
                    }
                }

                if (entities.length > 0 && entities[0].y < -200) {
                    entities[0].el.remove();
                    entities.shift();
                }

                gameLoopId = requestAnimationFrame(updateGame);
            }

            function updateScore() {
                scoreEl.innerText = 'SCORE: ' + score;
            }

            function gameOver() {
                gameState = 'gameover';
                saveScore();
                overMsg.classList.remove('hidden');
                
                gsap.fromTo(gameArea, {x: -10, y: -5}, {x: 10, y: 5, duration: 0.1, yoyo: true, repeat: 5, clearProps: "all"});
                
                const flash = document.createElement('div');
                flash.className = 'absolute inset-0 bg-[#000AC2] z-[100] pointer-events-none opacity-30';
                gameArea.appendChild(flash);
                setTimeout(() => {
                    flash.style.transition = 'opacity 0.5s';
                    flash.style.opacity = '0';
                    setTimeout(() => flash.remove(), 500);
                }, 100);
            }

            function gameWin() {
                gameState = 'win';
                score += 5000; // bonus for winning
                updateScore();
                saveScore();
                winMsg.classList.remove('hidden');
                
                const flash = document.createElement('div');
                flash.className = 'absolute inset-0 bg-white z-[100] pointer-events-none';
                gameArea.appendChild(flash);
                gsap.to(flash, {opacity: 0, duration: 1, onComplete: () => flash.remove()});
            }
            
            nameInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    tryStartGame();
                }
                e.stopPropagation(); 
            });
            
            if (document.getElementById('start-btn')) document.getElementById('start-btn').addEventListener('click', tryStartGame);
            if (document.getElementById('restart-btn')) document.getElementById('restart-btn').addEventListener('click', showStartScreen);
            if (document.getElementById('play-again-btn')) document.getElementById('play-again-btn').addEventListener('click', showStartScreen);

            window.addEventListener('keydown', (e) => {
                if (e.code === 'Space') {
                    if (!isGameActive) {
                        e.preventDefault();
                        openGame();
                    } else {
                        if (document.activeElement === nameInput) return; // let them type space
                        e.preventDefault();
                        if (gameState === 'ready') {
                            tryStartGame();
                        } else if (gameState === 'gameover' || gameState === 'win') {
                            showStartScreen();
                        }
                    }
                }
                if (e.code === 'Escape' && isGameActive) {
                    closeGame();
                }
                
                if (isGameActive && (e.code === 'ArrowLeft' || e.code === 'KeyA')) { if(gameState === 'playing') e.preventDefault(); keys.ArrowLeft = true; }
                if (isGameActive && (e.code === 'ArrowRight' || e.code === 'KeyD')) { if(gameState === 'playing') e.preventDefault(); keys.ArrowRight = true; }
            });
            
            window.addEventListener('keyup', (e) => {
                if (e.code === 'ArrowLeft' || e.code === 'KeyA') keys.ArrowLeft = false;
                if (e.code === 'ArrowRight' || e.code === 'KeyD') keys.ArrowRight = false;
            });

            let isDragging = false;
            if (gameArea) {
                gameArea.addEventListener('pointerdown', (e) => {
                    if (e.target.closest('#close-game') || e.target.closest('#game-start-msg') || e.target.closest('#game-over-msg') || e.target.closest('#game-win-msg')) return;
                    
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
                targetPlayerX = (xPos - center) * 1.5; 
            }

            if (closeGameBtn) closeGameBtn.addEventListener('click', closeGame);
            // --- END MINI GAME LOGIC ---`;

const part1 = html.substring(0, htmlStart);
const part2 = html.substring(htmlEnd, jsStart);
const part3 = html.substring(jsEnd);

const finalHtml = part1 + newGameHTML + '\n' + part2 + newGameJS + part3;
fs.writeFileSync('index.html', finalHtml, 'utf8');
console.log("Fixes applied successfully.");
