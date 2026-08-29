const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

let targetStr = `class="flex items-center gap-3 group cursor-pointer interactive-el transform will-change-transform"`;
let replaceStr = `class="flex items-center gap-3 group cursor-pointer interactive-el transform will-change-transform origin-right"`;
html = html.replace(targetStr, replaceStr);

fs.writeFileSync('index.html', html, 'utf8');
console.log("Added origin-right");
