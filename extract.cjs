const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');
const start = html.indexOf('<!-- Mini Game Hint -->');
const end = html.indexOf('// Accurate Realtime Full Page Scroll Progress Calculator');
fs.writeFileSync('minigame_current.html', html.substring(start, end));
