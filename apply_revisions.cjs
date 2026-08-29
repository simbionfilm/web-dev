const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// 1. REVISION: Space to play in center header and smaller
// Find play-hint HTML
const oldPlayHintRegex = /<div id="play-hint"[^>]*>[\s\S]*?<\/div>/;
const newPlayHint = `<div id="play-hint" class="fixed top-5 md:top-6 left-1/2 -translate-x-1/2 z-[105] pointer-events-none opacity-0 transition-all duration-500 font-mono text-[8px] md:text-[9px] tracking-[0.25em] text-lightText/80 bg-[#0a0a0a]/90 border border-white/10 backdrop-blur-md px-3.5 py-1.5 rounded-full flex items-center justify-center transform -translate-y-2 select-none shadow-sm">
        <span>[ SPACE ] TO PLAY</span>
    </div>`;

if (oldPlayHintRegex.test(html)) {
    html = html.replace(oldPlayHintRegex, newPlayHint);
    console.log("Updated play-hint HTML");
}

// Update play-hint JS triggers
html = html.replace(/playHint\.classList\.remove\('opacity-0', 'translate-y-4'\);/g, "playHint.classList.remove('opacity-0', '-translate-y-2');");
html = html.replace(/playHint\.classList\.add\('opacity-0', 'translate-y-4'\);/g, "playHint.classList.add('opacity-0', '-translate-y-2');");

// 2. REVISION: Mobile Back to First Scene arrow & Gallery Item spacing
// Update back-to-scene-btn in renderRecentRelease
const oldBackBtnStr = `<button id="back-to-scene-btn" class="hidden opacity-0 items-center text-lightText/90 hover:text-lightText text-[9px] md:text-[10px] font-bold uppercase tracking-[0.2em]  transition-all duration-300 group interactive-el cursor-pointer py-1">
                            <span class="inline-block animate-scene-float group-hover:text-simbionBlue ">Back to the first scene</span>
                        </button>`;

const newBackBtnStr = `<button id="back-to-scene-btn" class="hidden opacity-0 items-center justify-center text-lightText/90 hover:text-lightText text-[9px] md:text-[10px] font-bold uppercase tracking-[0.2em] transition-all duration-300 group interactive-el cursor-pointer py-1" aria-label="Back to first scene">
                            <span class="hidden sm:inline-block animate-scene-float group-hover:text-simbionBlue">Back to the first scene</span>
                            <span class="sm:hidden flex items-center justify-center w-7 h-7 rounded-full bg-white/10 border border-white/20 text-lightText group-hover:text-simbionBlue group-hover:border-simbionBlue active:scale-90 transition-all shadow-sm">
                                <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                                    <polyline points="18 15 12 9 6 15"></polyline>
                                </svg>
                            </span>
                        </button>`;

html = html.replace(oldBackBtnStr, newBackBtnStr);

// Update gallery item width in CSS
html = html.replace('width: 42vw;\n            aspect-ratio: 16 / 9;', 'width: 38vw;\n            aspect-ratio: 16 / 9;');

// Update renderSelectedWorks function
const oldRenderWorksStart = "function renderSelectedWorks() {";
const oldRenderWorksEnd = "renderRecentRelease();\n            renderSelectedWorks();";
const renderWorksIndex = html.indexOf(oldRenderWorksStart);
const renderWorksEndIndex = html.indexOf(oldRenderWorksEnd);

