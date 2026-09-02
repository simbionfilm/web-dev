const fs = require('fs');
const jsFile = 'src/simbionApp.js';
let js = fs.readFileSync(jsFile, 'utf8');

// We need to replace the radius, imgWidth, and rowHeight
js = js.replace(/const radius = isMobile \? 260 : 600;/g, "const radius = isMobile ? 180 : 450; // Smaller radius");
js = js.replace(/const imgWidth = isMobile \? 120 : 260;/g, "const imgWidth = isMobile ? 90 : 180; // Smaller images");
js = js.replace(/const rowHeight = isMobile \? 110 : 260;/g, "const rowHeight = isMobile ? 85 : 190; // Tighter vertical spacing");

fs.writeFileSync(jsFile, js);
console.log("Sizes updated.");
