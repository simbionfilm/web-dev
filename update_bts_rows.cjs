const fs = require('fs');
const jsFile = 'src/simbionApp.js';
let js = fs.readFileSync(jsFile, 'utf8');

const jsStartStr = "const btsRing = document.getElementById('bts-carousel-ring');";
const jsEndStr = "ScrollTrigger.addEventListener(\"refreshInit\", () => {\n                // Not strictly necessary but good practice\n            });\n        }";

const jsStart = js.indexOf(jsStartStr);
const jsEnd = js.indexOf(jsEndStr, jsStart) + jsEndStr.length;

if (jsStart > -1 && jsEnd > -1) {
    const replacement = `const btsRing = document.getElementById('bts-carousel-ring');
        if (btsRing) {
            btsRing.innerHTML = ''; // Clear contents
            const numImagesPerRow = 14; 
            const isMobile = window.innerWidth < 768;
            const radius = isMobile ? 260 : 600;
            const imgWidth = isMobile ? 120 : 260;
            const rowHeight = isMobile ? 110 : 260; // Vertical distance between rows
            
            btsRing.style.width = imgWidth + 'px';
            btsRing.style.height = (imgWidth * 0.6) + 'px';
            btsRing.style.transformStyle = 'preserve-3d';

            const rows = [];
            
            // Create 3 rings (rows), r = -1, 0, 1
            for (let r = -1; r <= 1; r++) {
                const rowEl = document.createElement('div');
                rowEl.className = 'absolute top-0 left-0 w-full h-full flex justify-center items-center';
                rowEl.style.transformStyle = 'preserve-3d';
                
                // Offset rows vertically
                rowEl.style.transform = \`translateY(\${r * rowHeight}px)\`;

                for (let i = 1; i <= numImagesPerRow; i++) {
                    // Offset the image index for each row for variety
                    const imgIndex = ((i - 1 + (r + 1) * 4) % 14) + 1; 
                    const angle = (i - 1) * (360 / numImagesPerRow);
                    
                    const el = document.createElement('div');
                    el.className = 'absolute top-0 left-0 w-full h-full flex justify-center items-center bts-float';
                    
                    // Add half step offset for middle row to create a brick pattern
                    const angleOffset = r === 0 ? (360 / numImagesPerRow) / 2 : 0;
                    
                    el.style.transform = \`rotateY(\${angle + angleOffset}deg) translateZ(\${radius}px)\`;
                    el.style.backfaceVisibility = 'visible';
                    
                    const img = document.createElement('img');
                    img.src = \`\${imgIndex}.webp\`;
                    img.onerror = () => { img.src = \`https://placehold.co/300x200/111111/FFFFFF?text=BTS+\${imgIndex}\`; };
                    img.alt = \`BTS \${imgIndex}\`;
                    img.className = "w-full h-auto rounded-none opacity-80 hover:opacity-100 hover:scale-110 transition-all duration-300 cursor-pointer bts-card-optimized shadow-2xl";
                    
                    el.appendChild(img);
                    rowEl.appendChild(el);
                }
                
                btsRing.appendChild(rowEl);
                // Top and bottom row go one way, middle row goes the opposite way
                rows.push({ el: rowEl, dir: r === 0 ? -1 : 1 }); 
            }
            
            let baseRotation = 0;
            let scrollRotation = 0;
            
            ScrollTrigger.create({
                trigger: "#the-soul",
                start: "top bottom",
                end: "bottom top",
                scrub: 0.5,
                onUpdate: (self) => {
                    scrollRotation = self.progress * 360; 
                }
            });
            
            let reqId;
            function renderCarousel() {
                baseRotation -= 0.10; // Slowed down slightly for 3 rows
                rows.forEach(row => {
                    const totalRotation = (baseRotation + scrollRotation) * row.dir;
                    gsap.set(row.el, { rotationY: totalRotation });
                });
                reqId = requestAnimationFrame(renderCarousel);
            }
            
            renderCarousel();
            
            ScrollTrigger.addEventListener("refreshInit", () => {
                // Not strictly necessary but good practice
            });
        }`;
            
    js = js.substring(0, jsStart) + replacement + js.substring(jsEnd);
    fs.writeFileSync(jsFile, js);
    console.log("JS replaced successfully.");
} else {
    console.log("Could not find JS boundaries.");
}