if (renderWorksIndex !== -1 && renderWorksEndIndex !== -1) {
    const newRenderSelectedWorks = `function renderSelectedWorks() {
                const track = document.getElementById('film-track');
                if (!track) return;
                let html = '';
                
                const row1 = cmsData.works
                    .filter(w => w.row === 1)
                    .sort((a, b) => (parseInt(b.year) || 0) - (parseInt(a.year) || 0));
                const row2 = cmsData.works
                    .filter(w => w.row === 2)
                    .sort((a, b) => (parseInt(b.year) || 0) - (parseInt(a.year) || 0));
                const row3 = cmsData.works
                    .filter(w => w.row === 3)
                    .sort((a, b) => (parseInt(b.year) || 0) - (parseInt(a.year) || 0));

                const isMobile = window.innerWidth < 768;
                const itemSpacing = isMobile ? 48 : 18;
                const startLeft = isMobile ? 105 : 110;

                function renderRows(items, topPercent, rowNum) {
                    let subHtml = '';
                    const baseDepth = rowNum === 1 ? 0.72 : (rowNum === 2 ? 1.0 : 1.38);
                    items.forEach((item, idx) => {
                        const leftPos = startLeft + (idx * itemSpacing);
                        const baseRotation = (Math.random() - 0.5) * 6; 
                        const depthFactor = (baseDepth + (idx % 2 === 0 ? 0.06 : -0.06)).toFixed(2);
                        const depthFactorY = ((idx % 3 === 0 ? 1.0 : -0.8) * (rowNum === 2 ? 0.6 : 1.0)).toFixed(2);

                        subHtml += \`
                            <div class="gallery-item cms-gallery-item" style="left: \${leftPos}vw; top: \${topPercent}%;">
                                <div class="w-full h-full" style="transform: rotate(\${baseRotation}deg);">
                                    <div class="parallax-wrap w-full h-full" data-mx="\${(idx % 2 === 0 ? -4 : 5)}" data-my="\${(idx % 3 === 0 ? 6 : -5)}">
                                        <div class="velocity-parallax w-full h-full" data-depth="\${depthFactor}" data-depth-y="\${depthFactorY}">
                                            <div class="idle-float w-full h-full">
                                                <div class="gallery-item-inner block relative w-full h-full overflow-hidden rounded-sm group cursor-pointer bg-darkBg video-trigger border border-white/10 hover:border-simbionBlue/60 active:scale-95 transition-all duration-500" data-video-id="\${item.videoId}">
                                                    <img src="https://img.youtube.com/vi/\${item.videoId}/maxresdefault.jpg" alt="\${item.title}" class="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-all duration-700 ease-out">
                                                    <div class="absolute inset-x-0 bottom-0 p-3 md:p-4 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-2 group-hover:translate-y-0 text-left pointer-events-none z-20">
                                                        <div class="absolute inset-0 -z-10 bg-gradient-to-t from-darkBg/95 via-darkBg/60 to-transparent"></div>
                                                        <span class="text-[7px] md:text-[9px] text-simbionBlue tracking-[0.2em] font-bold font-mono block uppercase">\${item.year} — \${item.artist}</span>
                                                        <h3 class="text-[10px] md:text-sm font-bold tracking-tight text-lightText mt-0.5 md:mt-1 uppercase">\${item.title}</h3>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        \`;
                    });
                    return subHtml;
                }

                const r1Top = isMobile ? 15 : 14;
                const r2Top = isMobile ? 44 : 41;
                const r3Top = isMobile ? 73 : 68;

                html += renderRows(row1, r1Top, 1);
                html += renderRows(row2, r2Top, 2);
                html += renderRows(row3, r3Top, 3);

                const maxItems = Math.max(row1.length, row2.length, row3.length);
                const dynamicWidth = startLeft + ((maxItems - 1) * itemSpacing) + (isMobile ? 70 : 60) + 90; 
                track.style.width = \`\${dynamicWidth}vw\`;
                track.innerHTML = html;
                
                initVideoTriggers();
                initGalleryInteractions();
                initIdleFloat();
            }

            `;
    html = html.substring(0, renderWorksIndex) + newRenderSelectedWorks + html.substring(renderWorksEndIndex);
    console.log("Updated renderSelectedWorks");
}

// 3. REVISION: Chat balloon ONLY on contact page
// Update initial chat-balloon HTML class to start hidden
html = html.replace('id="chat-balloon" class="fixed bottom-12 md:bottom-16 right-6 md:right-10 z-[105] group cursor-pointer interactive-el floating-widget  transition-all duration-[2500ms] ease-in-out origin-bottom-right"', 'id="chat-balloon" class="fixed bottom-12 md:bottom-16 right-6 md:right-10 z-[105] group cursor-pointer interactive-el floating-widget opacity-0 pointer-events-none transition-all duration-700 ease-in-out origin-bottom-right transform translate-y-4 scale-90"');

// Update initGalleryInteractions for iPad / Touch & Desktop
const oldGalleryInteractions = `function initGalleryInteractions() {
                const galleryItems = document.querySelectorAll('.gallery-item');
                galleryItems.forEach((item) => {
                    const inner = item.querySelector('.gallery-item-inner');
                    if (!inner) return;
                    
                    if (isDesktop) {
                        inner.addEventListener('mouseenter', () => {
                            gsap.set(item, { zIndex: 100 });
                            gsap.to(inner, { 
                                scale: 1.15, 
                                duration: 0.4, 
                                ease: "power2.out", 
                                overwrite: "auto" 
                            });
                        });
                        inner.addEventListener('mouseleave', () => {
                            gsap.to(inner, { 
                                scale: 1, 
                                duration: 0.4, 
                                ease: "power2.out", 
                                overwrite: "auto",
                                onComplete: () => gsap.set(item, { zIndex: 10 }) 
                            });
                        });
                    }
                });
            }`;

