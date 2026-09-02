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

const drawStatementNew = `        function drawStatement(frameIdx, progress = 0) {
            if (!ctxStatement) return;
            const validIdx = Math.max(0, Math.min(totalFrames - 1, Math.floor(frameIdx || 0)));
            const p = Math.max(0, Math.min(1, progress || 0));
            const img = images[validIdx];
            if (!img || !img.complete || img.naturalWidth === 0) return;

            const isMobile = window.innerWidth < 768;
            ctxStatement.clearRect(0, 0, statementWidth, statementHeight);

            const baseScale = isMobile ? 0.72 : 0.88;
            // Scale enters at 140% and settles down to 100% normal scale at center (p=0.5)
            const scaleFactor = Math.min(1, p * 2.0);
            const scaleMultiplier = 1.40 - (0.40 * scaleFactor);
            const currentScale = baseScale * scaleMultiplier;

            // Centers to 50% width
            const currentX = statementWidth * (0.58 - 0.08 * scaleFactor);
            
            // Starts slightly above center (-0.05 height) and reaches center (0.50 height)
            const currentY = statementHeight * (p <= 0.5 ? (-0.05 + 0.55 * (p / 0.5)) : 0.50) + (isMobile ? 20 : 10);

            // Settles from +6deg tilt to 0deg upright
            const rotationRad = (6 * (1 - scaleFactor) * Math.PI) / 180;

            const aspect = (img.naturalWidth || 512) / (img.naturalHeight || 600);
            let renderH = statementHeight * currentScale;
            let renderW = renderH * aspect;

            ctxStatement.save();
            ctxStatement.translate(currentX, currentY);
            ctxStatement.rotate(rotationRad);
            ctxStatement.globalCompositeOperation = "destination-over";
            ctxStatement.shadowColor = 'rgba(0, 10, 194, 0.45)';
            ctxStatement.shadowBlur = isMobile ? 16 : 28;
            ctxStatement.drawImage(img, -renderW / 2, -renderH / 2, renderW, renderH);
            ctxStatement.restore();
        }`;

content = content.replace(drawStatementOld, drawStatementNew);

// Now update the ScrollTrigger logic
const triggerOld = `            ScrollTrigger.create({
                trigger: "#statement",
                start: "top bottom",
                end: "bottom top",
                scrub: 0.6,
                onUpdate: (self) => {
                    const frameIdx = (totalFrames - 1) * self.progress;
                    drawStatement(frameIdx, self.progress);
                }
            });`;

const triggerNew = `            ScrollTrigger.create({
                trigger: "#statement",
                start: "top bottom",
                end: "bottom top",
                scrub: 0.6,
                onUpdate: (self) => {
                    const p = self.progress;
                    let frameIdx;
                    if (p <= 0.5) {
                        frameIdx = (totalFrames - 1) * (p / 0.5);
                    } else {
                        frameIdx = (totalFrames - 1) * (1 - ((p - 0.5) / 0.5));
                    }
                    drawStatement(frameIdx, p);
                }
            });`;

content = content.replace(triggerOld, triggerNew);

fs.writeFileSync(file, content);
