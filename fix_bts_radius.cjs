const fs = require('fs');
const jsFile = 'src/simbionApp.js';
let js = fs.readFileSync(jsFile, 'utf8');

js = js.replace(/const radius = isMobile \? 200 : 450;/, "const radius = isMobile ? 260 : 600; // Increased radius to prevent overlap");
fs.writeFileSync(jsFile, js);
