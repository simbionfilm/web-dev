const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// 1. Fix runner sizing to ensure big hitbox
html = html.replace('id="falling-cameraman-runner" class="absolute left-1/2 -translate-x-1/2 top-0 pointer-events-auto cursor-none flex flex-col items-center z-30 will-change-transform hover:scale-105 transition-transform duration-300"', 'id="falling-cameraman-runner" class="absolute left-1/2 -translate-x-1/2 top-0 pointer-events-auto cursor-pointer flex flex-col items-center justify-center z-30 will-change-transform hover:scale-105 transition-transform duration-300 p-2 sm:p-4"');

// 2. Add touch event listener in JS
const targetLogic = "scrollRunner.addEventListener('click', (e) => {";
const replacementLogic = "scrollRunner.addEventListener('pointerdown', (e) => {";
html = html.replace(targetLogic, replacementLogic);

// 3. Let's fix the We Are word sizes on mobile. 
// "we-are-container" has text-[12vw]. Let's make it text-[15vw] or similar on very small screens, or add proper wrapping.
// Actually it's fine, but maybe gap is too small.
html = html.replace('text-[12vw] md:text-[9vw]', 'text-[14vw] md:text-[9vw]');

fs.writeFileSync('index.html', html, 'utf8');
