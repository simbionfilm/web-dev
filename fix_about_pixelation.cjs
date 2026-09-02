const fs = require('fs');
const file = 'src/simbionApp.js';
let content = fs.readFileSync(file, 'utf8');

// Update drawAbout
content = content.replace(
    /const scaleMultiplier = 1\.7 - \(0\.3 \* p\);/,
    'const scaleMultiplier = 1.35 - (0.2 * p); // Reduced initial zoom to prevent pixelation'
);

// Add image smoothing to drawAbout
if (!content.includes('ctxAbout.imageSmoothingQuality = "high";')) {
    content = content.replace(
        /ctxAbout\.clearRect\(0, 0, aboutWidth, aboutHeight\);/,
        `ctxAbout.clearRect(0, 0, aboutWidth, aboutHeight);\n            ctxAbout.imageSmoothingEnabled = true;\n            ctxAbout.imageSmoothingQuality = "high";`
    );
}

fs.writeFileSync(file, content);
