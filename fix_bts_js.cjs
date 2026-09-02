const fs = require('fs');
const jsFile = 'src/simbionApp.js';
let js = fs.readFileSync(jsFile, 'utf8');

const jsStartStr = "const marqueeTrack = document.getElementById('marquee-track');";
const jsEndStr = "if (btsSection) btsObserver.observe(btsSection);\n            }";

const jsStart = js.indexOf(jsStartStr);
const jsEnd = js.indexOf(jsEndStr, jsStart);

if (jsStart > -1 && jsEnd > -1) {
    const replacement = `const btsRing = document.getElementById('bts-carousel-ring');
        if (btsRing) {
            const numImages = 14;
            const isMobile = window.innerWidth < 768;
            const radius = isMobile ? 200 : 450;
            const imgWidth = isMobile ? 120 : 260;
            
            btsRing.style.width = imgWidth + 'px';
            btsRing.style.height = (imgWidth * 0.6) + 'px';
            
            for (let i = 1; i <= numImages; i++) {
                const angle = (i - 1) * (360 / numImages);
                const el = document.createElement('div');
                el.className = 'absolute top-0 left-0 w-full h-full flex justify-center items-center bts-float';
                
                // Keep the backface visible but slightly dimmed for depth, CSS will handle 3D perspective
                el.style.transform = \`rotateY(\${angle}deg) translateZ(\${radius}px)\`;
                el.style.backfaceVisibility = 'visible';
                
                const img = document.createElement('img');
                img.src = \`\${i}.webp\`;
                img.onerror = () => { img.src = \`https://placehold.co/300x200/111111/FFFFFF?text=BTS+\${i}\`; };
                img.alt = \`BTS \${i}\`;
                img.className = "w-full h-auto rounded-none opacity-90 hover:opacity-100 hover:scale-110 transition-all duration-300 cursor-pointer bts-card-optimized";
                
                el.appendChild(img);
                btsRing.appendChild(el);
            }
            
            let baseRotation = 0;
            let scrollRotation = 0;
            
            ScrollTrigger.create({
                trigger: "#the-soul",
                start: "top bottom",
                end: "bottom top",
                scrub: 0.5,
                onUpdate: (self) => {
                    scrollRotation = self.progress * 360; // 1 full spin on scroll
                }
            });
            
            let reqId;
            function renderCarousel() {
                baseRotation -= 0.15; // Speed of idle auto-rotation
                const totalRotation = baseRotation + scrollRotation;
                gsap.set(btsRing, { rotationY: totalRotation });
                reqId = requestAnimationFrame(renderCarousel);
            }
            
            // Start render loop
            renderCarousel();
            
            // Clean up to prevent memory leaks if re-initialized
            ScrollTrigger.addEventListener("refreshInit", () => {
                // Not strictly necessary but good practice
            });`;
            
    js = js.substring(0, jsStart) + replacement + js.substring(jsEnd + jsEndStr.length);
    fs.writeFileSync(jsFile, js);
    console.log("JS replaced.");
} else {
    console.log("Could not find JS boundaries.");
}