const newGalleryInteractions = `function initGalleryInteractions() {
                const galleryItems = document.querySelectorAll('.gallery-item');
                galleryItems.forEach((item) => {
                    const inner = item.querySelector('.gallery-item-inner');
                    if (!inner) return;
                    
                    // Desktop hover
                    inner.addEventListener('mouseenter', () => {
                        gsap.set(item, { zIndex: 100 });
                        gsap.to(inner, { 
                            scale: 1.12, 
                            duration: 0.35, 
                            ease: "power2.out", 
                            overwrite: "auto" 
                        });
                    });
                    inner.addEventListener('mouseleave', () => {
                        gsap.to(inner, { 
                            scale: 1, 
                            duration: 0.35, 
                            ease: "power2.out", 
                            overwrite: "auto",
                            onComplete: () => gsap.set(item, { zIndex: 10 }) 
                        });
                    });

                    // Touch / iPad touchstart & touchend for tactile feedback
                    inner.addEventListener('touchstart', () => {
                        gsap.set(item, { zIndex: 100 });
                        gsap.to(inner, { scale: 1.08, duration: 0.2, ease: "power2.out" });
                    }, { passive: true });

                    inner.addEventListener('touchend', () => {
                        gsap.to(inner, { scale: 1, duration: 0.3, ease: "power2.out", onComplete: () => gsap.set(item, { zIndex: 10 }) });
                    }, { passive: true });
                });
            }`;

html = html.replace(oldGalleryInteractions, newGalleryInteractions);

// Replace chat balloon visibility handling in scroll listeners
const oldScrollPart = `                const cb = document.getElementById('chat-balloon');
                const contactSec = document.getElementById('contact');
                if (cb && contactSec) {
                    const contactRect = contactSec.getBoundingClientRect();
                    if (contactRect.top < window.innerHeight * 0.75) {
                        cb.style.bottom = '50%';
                    } else {
                        cb.style.bottom = '';
                    }
                }`;

const newScrollPart = `                updateChatBalloonState();`;

html = html.replace(oldScrollPart, newScrollPart);

// Inject helper function for updateChatBalloonState
const chatStateHelper = `
            function updateChatBalloonState() {
                const cb = document.getElementById('chat-balloon');
                const cm = document.getElementById('chat-modal');
                const contactSec = document.getElementById('contact');
                if (!cb || !contactSec) return;
                
                // If chat modal is open, keep balloon hidden
                if (cm && !cm.classList.contains('opacity-0') && !cm.classList.contains('pointer-events-none')) {
                    cb.classList.add('opacity-0', 'pointer-events-none', 'scale-90', 'translate-y-4');
                    cb.classList.remove('opacity-100', 'pointer-events-auto', 'scale-100', 'translate-y-0');
                    return;
                }

                const contactRect = contactSec.getBoundingClientRect();
                const inContact = contactRect.top < window.innerHeight * 0.8 && contactRect.bottom > 50;

                if (inContact) {
                    cb.classList.remove('opacity-0', 'pointer-events-none', 'scale-90', 'translate-y-4');
                    cb.classList.add('opacity-100', 'pointer-events-auto', 'scale-100', 'translate-y-0');
                } else {
                    cb.classList.add('opacity-0', 'pointer-events-none', 'scale-90', 'translate-y-4');
                    cb.classList.remove('opacity-100', 'pointer-events-auto', 'scale-100', 'translate-y-0');
                }
            }
`;

html = html.replace('// Contact Chat Form Logic', chatStateHelper + '\n            // Contact Chat Form Logic');

// In lenis.on('scroll') also call updateChatBalloonState()
html = html.replace("updateHeaderSceneState(typeof e.scroll === 'number' ? e.scroll : window.pageYOffset);", "updateHeaderSceneState(typeof e.scroll === 'number' ? e.scroll : window.pageYOffset);\n                updateChatBalloonState();");

// On window resize re-render Selected Works if breakpoint crossed
html = html.replace("measureScrollTrack();", "measureScrollTrack();\n                renderSelectedWorks();\n                updateChatBalloonState();");

fs.writeFileSync('index.html', html, 'utf8');
console.log("All revisions successfully applied!");
