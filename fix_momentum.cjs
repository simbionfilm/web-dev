const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// 1. Remove conflicting CSS transition from recent widget
let targetWidgetClass = `class="flex items-center gap-3 group cursor-pointer interactive-el  transition-all duration-300 transform"`;
let replaceWidgetClass = `class="flex items-center gap-3 group cursor-pointer interactive-el transform will-change-transform"`;
html = html.replace(targetWidgetClass, replaceWidgetClass);

// 2. Update scroll event listener to include momentum scale
let targetScroll = `            window.addEventListener('scroll', () => {
                const currentScrollY = window.pageYOffset;
                const delta = currentScrollY - lastScrollY;
                lastScrollY = currentScrollY;

                const tracks = document.querySelectorAll('.slot-track');

                if (Math.abs(delta) > 0.2) {
                    const dir = delta > 0 ? 1 : -1;
                    tracks.forEach((track, i) => {
                        if (track.dataset.impact === 'true') {
                            const multiplier = (i % 2 === 0) ? 1.5 : 0.9;
                            const dynamicOffset = dir * multiplier * Math.min(Math.abs(delta) * 0.15, 2.75);
                            const offset = Math.max(-8.5, Math.min(-3.0, -5.75 + dynamicOffset));
                            track.style.transform = \`translateY(\${offset}em)\`;
                        }
                    });
                }

                clearTimeout(slotScrollTimeout);
                slotScrollTimeout = setTimeout(() => {
                    tracks.forEach(track => {
                        if (track.dataset.impact === 'true') {
                            track.style.transform = \`translateY(-5.75em)\`;
                        }
                    });
                }, 150);
            }, { passive: true });`;

let replaceScroll = `            window.addEventListener('scroll', () => {
                const currentScrollY = window.pageYOffset;
                const delta = currentScrollY - lastScrollY;
                lastScrollY = currentScrollY;

                const tracks = document.querySelectorAll('.slot-track');
                const recentWidget = document.getElementById('recent-work-widget');

                if (Math.abs(delta) > 0.2) {
                    const dir = delta > 0 ? 1 : -1;
                    tracks.forEach((track, i) => {
                        if (track.dataset.impact === 'true') {
                            const multiplier = (i % 2 === 0) ? 1.5 : 0.9;
                            const dynamicOffset = dir * multiplier * Math.min(Math.abs(delta) * 0.15, 2.75);
                            const offset = Math.max(-8.5, Math.min(-3.0, -5.75 + dynamicOffset));
                            track.style.transform = \`translateY(\${offset}em)\`;
                        }
                    });

                    if (recentWidget) {
                        const absDelta = Math.abs(delta);
                        // Make UI feel physically reactive to scroll velocity
                        const targetScale = Math.min(1 + (absDelta * 0.002), 1.15);
                        // Add very subtle physical skew for momentum feel
                        const targetSkew = Math.max(-2, Math.min(2, delta * 0.02));
                        
                        gsap.to(recentWidget, {
                            scale: targetScale,
                            skewY: targetSkew,
                            duration: 0.15,
                            ease: "power2.out",
                            overwrite: "auto"
                        });
                    }
                }

                clearTimeout(slotScrollTimeout);
                slotScrollTimeout = setTimeout(() => {
                    tracks.forEach(track => {
                        if (track.dataset.impact === 'true') {
                            track.style.transform = \`translateY(-5.75em)\`;
                        }
                    });

                    if (recentWidget) {
                        gsap.to(recentWidget, {
                            scale: 1,
                            skewY: 0,
                            duration: 0.5,
                            ease: "elastic.out(1, 0.4)",
                            overwrite: "auto"
                        });
                    }
                }, 150);
            }, { passive: true });`;

html = html.replace(targetScroll, replaceScroll);

fs.writeFileSync('index.html', html, 'utf8');
console.log("Momentum scroll added");
