const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const htmlStart = html.indexOf('<!-- Mini Game Hint -->');
const htmlEnd = html.indexOf('<div id="fake-loader"');

const jsStartStr = '// --- MINI GAME LOGIC ---';
const jsEndStr = '// Accurate Realtime Full Page Scroll Progress Calculator';
const jsStart = html.indexOf(jsStartStr);
const jsEnd = html.indexOf(jsEndStr);

console.log(htmlStart, htmlEnd, jsStart, jsEnd);
