const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// 1. Inject the click hint div right after <body> or at the bottom before script
const bodyEnd = html.indexOf('</body>');
if (bodyEnd !== -1) {
    const hintHTML = `
    <!-- Custom Cursor Hint for Scroll Indicator -->
    <div id="scroll-click-hint" class="fixed top-0 left-0 z-[999999] pointer-events-none opacity-0 font-mono text-[10px] md:text-[12px] text-white bg-[#000AC2] px-2 py-1 rounded-full font-bold tracking-widest transition-opacity duration-200 transform -translate-x-1/2 -translate-y-[150%] shadow-lg">CLICK</div>
`;
    html = html.substring(0, bodyEnd) + hintHTML + html.substring(bodyEnd);
}

// 2. Change pointer-events-none to pointer-events-auto on the runner
html = html.replace('id="falling-cameraman-runner" class="absolute left-1/2 -translate-x-1/2 top-0 pointer-events-none flex flex-col items-center z-30 will-change-transform"', 'id="falling-cameraman-runner" class="absolute left-1/2 -translate-x-1/2 top-0 pointer-events-auto cursor-none flex flex-col items-center z-30 will-change-transform"');

// 3. Add JS to handle the hover and click logic. We can inject it at the end of the MAIN SCRIPT
const scriptEnd = html.indexOf('// Ensure custom cursor works for inputs');
if (scriptEnd !== -1) {
    const customLogic = `
            // --- Falling Cameraman Click-to-Game Logic ---
            const scrollRunner = document.getElementById('falling-cameraman-runner');
            const clickHint = document.getElementById('scroll-click-hint');

            if (scrollRunner && clickHint) {
                scrollRunner.addEventListener('mouseenter', () => {
                    clickHint.classList.remove('opacity-0');
                    if (window.customCursor) window.customCursor.style.opacity = '0'; // Hide main custom cursor if it exists
                });

                scrollRunner.addEventListener('mousemove', (e) => {
                    clickHint.style.left = e.clientX + 'px';
                    clickHint.style.top = e.clientY + 'px';
                });

                scrollRunner.addEventListener('mouseleave', () => {
                    clickHint.classList.add('opacity-0');
                    if (window.customCursor) window.customCursor.style.opacity = '1'; // Show main custom cursor again
                });

                scrollRunner.addEventListener('click', (e) => {
                    e.preventDefault();
                    if (typeof openGame === 'function') {
                        openGame();
                    }
                });
            }
            
            `;
    html = html.substring(0, scriptEnd) + customLogic + html.substring(scriptEnd);
}

fs.writeFileSync('index.html', html, 'utf8');
console.log("Applied click logic");
