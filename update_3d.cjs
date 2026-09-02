const fs = require('fs');
const file = 'src/simbionApp.js';
let content = fs.readFileSync(file, 'utf8');

// 1. Add global flag to prevent double initialization
if (!content.includes('let is3DSequenceInitialized = false;')) {
    content = content.replace(
        'function init3DCanvasSequence() {',
        `let is3DSequenceInitialized = false;\n    function init3DCanvasSequence() {\n        if (is3DSequenceInitialized) return;\n        is3DSequenceInitialized = true;`
    );
}

// 2. Fix drawStatement starting frame
content = content.replace(/if \(statementCanvas\) drawStatement\(0, 0\);/g, 'if (statementCanvas) drawStatement(totalFrames - 1, 0);');

// 3. Optimize image loading
const oldLoop = `        for (let i = 1; i <= totalFrames; i++) {
            const img = new Image();
            img.crossOrigin = "anonymous";
            const p3 = String(i).padStart(3, '0');
            const primaryUrl = \`\${supabaseBaseUrl}ezgif-frame-\${p3}.png\`;
            const fallbackUrl = \`\${supabaseBaseUrl}\${p3}.png\`;

            img.onload = () => {
                imagesLoaded++;
                if (imagesLoaded === 1 || i === 1) {
                    if (weAreCanvas) weAreCanvas.style.opacity = '1';
                    if (statementCanvas) statementCanvas.style.opacity = '1';
                    drawAbout(0, 0);
                    drawWeAre(0, 0);
                    if (statementCanvas) drawStatement(totalFrames - 1, 0);
                }
            };
            img.onerror = function() {
                if (this.src !== fallbackUrl) {
                    this.src = fallbackUrl;
                } else if (rawVectors.length > 0) {
                    this.onerror = null;
                    this.src = rawVectors[(i - 1) % rawVectors.length];
                }
            };

            img.src = primaryUrl;
            images.push(img);
        }`;

const newLoop = `        // Load asynchronously in chunks
        function loadFrameBatch(startIndex, batchSize) {
            for (let i = startIndex; i < startIndex + batchSize && i <= totalFrames; i++) {
                const img = new Image();
                img.decoding = "async";
                img.crossOrigin = "anonymous";
                const p3 = String(i).padStart(3, '0');
                const primaryUrl = \`\${supabaseBaseUrl}ezgif-frame-\${p3}.png\`;
                const fallbackUrl = \`\${supabaseBaseUrl}\${p3}.png\`;

                img.onload = () => {
                    imagesLoaded++;
                    images[i - 1] = img;
                    
                    if (imagesLoaded === 1 || i === 1) {
                        if (weAreCanvas) weAreCanvas.style.opacity = '1';
                        if (statementCanvas) statementCanvas.style.opacity = '1';
                        drawAbout(0, 0);
                        drawWeAre(0, 0);
                        if (statementCanvas) drawStatement(totalFrames - 1, 0);
                    }
                    
                    if (i === startIndex + batchSize - 1 && i < totalFrames) {
                        setTimeout(() => loadFrameBatch(i + 1, batchSize), 10);
                    }
                };
                
                img.onerror = function() {
                    images[i - 1] = img;
                    if (this.src !== fallbackUrl) {
                        this.src = fallbackUrl;
                    } else if (rawVectors.length > 0) {
                        this.onerror = null;
                        this.src = rawVectors[(i - 1) % rawVectors.length];
                    }
                    
                    if (i === startIndex + batchSize - 1 && i < totalFrames) {
                        setTimeout(() => loadFrameBatch(i + 1, batchSize), 10);
                    }
                };

                img.src = primaryUrl;
            }
        }
        
        loadFrameBatch(1, 1);
        setTimeout(() => loadFrameBatch(2, 5), 100);`;

// Let's do a more robust replacement for the loop by finding the block
content = content.replace(/const images = \[\];/, 'const images = new Array(totalFrames);');

let loopStartIndex = content.indexOf('// Preload all 244 frames');
let loopEndIndex = content.indexOf('// ==========================================\n        // 1. CANVAS 1: ABOUT SECTION');

if (loopStartIndex !== -1 && loopEndIndex !== -1) {
    content = content.substring(0, loopStartIndex) + newLoop + '\n\n        ' + content.substring(loopEndIndex);
}

fs.writeFileSync(file, content);
console.log('Update complete.');
