const fs = require('fs');
const file = 'src/simbionApp.js';
let content = fs.readFileSync(file, 'utf8');

const drawStatementOld = `        function drawStatement(frameIdx, progress = 0) {
            if (!ctxStatement) return;
            const validIdx = Math.max(0, Math.min(totalFrames - 1, Math.floor(frameIdx || 0)));
            const p = Math.max(0, Math.min(1, progress || 0));
            const img = images[validIdx];
            if (!img || !img.complete || img.naturalWidth === 0) return;

            const isMobile = window.innerWidth < 768;
            ctxStatement.clearRect(0, 0, statementWidth, statementHeight);

            // Scale is normal (100%)
            const baseScale = isMobile ? 0.75 : 0.90;
            const currentScale = baseScale; // Fixed normal size

            // Sits on the right side
            const currentX = statementWidth * (isMobile ? 0.75 : 0.75);
            
            // Starts slightly from bottom and moves slightly to top
            const currentY = statementHeight * (0.6 - (0.2 * p)) + (isMobile ? 20 : 10);

            // Stays upright
            const rotationRad = 0;

            const aspect = (img.naturalWidth || 512) / (img.naturalHeight || 600);
            let renderH = statementHeight * currentScale;
            let renderW = renderH * aspect;

            ctxStatement.save();
            ctxStatement.translate(currentX, currentY);
            ctxStatement.rotate(rotationRad);
            // Behind statement text? or above? 
            ctxStatement.globalCompositeOperation = "destination-over"; 
            ctxStatement.shadowColor = 'rgba(0, 10, 194, 0.45)';
            ctxStatement.shadowBlur = isMobile ? 16 : 28;
            ctxStatement.drawImage(img, -renderW / 2, -renderH / 2, renderW, renderH);
            ctxStatement.restore();
        }`;

const drawStatementNew = `        function drawStatement(frameIdx, progress = 0) {
            if (!ctxStatement) return;
            const validIdx = Math.max(0, Math.min(totalFrames - 1, Math.floor(frameIdx || 0)));
            const p = Math.max(0, Math.min(1, progress || 0));
            const img = images[validIdx];
            if (!img || !img.complete || img.naturalWidth === 0) return;

            const isMobile = window.innerWidth < 768;
            ctxStatement.clearRect(0, 0, statementWidth, statementHeight);

            const baseScale = isMobile ? 0.70 : 0.85;
            // Scale: starts at 170% (1.7x) and scales down as it descends
            const scaleMultiplier = 1.7 - (0.3 * p);
            const currentScale = baseScale * scaleMultiplier;

            // Position X: Sits on the right side
            const currentX = statementWidth * ((isMobile ? 0.60 : 0.64) - (0.12 * p));
            
            // Position Y: Descends continuously down past the bottom edge of the section (terpotong ke bawah)
            const startY = statementHeight * 0.45;
            const endY = statementHeight * 1.35; // Drops deeply down so it gets cut off by overflow-hidden
            const currentY = startY * (1 - p) + endY * p;

            // Rotation tilt: +14deg -> +6deg
            const rotationDeg = 14 * (1 - p) + 6 * p;
            const rotationRad = (rotationDeg * Math.PI) / 180;

            const aspect = (img.naturalWidth || 512) / (img.naturalHeight || 600);
            let renderH = statementHeight * currentScale;
            let renderW = renderH * aspect;

            ctxStatement.save();
            ctxStatement.translate(currentX, currentY);
            ctxStatement.rotate(rotationRad);
            // Behind statement text? or above? 
            ctxStatement.globalCompositeOperation = "destination-over"; 
            ctxStatement.shadowColor = 'rgba(0, 10, 194, 0.45)';
            ctxStatement.shadowBlur = isMobile ? 16 : 28;
            ctxStatement.drawImage(img, -renderW / 2, -renderH / 2, renderW, renderH);
            ctxStatement.restore();
        }`;

content = content.replace(drawStatementOld, drawStatementNew);

content = content.replace(
    'const frameIdx = (totalFrames - 1) * (1 - self.progress);',
    'const frameIdx = (totalFrames - 1) * self.progress;'
);

content = content.replace(
    'if (statementCanvas) drawStatement(totalFrames - 1, 0);',
    'if (statementCanvas) drawStatement(0, 0);'
);

fs.writeFileSync(file, content);
