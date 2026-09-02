const fs = require('fs');
const file = 'src/simbionApp.js';
let content = fs.readFileSync(file, 'utf8');

const oldResizeAbout = `        function resizeAbout() {
            if (!ctxAbout) return;
            const dpr = Math.min(window.devicePixelRatio || 1, 2);
            aboutWidth = aboutSection.clientWidth || window.innerWidth;
            aboutHeight = aboutSection.clientHeight || window.innerHeight;

            aboutCanvas.width = Math.floor(aboutWidth * dpr);
            aboutCanvas.height = Math.floor(aboutHeight * dpr);
            ctxAbout.setTransform(1, 0, 0, 1, 0, 0);
            ctxAbout.scale(dpr, dpr);
        }`;

const newResizeAbout = `        function resizeAbout() {
            if (!ctxAbout) return;
            // 1. SUPERSAMPLING (SSAA): Force a significantly higher internal rendering resolution
            const baseDpr = window.devicePixelRatio || 1;
            const dpr = Math.min(baseDpr * 2.0, 4.0); // Render at up to 4x resolution internally
            
            aboutWidth = aboutSection.clientWidth || window.innerWidth;
            aboutHeight = aboutSection.clientHeight || window.innerHeight;

            aboutCanvas.width = Math.floor(aboutWidth * dpr);
            aboutCanvas.height = Math.floor(aboutHeight * dpr);
            
            // Ensure CSS layout size remains stable while internal resolution scales up
            aboutCanvas.style.width = \`\${aboutWidth}px\`;
            aboutCanvas.style.height = \`\${aboutHeight}px\`;
            
            // 2. CRISP FILTER: Apply subtle contrast and saturation boost to mimic sharpening
            aboutCanvas.style.filter = "contrast(1.15) saturate(1.1)";
            aboutCanvas.style.imageRendering = "high-quality";

            ctxAbout.setTransform(1, 0, 0, 1, 0, 0);
            ctxAbout.scale(dpr, dpr);
        }`;

content = content.replace(oldResizeAbout, newResizeAbout);
fs.writeFileSync(file, content);
