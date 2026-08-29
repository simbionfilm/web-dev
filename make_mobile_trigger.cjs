const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const targetLogic = `            // Touch controls for mobile
            if (gameArea) {`;

const replaceLogic = `            // Mobile trigger: 3 taps on logo
            const logoTrigger = document.querySelector('nav img[alt="SIMBION FILM"]');
            let logoTaps = 0;
            let logoTapTimeout;
            if (logoTrigger) {
                logoTrigger.parentElement.addEventListener('click', (e) => {
                    // Only intercept if we are at top
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

            // Click hint to open (for mobile or mouse)
            if (playHint) {
                playHint.style.pointerEvents = 'auto'; // allow click
                playHint.style.cursor = 'pointer';
                playHint.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    openGame();
                });
            }

            // Touch controls for mobile
            if (gameArea) {`;

html = html.replace(targetLogic, replaceLogic);
fs.writeFileSync('index.html', html, 'utf8');
console.log("Mobile trigger added!");
