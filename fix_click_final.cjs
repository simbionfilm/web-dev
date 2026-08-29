const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// Inject the click hint DIV
if (!html.includes('id="scroll-click-hint"')) {
    const hintHTML = `
    <!-- Custom Cursor Hint for Scroll Indicator -->
    <div id="scroll-click-hint" class="fixed top-0 left-0 z-[999999] pointer-events-none opacity-0 font-mono text-[10px] md:text-[12px] text-white bg-[#000AC2] px-2 py-1 rounded-full font-bold tracking-widest transition-opacity duration-200 transform -translate-x-1/2 -translate-y-[150%] shadow-lg">CLICK</div>
`;
    html = html.replace('</body>', hintHTML + '\n</body>');
}

// Inject the JS logic
if (!html.includes('Falling Cameraman Click-to-Game Logic')) {
    const customLogic = `
        <script>
            // --- Falling Cameraman Click-to-Game Logic ---
            document.addEventListener("DOMContentLoaded", () => {
                const scrollRunner = document.getElementById('falling-cameraman-runner');
                const clickHint = document.getElementById('scroll-click-hint');

                if (scrollRunner && clickHint) {
                    scrollRunner.addEventListener('mouseenter', () => {
                        clickHint.classList.remove('opacity-0');
                        const cc = document.getElementById('custom-cursor'); 
                        if (cc) cc.style.opacity = '0';
                    });

                    scrollRunner.addEventListener('mousemove', (e) => {
                        clickHint.style.left = e.clientX + 'px';
                        clickHint.style.top = e.clientY + 'px';
                    });

                    scrollRunner.addEventListener('mouseleave', () => {
                        clickHint.classList.add('opacity-0');
                        const cc = document.getElementById('custom-cursor'); 
                        if (cc) cc.style.opacity = '1';
                    });

                    // Add touch events for mobile hover effect fallback
                    scrollRunner.addEventListener('touchstart', (e) => {
                        clickHint.style.left = e.touches[0].clientX + 'px';
                        clickHint.style.top = e.touches[0].clientY + 'px';
                        clickHint.classList.remove('opacity-0');
                    });
                    
                    scrollRunner.addEventListener('touchend', () => {
                        clickHint.classList.add('opacity-0');
                    });

                    const openMiniGame = (e) => {
                        e.preventDefault();
                        if (typeof openGame === 'function') {
                            openGame();
                            clickHint.classList.add('opacity-0');
                        }
                    };
                    
                    scrollRunner.addEventListener('click', openMiniGame);
                    scrollRunner.addEventListener('pointerdown', openMiniGame);
                }
            });
        </script>
`;
    html = html.replace('</body>', customLogic + '\n</body>');
}

fs.writeFileSync('index.html', html, 'utf8');
