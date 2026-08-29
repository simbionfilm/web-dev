const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// Replace the previous JS snippet with a safer one
const oldLogicStr = `if (window.customCursor) window.customCursor.style.opacity = '0'; // Hide main custom cursor if it exists`;
const oldLogicStr2 = `if (window.customCursor) window.customCursor.style.opacity = '1'; // Show main custom cursor again`;

html = html.replace(oldLogicStr, `const cc = document.getElementById('custom-cursor'); if (cc) cc.style.opacity = '0'; // Hide main custom cursor`);
html = html.replace(oldLogicStr2, `const cc = document.getElementById('custom-cursor'); if (cc) cc.style.opacity = '1'; // Show main custom cursor`);

// Also add a little subtle scale on hover to the runner for visual feedback!
html = html.replace('id="falling-cameraman-runner" class="absolute left-1/2 -translate-x-1/2 top-0 pointer-events-auto cursor-none flex flex-col items-center z-30 will-change-transform"', 'id="falling-cameraman-runner" class="absolute left-1/2 -translate-x-1/2 top-0 pointer-events-auto cursor-none flex flex-col items-center z-30 will-change-transform hover:scale-105 transition-transform duration-300"');

fs.writeFileSync('index.html', html, 'utf8');
console.log("Applied click logic fix");
