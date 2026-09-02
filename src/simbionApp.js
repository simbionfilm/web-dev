import './equipmentData.js';
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { 
    initializeFirestore, 
    getFirestore, 
    collection, 
    addDoc, 
    query, 
    orderBy, 
    limit, 
    onSnapshot, 
    serverTimestamp,
    doc,
    getDocFromServer 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// Firebase initialization
const firebaseConfig = {
    apiKey: "AIzaSyACpOCzUysavBGJgdV1fkvJsjU0sbSMlKQ",
    authDomain: "gen-lang-client-0507056686.firebaseapp.com",
    projectId: "gen-lang-client-0507056686",
    storageBucket: "gen-lang-client-0507056686.firebasestorage.app",
    messagingSenderId: "140728011693",
    appId: "1:140728011693:web:73bf28fe95a86c49976f24"
};

let app = null;
let db = null;
const dbId = "ai-studio-animatedtypograp-bb4e58ac-f74f-4c09-8dd7-ba4232addc13";

try {
    app = initializeApp(firebaseConfig);
    try {
        db = initializeFirestore(app, {
            experimentalAutoDetectLongPolling: true,
            useFetchStreams: false
        }, dbId);
    } catch {
        try {
            db = getFirestore(app, dbId);
        } catch {
            db = getFirestore(app);
        }
    }
} catch (err) {
    console.warn("Firebase initialization notice:", err);
}

window.globalHighScores = [];
window.isFirebaseReady = false;

// Structured error handler according to Firebase guidelines
function handleFirestoreError(error, operationType, path) {
    const errInfo = {
        error: error instanceof Error ? error.message : String(error),
        operationType: operationType,
        path: path,
        timestamp: new Date().toISOString()
    };
    console.warn("Firestore Notification:", JSON.stringify(errInfo));
}

if (db) {
    try {
        const q = query(collection(db, "highscores"), orderBy("time", "asc"), limit(10));
        onSnapshot(q, (snapshot) => {
            const list = [];
            snapshot.forEach((doc) => {
                const data = doc.data();
                if (data && typeof data.name === 'string' && typeof data.time === 'number') {
                    list.push({ name: data.name, time: data.time });
                }
            });
            window.globalHighScores = list;
            window.isFirebaseReady = true;
            if (typeof window.renderLeaderboard === 'function') {
                window.renderLeaderboard();
            }
        }, (error) => {
            handleFirestoreError(error, 'list', 'highscores');
        });
    } catch (e) {
        handleFirestoreError(e, 'list', 'highscores');
    }
}

window.submitScoreToFirebase = async function(name, time) {
    if (!db) return false;
    try {
        await addDoc(collection(db, "highscores"), {
            name: name,
            time: time,
            createdAt: serverTimestamp()
        });
        return true;
    } catch (err) {
        handleFirestoreError(err, 'create', 'highscores');
        return false;
    }
};

function startSimbionApp() {
    if (window.__simbionInitialized) return;
    window.__simbionInitialized = true;

    // Shooting Preloader Logic
    const loader = document.getElementById('fake-loader');
    const loaderText = document.getElementById('loader-text');
    const loaderTextWrap = document.getElementById('loader-text-wrap');
    const loaderImgWrap = document.getElementById('loader-img-wrap');
    const heroMainGif = document.getElementById('hero-main-gif');

    if (heroMainGif && window.gsap) {
        gsap.set(heroMainGif, { y: 0, rotation: 0, scale: 1, opacity: 1 });
    }

    const steps = [
        { text: "CAMERA ROLL", duration: 1100 },
        { text: "AND", duration: 750 },
        { text: "ACTION!", duration: 1000 }
    ];
    let currentStep = 0;

    const runPreloadStep = () => {
        currentStep++;
        if (currentStep < steps.length) {
            const next = steps[currentStep];
            if (loaderText) {
                loaderText.style.transition = 'opacity 0.25s ease, transform 0.25s ease';
                loaderText.style.opacity = '0';
                loaderText.style.transform = 'translateY(8px)';
                setTimeout(() => {
                    loaderText.textContent = next.text;
                    loaderText.style.opacity = '1';
                    loaderText.style.transform = 'translateY(0)';
                }, 200);
            }
            setTimeout(runPreloadStep, next.duration);
        } else {
            setTimeout(() => {
                if (loaderTextWrap && window.gsap) {
                    gsap.to(loaderTextWrap, { opacity: 0, y: 12, duration: 0.4, ease: "power2.out" });
                }
                if (loader && window.gsap) {
                    const tl = gsap.timeline({
                        onComplete: () => {
                            if (loader.parentNode) loader.remove();
                        }
                    });
                    tl.to(loader, { yPercent: -100, duration: 1.05, ease: "power4.inOut" }, 0);
                    if (loaderImgWrap) {
                        tl.to(loaderImgWrap, { y: () => window.innerHeight, duration: 1.05, ease: "power4.inOut" }, 0);
                    }
                    // Fallback to guarantee loader is removed
                    setTimeout(() => {
                        if (loader && loader.parentNode) loader.remove();
                    }, 1400);
                } else if (loader) {
                    loader.style.transition = 'transform 0.8s ease-in-out, opacity 0.8s ease-in-out';
                    loader.style.transform = 'translateY(-100%)';
                    loader.style.opacity = '0';
                    setTimeout(() => {
                        if (loader.parentNode) loader.remove();
                    }, 900);
                }
            }, 400);
        }
    };

    if (loaderText) {
        loaderText.textContent = steps[0].text;
        loaderText.style.opacity = '1';
    }
    setTimeout(runPreloadStep, steps[0].duration);

    // Fluid Kinetic Proximity & Click Ripple Interaction for Paragraphs
    function setupInteractiveParagraph(paraId, wordSelector) {
        const para = document.getElementById(paraId);
        if (!para || !window.gsap) return;

        const isTouch = window.matchMedia("(pointer: coarse)").matches;
        const getWords = () => Array.from(para.querySelectorAll(wordSelector));

        let cachedWords = [];
        function refreshWordRects() {
            const words = getWords();
            cachedWords = words.map(word => {
                const rect = word.getBoundingClientRect();
                return {
                    el: word,
                    cx: rect.left + rect.width / 2,
                    cy: rect.top + rect.height / 2,
                    isAffected: false
                };
            });
        }

        let lastMove = 0;
        para.addEventListener('mouseenter', refreshWordRects, { passive: true });
        
        para.addEventListener('mousemove', (e) => {
            if (isTouch) return;
            const now = Date.now();
            if (now - lastMove < 20) return;
            lastMove = now;

            if (cachedWords.length === 0) refreshWordRects();

            const mouseX = e.clientX;
            const mouseY = e.clientY;
            const maxRadius = 120;

            cachedWords.forEach(item => {
                const dist = Math.hypot(mouseX - item.cx, mouseY - item.cy);

                if (dist < maxRadius) {
                    item.isAffected = true;
                    const intensity = Math.pow(1 - (dist / maxRadius), 1.5);
                    gsap.to(item.el, {
                        y: -10 * intensity,
                        scale: 1 + 0.14 * intensity,
                        skewX: -6 * intensity,
                        color: intensity > 0.45 ? '#0616C6' : (intensity > 0.2 ? '#3E4EF0' : '#DEDEDE'),
                        duration: 0.18,
                        ease: "power2.out",
                        overwrite: "auto"
                    });
                } else if (item.isAffected) {
                    item.isAffected = false;
                    gsap.to(item.el, {
                        y: 0,
                        scale: 1,
                        skewX: 0,
                        color: '#DEDEDE',
                        duration: 0.3,
                        ease: "power2.out",
                        overwrite: "auto"
                    });
                }
            });
        });

        para.addEventListener('mouseleave', () => {
            if (isTouch) return;
            const words = getWords();
            cachedWords.forEach(w => { w.isAffected = false; });
            gsap.to(words, {
                y: 0,
                scale: 1,
                skewX: 0,
                color: '#DEDEDE',
                duration: 0.45,
                ease: "elastic.out(1, 0.5)",
                stagger: { each: 0.005, from: "center" },
                overwrite: "auto"
            });
        });

        para.addEventListener('click', (e) => {
            const words = getWords();
            if (words.length === 0) return;

            const clickX = e.clientX;
            const clickY = e.clientY;

            const sortedWords = words.map(w => {
                const r = w.getBoundingClientRect();
                const d = Math.hypot(clickX - (r.left + r.width / 2), clickY - (r.top + r.height / 2));
                return { el: w, dist: d };
            }).sort((a, b) => a.dist - b.dist);

            const tl = gsap.timeline();
            sortedWords.forEach((item, idx) => {
                const delay = idx * 0.012;
                tl.to(item.el, {
                    y: -14,
                    scale: 1.2,
                    skewX: -8,
                    color: '#0616C6',
                    duration: 0.15,
                    ease: "power2.out"
                }, delay)
                .to(item.el, {
                    y: 0,
                    scale: 1,
                    skewX: 0,
                    color: '#DEDEDE',
                    duration: 0.35,
                    ease: "elastic.out(1.2, 0.4)"
                }, delay + 0.15);
            });
        });
    }

    // Animate About Us paragraph line by line
    function animateAboutText() {
        const para = document.getElementById('about-desc-text');
        if (!para || !window.gsap) return;

        if (!para.dataset.originalText) {
            para.dataset.originalText = para.textContent.trim().replace(/\s+/g, ' ');
        }
        const rawText = para.dataset.originalText;
        const words = rawText.split(' ');

        if (para._textTl) {
            if (para._textTl.scrollTrigger) para._textTl.scrollTrigger.kill();
            para._textTl.kill();
            para._textTl = null;
        }

        para.innerHTML = words.map(word => 
            `<span class="about-mask"><span class="about-slide"><span class="about-word">${word}</span></span></span> `
        ).join('');

        const slideElements = Array.from(para.querySelectorAll('.about-slide'));
        if (slideElements.length === 0) return;

        let lines = [];
        let currentLine = [];
        let prevTop = null;

        slideElements.forEach(el => {
            const top = Math.round(el.getBoundingClientRect().top);
            if (prevTop === null) {
                prevTop = top;
                currentLine.push(el);
            } else if (Math.abs(top - prevTop) > 6) {
                lines.push(currentLine);
                currentLine = [el];
                prevTop = top;
            } else {
                currentLine.push(el);
            }
        });
        if (currentLine.length > 0) lines.push(currentLine);

        gsap.set(slideElements, { yPercent: 110, opacity: 0.15, rotateX: -15 });

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: "#about",
                start: "top 75%",
                end: "top 20%",
                scrub: 1.2,
                invalidateOnRefresh: true
            }
        });

        lines.forEach((lineWords, lineIndex) => {
            tl.to(lineWords, {
                yPercent: 0,
                opacity: 1,
                rotateX: 0,
                stagger: 0.02,
                duration: 1,
                ease: "power3.out"
            }, lineIndex * 0.3);
        });

        para._textTl = tl;
        setupInteractiveParagraph('about-desc-text', '.about-word');
    }

    // Animate Statement text on scroll
    function animateStatementScroll() {
        const para = document.getElementById('statement-desc-text') || document.getElementById('fit-desc-text');
        if (!para || !window.gsap) return;

        if (!para.dataset.originalText) {
            para.dataset.originalText = para.textContent.trim().replace(/\s+/g, ' ');
        }
        const rawText = para.dataset.originalText;
        const words = rawText.split(' ');

        if (para._textTl) {
            if (para._textTl.scrollTrigger) para._textTl.scrollTrigger.kill();
            para._textTl.kill();
            para._textTl = null;
        }

        para.innerHTML = words.map(word => 
            `<span class="statement-mask"><span class="statement-slide"><span class="statement-word">${word}</span></span></span> `
        ).join('');

        const slideElements = Array.from(para.querySelectorAll('.statement-slide'));
        if (slideElements.length === 0) return;

        let lines = [];
        let currentLine = [];
        let prevTop = null;

        slideElements.forEach(el => {
            const top = Math.round(el.getBoundingClientRect().top);
            if (prevTop === null) {
                prevTop = top;
                currentLine.push(el);
            } else if (Math.abs(top - prevTop) > 6) {
                lines.push(currentLine);
                currentLine = [el];
                prevTop = top;
            } else {
                currentLine.push(el);
            }
        });
        if (currentLine.length > 0) lines.push(currentLine);

        gsap.set(slideElements, { yPercent: 110, opacity: 0.15, rotateX: -15 });

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: "#statement",
                start: "top 75%",
                end: "top 18%",
                scrub: 1.2,
                invalidateOnRefresh: true
            }
        });

        lines.forEach((lineWords, lineIndex) => {
            tl.to(lineWords, {
                yPercent: 0,
                opacity: 1,
                rotateX: 0,
                stagger: 0.02,
                duration: 1,
                ease: "power3.out"
            }, lineIndex * 0.3);
        });

        para._textTl = tl;
        setupInteractiveParagraph('statement-desc-text', '.statement-word');
    }

    // Crazy 3D Character Physics for "WE ARE WHAT WE'VE MADE"
    function initWeAreCrazy() {
        const section = document.getElementById('we-are-made');
        if (!section || !window.gsap) return;

        const words = section.querySelectorAll('.we-are-word');
        words.forEach(wordEl => {
            if (!wordEl.dataset.originalText) {
                wordEl.dataset.originalText = wordEl.textContent.trim();
            }
            const text = wordEl.dataset.originalText;
            wordEl.innerHTML = text.split('').map(char => {
                return `<span class="we-are-char">${char === ' ' ? '&nbsp;' : char}</span>`;
            }).join('');
        });

        const chars = Array.from(section.querySelectorAll('.we-are-char'));
        const isTouch = window.matchMedia("(pointer: coarse)").matches;

        let charData = [];
        function measureChars() {
            charData = chars.map((ch, idx) => {
                const rect = ch.getBoundingClientRect();
                return {
                    el: ch,
                    idx,
                    cx: rect.left + rect.width / 2,
                    cy: rect.top + rect.height / 2,
                    isHoveredState: false
                };
            });
        }

        let mouseX = -9999;
        let mouseY = -9999;
        let isHovered = false;
        const startTime = Date.now();
        let isWeAreVisible = false;
        let waveRafId = null;

        function updateWave() {
            if (!isWeAreVisible) {
                waveRafId = null;
                return;
            }

            if (charData.length === 0) measureChars();

            const t = (Date.now() - startTime) * 0.0018;
            const radius = 180;

            charData.forEach(item => {
                const ch = item.el;
                const idx = item.idx;
                const dist = isHovered ? Math.hypot(mouseX - item.cx, mouseY - item.cy) : 9999;

                if (isHovered && dist < radius) {
                    item.isHoveredState = true;
                    const power = Math.pow(1 - (dist / radius), 1.6);
                    gsap.to(ch, {
                        x: (item.cx - mouseX) * 0.2 * power,
                        y: -45 * power,
                        z: 80 * power,
                        rotateX: 60 * power,
                        rotateY: (item.cx > mouseX ? 60 : -60) * power,
                        rotateZ: (Math.random() - 0.5) * 45 * power,
                        scale: 1 + 0.6 * power,
                        filter: `blur(${power * 4}px)`,
                        color: power > 0.3 ? '#3E4EF0' : '#DEDEDE',
                        duration: 0.12,
                        ease: "power2.out",
                        overwrite: "auto"
                    });
                } else {
                    if (item.isHoveredState) {
                        item.isHoveredState = false;
                        gsap.killTweensOf(ch);
                    }
                    const liquidY = Math.sin(t * 1.1 + idx * 0.25) * 12;
                    const liquidX = Math.cos(t * 0.9 + idx * 0.2) * 6;
                    const liquidScale = 1 + Math.sin(t * 1.5 + idx * 0.3) * 0.06;
                    const liquidBlur = 0.8 + Math.max(0, Math.sin(t * 0.8 + idx * 0.3)) * 4.2;

                    ch.style.transform = `translate3d(${liquidX.toFixed(2)}px, ${liquidY.toFixed(2)}px, 0) scale(${liquidScale.toFixed(3)})`;
                    ch.style.filter = `blur(${liquidBlur.toFixed(1)}px)`;
                    ch.style.color = '#DEDEDE';
                }
            });
            waveRafId = requestAnimationFrame(updateWave);
        }

        const weAreObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                isWeAreVisible = entry.isIntersecting;
                if (isWeAreVisible) {
                    measureChars();
                    if (!waveRafId) waveRafId = requestAnimationFrame(updateWave);
                } else if (waveRafId) {
                    cancelAnimationFrame(waveRafId);
                    waveRafId = null;
                }
            });
        }, { rootMargin: "150px" });

        weAreObserver.observe(section);

        let lastMove = 0;
        section.addEventListener('mousemove', (e) => {
            if (isTouch) return;
            const now = Date.now();
            if (now - lastMove < 16) return;
            lastMove = now;
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        section.addEventListener('mouseleave', () => {
            if (isTouch) return;
            isHovered = false;
            mouseX = -9999;
            mouseY = -9999;
        });

        section.addEventListener('mouseenter', () => {
            if (isTouch) return;
            isHovered = true;
        });

        section.addEventListener('click', (e) => {
            const clickX = e.clientX;
            const clickY = e.clientY;

            chars.forEach((ch, idx) => {
                const rect = ch.getBoundingClientRect();
                const cx = rect.left + rect.width / 2;
                const cy = rect.top + rect.height / 2;
                const angle = Math.atan2(cy - clickY, cx - clickX);

                const randomDist = 80 + Math.random() * 140;
                const targetX = Math.cos(angle) * randomDist;
                const targetY = Math.sin(angle) * randomDist;

                const tl = gsap.timeline();
                tl.to(ch, {
                    x: targetX,
                    y: targetY,
                    z: 180 + Math.random() * 120,
                    rotateX: (Math.random() - 0.5) * 360,
                    rotateY: (Math.random() - 0.5) * 360,
                    rotateZ: (Math.random() - 0.5) * 180,
                    scale: 1.8,
                    filter: 'blur(3px)',
                    color: '#0616C6',
                    duration: 0.2,
                    ease: "power3.out"
                })
                .to(ch, {
                    x: 0,
                    y: 0,
                    z: 0,
                    rotateX: 0,
                    rotateY: 0,
                    rotateZ: 0,
                    scale: 1,
                    filter: 'blur(0px)',
                    color: '#DEDEDE',
                    duration: 0.85,
                    ease: "elastic.out(1.3, 0.3)"
                }, 0.2 + (idx * 0.006));
            });
        });
    }

    // 3 Independent 3D Sequences (1 in #about, 1 in #we-are-made, 1 in #statement)
    let is3DSequenceInitialized = false;
    function init3DCanvasSequence() {
        if (is3DSequenceInitialized) return;
        is3DSequenceInitialized = true;
        const aboutCanvas = document.getElementById('about-3d-canvas');
        const aboutSection = document.getElementById('about');
        const weAreCanvas = document.getElementById('we-are-3d-canvas');
        const weAreSection = document.getElementById('we-are-made');
        const statementCanvas = document.getElementById('statement-3d-canvas');
        const statementSection = document.getElementById('statement');

        if (!aboutCanvas || !aboutSection || !weAreCanvas || !weAreSection || !window.gsap) return;

        const supabaseBaseUrl = "https://emjwdjdzbatvzljsouav.supabase.co/storage/v1/object/public/web%20asset/3d/";
        const totalFrames = 244;
        const images = new Array(totalFrames);
        window.sequenceTotalFrames = totalFrames;
        window.sequenceImages = images;

        const rawVectors = (window.sequence3DFrames && window.sequence3DFrames.length >= 60)
            ? window.sequence3DFrames
            : [];

        // Nearest-neighbor loaded frame resolver (eliminates flickering & blank states)
        window.getNearestSequenceFrame = function(targetIdx) {
            const seq = window.sequenceImages;
            if (!seq || seq.length === 0) return null;
            const max = window.sequenceTotalFrames || 244;
            const clamped = Math.max(0, Math.min(max - 1, Math.floor(targetIdx || 0)));
            
            const direct = seq[clamped];
            if (direct && direct.complete && direct.naturalWidth > 0) {
                return direct;
            }
            
            // Search nearby loaded keyframes
            for (let offset = 1; offset <= 32; offset++) {
                const left = clamped - offset;
                if (left >= 0 && seq[left] && seq[left].complete && seq[left].naturalWidth > 0) {
                    return seq[left];
                }
                const right = clamped + offset;
                if (right < max && seq[right] && seq[right].complete && seq[right].naturalWidth > 0) {
                    return seq[right];
                }
            }
            return null;
        };

        // Priority stratified frame loader with controlled concurrency
        const loadQueue = [];
        let activeLoads = 0;
        const MAX_CONCURRENT_LOADS = 4;

        function processLoadQueue() {
            while (activeLoads < MAX_CONCURRENT_LOADS && loadQueue.length > 0) {
                const frameIndex = loadQueue.shift();
                if (images[frameIndex - 1]) continue; // Already loaded or in progress
                
                activeLoads++;
                const img = new Image();
                img.decoding = "async";
                img.crossOrigin = "anonymous";
                const p3 = String(frameIndex).padStart(3, '0');
                const primaryUrl = `${supabaseBaseUrl}ezgif-frame-${p3}.png`;
                const fallbackUrl = `${supabaseBaseUrl}${p3}.png`;

                const onFinished = () => {
                    activeLoads--;
                    // Async decode if supported to avoid main thread raster jank
                    if (img.decode) {
                        img.decode().then(() => {
                            images[frameIndex - 1] = img;
                            requestRender();
                        }).catch(() => {
                            images[frameIndex - 1] = img;
                            requestRender();
                        });
                    } else {
                        images[frameIndex - 1] = img;
                        requestRender();
                    }
                    processLoadQueue();
                };

                img.onload = onFinished;
                img.onerror = function() {
                    if (this.src !== fallbackUrl) {
                        this.src = fallbackUrl;
                    } else if (rawVectors.length > 0) {
                        this.onerror = null;
                        this.src = rawVectors[(frameIndex - 1) % rawVectors.length];
                    } else {
                        onFinished();
                    }
                };

                img.src = primaryUrl;
            }
        }

        function enqueueFrames(indices) {
            indices.forEach(idx => {
                if (idx >= 1 && idx <= totalFrames && !loadQueue.includes(idx)) {
                    loadQueue.push(idx);
                }
            });
            processLoadQueue();
        }

        // Tier 1: Immediate Keyframes (every 8th frame for instant scrub response)
        const tier1Keyframes = [1];
        for (let i = 8; i <= totalFrames; i += 8) tier1Keyframes.push(i);
        enqueueFrames(tier1Keyframes);

        // Tier 2: Secondary Keyframes (every 4th frame)
        setTimeout(() => {
            const tier2 = [];
            for (let i = 4; i <= totalFrames; i += 4) {
                if (!tier1Keyframes.includes(i)) tier2.push(i);
            }
            enqueueFrames(tier2);
        }, 120);

        // Tier 3: All remaining frames in background idle chunks
        setTimeout(() => {
            const tier3 = [];
            for (let i = 1; i <= totalFrames; i++) {
                if (!tier1Keyframes.includes(i) && (i % 4 !== 0)) tier3.push(i);
            }
            enqueueFrames(tier3);
        }, 400);

        // ==========================================
        // DIRTY-FLAG COALESCED RENDER PIPELINE
        // ==========================================
        let isAboutVisible = false;
        let isWeAreVisible = false;
        let isStatementVisible = false;

        let aboutFrameIdx = 0, aboutProgress = 0, aboutDirty = true;
        let weAreFrameIdx = 0, weAreProgress = 0, weAreDirty = true;
        let statementFrameIdx = 0, statementProgress = 0, statementDirty = true;

        let renderRafId = null;

        function renderLoop() {
            renderRafId = null;

            if (isAboutVisible && aboutDirty) {
                drawAboutDirect(aboutFrameIdx, aboutProgress);
                aboutDirty = false;
            }
            if (isWeAreVisible && weAreDirty) {
                drawWeAreDirect(weAreFrameIdx, weAreProgress);
                weAreDirty = false;
            }
            if (isStatementVisible && statementDirty && statementCanvas) {
                drawStatementDirect(statementFrameIdx, statementProgress);
                statementDirty = false;
            }
        }

        function requestRender() {
            if (!renderRafId) {
                renderRafId = requestAnimationFrame(renderLoop);
            }
        }

        // Viewport Visibility Observers
        const visibilityObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.target === aboutSection) {
                    isAboutVisible = entry.isIntersecting;
                    if (isAboutVisible) { aboutDirty = true; requestRender(); }
                } else if (entry.target === weAreSection) {
                    isWeAreVisible = entry.isIntersecting;
                    if (isWeAreVisible) { weAreDirty = true; requestRender(); }
                } else if (entry.target === statementSection) {
                    isStatementVisible = entry.isIntersecting;
                    if (isStatementVisible) { statementDirty = true; requestRender(); }
                }
            });
        }, { rootMargin: "250px" });

        visibilityObserver.observe(aboutSection);
        visibilityObserver.observe(weAreSection);
        if (statementSection) visibilityObserver.observe(statementSection);

        // ==========================================
        // 1. CANVAS 1: ABOUT SECTION
        // ==========================================
        const ctxAbout = aboutCanvas.getContext('2d', { alpha: true, desynchronized: true });
        let aboutWidth = window.innerWidth;
        let aboutHeight = window.innerHeight;

        function resizeAbout() {
            if (!ctxAbout) return;
            const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
            
            aboutWidth = aboutSection.clientWidth || window.innerWidth;
            aboutHeight = aboutSection.clientHeight || window.innerHeight;

            aboutCanvas.width = Math.floor(aboutWidth * dpr);
            aboutCanvas.height = Math.floor(aboutHeight * dpr);
            aboutCanvas.style.width = `${aboutWidth}px`;
            aboutCanvas.style.height = `${aboutHeight}px`;
            
            // Clean render with zero glow/shadow
            aboutCanvas.style.filter = "none";
            aboutCanvas.style.opacity = "1";
            aboutCanvas.style.willChange = "transform";

            ctxAbout.setTransform(1, 0, 0, 1, 0, 0);
            ctxAbout.scale(dpr, dpr);
            aboutDirty = true;
            requestRender();
        }

        function drawAboutDirect(frameIdx, progress) {
            if (!ctxAbout) return;
            const p = Math.max(0, Math.min(1, progress || 0));
            const img = window.getNearestSequenceFrame(frameIdx);
            if (!img || !img.complete || img.naturalWidth === 0) return;

            const isMobile = window.innerWidth < 768;
            ctxAbout.clearRect(0, 0, aboutWidth, aboutHeight);
            ctxAbout.imageSmoothingEnabled = true;
            ctxAbout.imageSmoothingQuality = "high";

            const baseScale = isMobile ? 0.70 : 0.85;
            const scaleMultiplier = 1.35 - (0.2 * p);
            const currentScale = baseScale * scaleMultiplier;

            const currentX = aboutWidth * ((isMobile ? 0.60 : 0.64) - (0.12 * p));
            const startY = aboutHeight * 0.45;
            const endY = aboutHeight * 1.35;
            const currentY = startY * (1 - p) + endY * p;

            const rotationDeg = 14 * (1 - p) + 6 * p;
            const rotationRad = (rotationDeg * Math.PI) / 180;

            const aspect = (img.naturalWidth || 512) / (img.naturalHeight || 600);
            let renderH = aboutHeight * currentScale;
            let renderW = renderH * aspect;

            ctxAbout.save();
            ctxAbout.translate(currentX, currentY);
            ctxAbout.rotate(rotationRad);
            ctxAbout.drawImage(img, -renderW / 2, -renderH / 2, renderW, renderH);
            ctxAbout.restore();
        }

        resizeAbout();

        ScrollTrigger.create({
            trigger: "#about",
            start: "top bottom",
            end: "bottom top",
            scrub: 0.5,
            onUpdate: (self) => {
                isAboutVisible = true;
                aboutFrameIdx = (window.sequenceTotalFrames - 1) * self.progress;
                aboutProgress = self.progress;
                aboutDirty = true;
                requestRender();
            }
        });

        // ==========================================
        // 2. CANVAS 2: WE ARE WHAT WE'VE MADE SECTION
        // ==========================================
        const ctxWeAre = weAreCanvas.getContext('2d', { alpha: true, desynchronized: true });
        let weAreWidth = window.innerWidth;
        let weAreHeight = window.innerHeight;

        function resizeWeAre() {
            if (!ctxWeAre) return;
            const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
            weAreWidth = weAreSection.clientWidth || window.innerWidth;
            weAreHeight = weAreSection.clientHeight || window.innerHeight;

            weAreCanvas.width = Math.floor(weAreWidth * dpr);
            weAreCanvas.height = Math.floor(weAreHeight * dpr);
            weAreCanvas.style.width = `${weAreWidth}px`;
            weAreCanvas.style.height = `${weAreHeight}px`;
            
            // Clean render with zero glow/shadow and full opacity
            weAreCanvas.style.filter = "none";
            weAreCanvas.style.opacity = "1";
            weAreCanvas.style.willChange = "transform";

            ctxWeAre.setTransform(1, 0, 0, 1, 0, 0);
            ctxWeAre.scale(dpr, dpr);
            weAreDirty = true;
            requestRender();
        }

        function drawWeAreDirect(frameIdx, progress) {
            if (!ctxWeAre) return;
            const p = Math.max(0, Math.min(1, progress || 0));
            const img = window.getNearestSequenceFrame(frameIdx);
            if (!img || !img.complete || img.naturalWidth === 0) return;

            const isMobile = window.innerWidth < 768;
            ctxWeAre.clearRect(0, 0, weAreWidth, weAreHeight);
            ctxWeAre.imageSmoothingEnabled = true;
            ctxWeAre.imageSmoothingQuality = "high";

            const baseScale = isMobile ? 0.72 : 0.88;
            const scaleFactor = Math.min(1, p * 2.0);
            const scaleMultiplier = 1.40 - (0.40 * scaleFactor);
            const currentScale = baseScale * scaleMultiplier;

            const currentX = weAreWidth * (0.58 - 0.08 * scaleFactor);
            const currentY = weAreHeight * (p <= 0.5 ? (-0.05 + 0.55 * (p / 0.5)) : 0.50) + (isMobile ? 20 : 10);
            const rotationRad = (6 * (1 - scaleFactor) * Math.PI) / 180;

            const aspect = (img.naturalWidth || 512) / (img.naturalHeight || 600);
            let renderH = weAreHeight * currentScale;
            let renderW = renderH * aspect;

            ctxWeAre.save();
            ctxWeAre.translate(currentX, currentY);
            ctxWeAre.rotate(rotationRad);
            ctxWeAre.drawImage(img, -renderW / 2, -renderH / 2, renderW, renderH);
            ctxWeAre.restore();
        }

        resizeWeAre();

        ScrollTrigger.create({
            trigger: "#we-are-made",
            start: "top bottom",
            end: "bottom top",
            scrub: 0.5,
            onUpdate: (self) => {
                isWeAreVisible = true;
                const p = self.progress;
                weAreFrameIdx = (p <= 0.5)
                    ? (window.sequenceTotalFrames - 1) * (p / 0.5)
                    : (window.sequenceTotalFrames - 1) * (1 - ((p - 0.5) / 0.5));
                weAreProgress = p;
                weAreDirty = true;
                requestRender();
            }
        });

        // ==========================================
        // 3. CANVAS 3: STATEMENT SECTION
        // ==========================================
        const ctxStatement = statementCanvas ? statementCanvas.getContext('2d', { alpha: true, desynchronized: true }) : null;
        let statementWidth = window.innerWidth;
        let statementHeight = window.innerHeight;

        function resizeStatement() {
            if (!ctxStatement || !statementCanvas || !statementSection) return;
            const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
            statementWidth = statementSection.clientWidth || window.innerWidth;
            statementHeight = statementSection.clientHeight || window.innerHeight;

            statementCanvas.width = Math.floor(statementWidth * dpr);
            statementCanvas.height = Math.floor(statementHeight * dpr);
            statementCanvas.style.width = `${statementWidth}px`;
            statementCanvas.style.height = `${statementHeight}px`;
            
            // Clean render with zero glow/shadow
            statementCanvas.style.filter = "none";
            statementCanvas.style.opacity = "1";
            statementCanvas.style.willChange = "transform";

            ctxStatement.setTransform(1, 0, 0, 1, 0, 0);
            ctxStatement.scale(dpr, dpr);
            statementDirty = true;
            requestRender();
        }

        function drawStatementDirect(frameIdx, progress) {
            if (!ctxStatement) return;
            const p = Math.max(0, Math.min(1, progress || 0));
            const img = window.getNearestSequenceFrame(frameIdx);
            if (!img || !img.complete || img.naturalWidth === 0) return;

            const isMobile = window.innerWidth < 768;
            ctxStatement.clearRect(0, 0, statementWidth, statementHeight);
            ctxStatement.imageSmoothingEnabled = true;
            ctxStatement.imageSmoothingQuality = "high";

            const baseScale = isMobile ? 0.35 : 0.40;
            const scaleFactor = Math.min(1, p * 2.0);
            const scaleMultiplier = 1.40 - (0.40 * scaleFactor);
            const currentScale = baseScale * scaleMultiplier;

            const baseOffsetX = isMobile ? 0.95 : 0.88;
            const currentX = statementWidth * (baseOffsetX - 0.08 * scaleFactor);
            const currentY = statementHeight * (p <= 0.5 ? (-0.05 + 0.55 * (p / 0.5)) : 0.50) + (isMobile ? 20 : 10);
            const rotationRad = (6 * (1 - scaleFactor) * Math.PI) / 180;

            const aspect = (img.naturalWidth || 512) / (img.naturalHeight || 600);
            let renderH = statementHeight * currentScale;
            let renderW = renderH * aspect;

            ctxStatement.save();
            ctxStatement.translate(currentX, currentY);
            ctxStatement.rotate(rotationRad);
            ctxStatement.globalCompositeOperation = "destination-over";
            ctxStatement.drawImage(img, -renderW / 2, -renderH / 2, renderW, renderH);
            ctxStatement.restore();
        }

        if (statementCanvas) {
            resizeStatement();
            ScrollTrigger.create({
                trigger: "#statement",
                start: "top bottom",
                end: "bottom top",
                scrub: 0.5,
                onUpdate: (self) => {
                    const p = self.progress;
                    statementFrameIdx = (p <= 0.5)
                        ? (window.sequenceTotalFrames - 1) * (p / 0.5)
                        : (window.sequenceTotalFrames - 1) * (1 - ((p - 0.5) / 0.5));
                    statementProgress = p;
                    statementDirty = true;
                    requestRender();
                }
            });
        }

        window.addEventListener('resize', () => {
            resizeAbout();
            resizeWeAre();
            if (statementCanvas) resizeStatement();
        }, { passive: true });

        // Initial render
        requestRender();
    }

    function initParagraphAnimations() {
        animateAboutText();
        animateStatementScroll();
        initWeAreCrazy();
        init3DCanvasSequence();
    }

    // Custom Cursor Logic
    const cursor = document.getElementById('custom-cursor');
    const isDesktop = window.matchMedia("(pointer: fine) and (hover: hover) and (min-width: 1025px)").matches;

    if (isDesktop && cursor) {
        window.addEventListener('mousemove', (e) => {
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';
        });
    }

    // Modals & Notifications
    window.showToast = function(msg) {
        const toast = document.getElementById('custom-toast');
        const msgEl = document.getElementById('toast-message');
        if (!toast || !msgEl) return;
        msgEl.textContent = msg;
        toast.classList.remove('opacity-0', 'pointer-events-none', '-translate-y-4');
        toast.classList.add('opacity-100', 'translate-y-0');
        setTimeout(() => {
            toast.classList.remove('opacity-100', 'translate-y-0');
            toast.classList.add('opacity-0', 'pointer-events-none', '-translate-y-4');
        }, 3500);
    };

    window.showConfirm = function(title, desc, onConfirm) {
        const modal = document.getElementById('custom-confirm-modal');
        const inner = modal ? modal.querySelector('.modal-inner') : null;
        if (!modal || !inner) return;
        
        document.getElementById('confirm-title').textContent = title;
        document.getElementById('confirm-desc').textContent = desc;
        
        modal.classList.remove('opacity-0', 'pointer-events-none');
        setTimeout(() => inner.classList.remove('scale-95'), 10);
        
        const yesBtn = document.getElementById('confirm-yes');
        const noBtn = document.getElementById('confirm-no');

        const cleanup = () => {
            inner.classList.add('scale-95');
            setTimeout(() => modal.classList.add('opacity-0', 'pointer-events-none'), 300);
            yesBtn.onclick = null;
            noBtn.onclick = null;
        };

        yesBtn.onclick = () => { cleanup(); onConfirm(); };
        noBtn.onclick = () => { cleanup(); };
    };

    // CMS Data and Secrets
    const SECRET_KEYWORD = "fundamental"; 
    const ADMIN_PASSWORD = "simbiosismutualisme"; 
    const CMS_DATA_VERSION = "2026_difki_belum_selesai";

    const defaultCMS = {
        recentRelease: {
            title: "DIFKI KHALIF — BELUM SELESAI",
            videoId: "Zwc_1gSKLzM",
            link: "https://www.youtube.com/watch?v=Zwc_1gSKLzM&list=RDZwc_1gSKLzM&start_radio=1"
        },
        works: [
            { title: "BELUM SELESAI", artist: "DIFKI KHALIF", year: "2026", videoId: "Zwc_1gSKLzM", row: 1 },
            { title: "ANTARA", artist: "STEREOWALL", year: "2026", videoId: "7KA1LaIy804", row: 1 },
            { title: "SEANDAINYA", artist: "DIFKI KHALIF & PRINSA MANDAGIE", year: "2026", videoId: "7UJ1DoYP-Qw", row: 1 },
            { title: "BERI AKU KESEMPATAN", artist: "STEVAN PASARIBU", year: "2025", videoId: "2x_EYv5H68o", row: 1 },
            { title: "GELANG", artist: "THE MARSOEDI FT. RIZKA NADIYAH", year: "2025", videoId: "9NhXdGxEQA0", row: 1 },
            { title: "PUTUSIN AKU DONG", artist: "PROJECT POP", year: "2025", videoId: "cI8VzJE1tNg", row: 1 },
            { title: "TERJEBAK IMAJINASI", artist: "STEREOWALL", year: "2024", videoId: "4vevtQBeH78", row: 1 },
            
            { title: "JALAN TENGAH", artist: "MIKHA TAMBAYONG & RAYI PUTRA", year: "2026", videoId: "GM71bWErDoo", row: 2 },
            { title: "TIBA TIBA KAU", artist: "DNANDA", year: "2026", videoId: "8ma_y-Xmo-Q", row: 2 },
            { title: "KISAH KASIH DI JAKARTA", artist: "RAFI SUDIRMAN FT. GAC", year: "2025", videoId: "A5YICW1I_kc", row: 2 },
            { title: "MERAYAKAN HARI INI", artist: "ARAJI", year: "2024", videoId: "LAVUtHyvisM", row: 2 },
            { title: "MAK COMBLANG", artist: "AQEELA CALISTA", year: "2023", videoId: "kzYYiRGzODI", row: 2 },
            { title: "BERJALAN LAGI", artist: "RICKY ZAKNO", year: "2023", videoId: "h2ODH39tzAQ", row: 2 },

            { title: "AKU BUTUH PERAWATAN", artist: "SITI BADRIAH", year: "2024", videoId: "JhjB7e1twX8", row: 3 },
            { title: "SELALU UNTUK SELAMANYA", artist: "STEVAN PASARIBU & HANIN DHIYA", year: "2024", videoId: "0NMZVR4TaDk", row: 3 },
            { title: "SATU TUJU", artist: "MAHALINI X RIZKY FEBIAN", year: "2022", videoId: "g89VhNDBrsY", row: 3 },
            { title: "YOU'RE MINE", artist: "RIZKY FEBIAN & MAHALINI", year: "2022", videoId: "mvvddC6NZT4", row: 3 },
            { title: "AMINLAH BERSAMAKU", artist: "RIZKY FEBIAN", year: "2022", videoId: "Za2t7fFrkUw", row: 3 },
            { title: "HINGGA TUA BERSAMA", artist: "RIZKY FEBIAN", year: "2022", videoId: "b5ZQob-mDGM", row: 3 }
        ]
    };

    let cmsData;
    try {
        const storedVersion = localStorage.getItem('simbion_cms_version');
        const storedData = localStorage.getItem('simbion_cms');
        if (storedVersion === CMS_DATA_VERSION && storedData) {
            cmsData = JSON.parse(storedData);
        } else {
            cmsData = defaultCMS;
            localStorage.setItem('simbion_cms', JSON.stringify(defaultCMS));
            localStorage.setItem('simbion_cms_version', CMS_DATA_VERSION);
        }
    } catch(e) {
        cmsData = defaultCMS;
    }

    let isPastHero = false;

    function updateHeaderSceneState(scrollY) {
        const heroEl = document.getElementById('hero');
        const heroThreshold = heroEl ? (heroEl.offsetHeight * 0.45) : (window.innerHeight * 0.45);
        const currentY = typeof scrollY === 'number' ? scrollY : (window.pageYOffset || document.documentElement.scrollTop || 0);
        const past = currentY > heroThreshold;

        if (past !== isPastHero) {
            isPastHero = past;
            const rwWidget = document.getElementById('recent-work-widget');
            const backBtn = document.getElementById('back-to-scene-btn');
            
            if (rwWidget && backBtn && window.gsap) {
                gsap.killTweensOf([rwWidget, backBtn]);
                if (isPastHero) {
                    gsap.to(rwWidget, {
                        opacity: 0,
                        y: -10,
                        duration: 0.3,
                        ease: "power2.inOut",
                        onComplete: () => {
                            rwWidget.style.display = 'none';
                            backBtn.style.display = 'flex';
                            gsap.fromTo(backBtn, 
                                { opacity: 0, y: 10 }, 
                                { opacity: 1, y: 0, duration: 0.35, ease: "power2.out" }
                            );
                        }
                    });
                } else {
                    gsap.to(backBtn, {
                        opacity: 0,
                        y: -10,
                        duration: 0.3,
                        ease: "power2.inOut",
                        onComplete: () => {
                            backBtn.style.display = 'none';
                            rwWidget.style.display = 'flex';
                            gsap.fromTo(rwWidget, 
                                { opacity: 0, y: 10 }, 
                                { opacity: 1, y: 0, duration: 0.35, ease: "power2.out" }
                            );
                        }
                    });
                }
            }
        }
    }

    function renderRecentRelease() {
        const container = document.getElementById('recent-release-container');
        if (!container) return;
        const rr = cmsData.recentRelease;
        isPastHero = false;
        container.innerHTML = `
            <div id="top-nav-action-wrap" class="fixed top-6 right-6 z-[105] flex items-center justify-end pointer-events-auto select-none h-[17px] md:h-[23px]">
                <a id="recent-work-widget" href="${rr.link}" target="_blank" class="flex items-center gap-3 group cursor-pointer interactive-el transform will-change-transform origin-right" title="${rr.title}">
                    <div class="text-right hidden sm:block pointer-events-none leading-none">
                        <span class="text-[9px] md:text-[10px] tracking-[0.2em] font-bold text-lightText uppercase block mb-0.5">RECENT WORK</span>
                        <span class="text-[10px] md:text-[11px] font-bold tracking-tight text-lightText block uppercase max-w-[140px] md:max-w-[210px] truncate group-hover:text-simbionBlue">${rr.title}</span>
                    </div>
                    <div class="relative flex items-center shrink-0 pr-5 md:pr-6 py-0.5">
                        <div class="absolute left-5 md:left-6 w-9 h-9 md:w-11 md:h-11 rounded-full vinyl-disc flex items-center justify-center z-10 transition-transform duration-500 ease-out group-hover:translate-x-2">
                            <div class="w-full h-full rounded-full flex items-center justify-center animate-vinyl-spin relative">
                                <div class="absolute inset-[2px] rounded-full border border-white/[0.1] pointer-events-none"></div>
                                <div class="absolute inset-[4.5px] rounded-full border border-white/[0.07] pointer-events-none"></div>
                                <div class="absolute inset-[7px] rounded-full border border-white/[0.09] pointer-events-none"></div>
                                <div class="absolute inset-[9.5px] rounded-full border border-white/[0.06] pointer-events-none"></div>
                                <div class="absolute inset-0 rounded-full bg-[conic-gradient(from_0deg,transparent_0_30deg,rgba(222,222,222,0.16)_45deg,transparent_60_210deg,rgba(222,222,222,0.16)_225deg,transparent_240deg)] pointer-events-none"></div>
                                <div class="relative w-3.5 h-3.5 md:w-4 md:h-4 rounded-full bg-simbionBlue overflow-hidden flex items-center justify-center border border-white/40 z-20">
                                    <img src="https://img.youtube.com/vi/${rr.videoId}/maxresdefault.jpg" alt="" class="w-full h-full object-cover">
                                    <div class="absolute w-1 h-1 bg-darkBg rounded-full border border-white/80 z-30"></div>
                                </div>
                            </div>
                        </div>
                        <div class="relative z-20 w-9 h-9 md:w-11 md:h-11 rounded-[3px] bg-darkBg overflow-hidden border border-white/20 transition-all duration-300 group-hover:scale-105 group-hover:border-white/40">
                            <img src="https://img.youtube.com/vi/${rr.videoId}/maxresdefault.jpg" alt="${rr.title}" class="w-full h-full object-cover block">
                            <div class="absolute inset-0 pointer-events-none"></div>
                            <div class="absolute top-0 right-0 bottom-0 w-1.5 pointer-events-none"></div>
                            <div class="absolute top-0 left-0 bottom-0 w-[2px] bg-white/25 pointer-events-none"></div>
                        </div>
                    </div>
                </a>

                <button id="back-to-scene-btn" class="hidden opacity-0 items-center justify-center text-lightText/90 hover:text-lightText text-[9px] md:text-[10px] font-bold uppercase tracking-[0.2em] transition-all duration-300 group interactive-el cursor-pointer py-1" aria-label="Back to first scene">
                    <span class="hidden sm:inline-block animate-scene-float group-hover:text-simbionBlue">Back to the first scene</span>
                    <span class="sm:hidden flex items-center justify-center w-7 h-7 rounded-full bg-white/10 border border-white/20 text-lightText group-hover:text-simbionBlue group-hover:border-simbionBlue active:scale-90 transition-all shadow-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                            <polyline points="18 15 12 9 6 15"></polyline>
                        </svg>
                    </span>
                </button>
            </div>
        `;

        const backBtn = document.getElementById('back-to-scene-btn');
        if (backBtn) {
            backBtn.addEventListener('click', () => {
                if (typeof window.lenis !== 'undefined' && window.lenis) {
                    window.lenis.scrollTo(0, { duration: 1.6, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
                } else {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                }
            });
        }
    }

    let idleFloatTweens = [];

    function initIdleFloat() {
        if (!window.gsap) return;
        idleFloatTweens.forEach(t => t.kill());
        idleFloatTweens = [];
        gsap.killTweensOf('.idle-float');

        const floatElements = gsap.utils.toArray('.idle-float');
        floatElements.forEach((el, i) => {
            const yDist = (i % 2 === 0 ? 14 : -14) + gsap.utils.random(-6, 6);
            const xDist = (i % 3 === 0 ? 10 : -10) + gsap.utils.random(-5, 5);
            const rotDist = (i % 2 === 0 ? 2.5 : -2.5) + gsap.utils.random(-1, 1);
            const dur = gsap.utils.random(8.0, 14.0);

            const tw = gsap.to(el, {
                y: yDist,
                x: xDist,
                rotation: rotDist,
                duration: dur,
                ease: "sine.inOut",
                repeat: -1,
                yoyo: true,
                delay: (i * 0.3) % 2.5
            });
            idleFloatTweens.push(tw);
        });
    }

    function renderSelectedWorks() {
        const track = document.getElementById('film-track');
        if (!track) return;
        let html = '';
        
        const row1 = cmsData.works.filter(w => w.row === 1).sort((a, b) => (parseInt(b.year) || 0) - (parseInt(a.year) || 0));
        const row2 = cmsData.works.filter(w => w.row === 2).sort((a, b) => (parseInt(b.year) || 0) - (parseInt(a.year) || 0));
        const row3 = cmsData.works.filter(w => w.row === 3).sort((a, b) => (parseInt(b.year) || 0) - (parseInt(a.year) || 0));

        const isMobile = window.innerWidth < 768;
        const itemSpacing = isMobile ? 74 : 18;
        const startLeft = isMobile ? 100 : 110;

        function renderRows(items, topPercent, rowNum) {
            let subHtml = '';
            const baseDepth = rowNum === 1 ? 0.72 : (rowNum === 2 ? 1.0 : 1.38);
            items.forEach((item, idx) => {
                const leftPos = startLeft + (idx * itemSpacing);
                const baseRotation = (Math.random() - 0.5) * 6; 
                const depthFactor = (baseDepth + (idx % 2 === 0 ? 0.06 : -0.06)).toFixed(2);
                const depthFactorY = ((idx % 3 === 0 ? 1.0 : -0.8) * (rowNum === 2 ? 0.6 : 1.0)).toFixed(2);

                subHtml += `
                    <div class="gallery-item cms-gallery-item" style="left: ${leftPos}vw; top: ${topPercent}%;">
                        <div class="w-full h-full" style="transform: rotate(${baseRotation}deg);">
                            <div class="parallax-wrap w-full h-full" data-mx="${(idx % 2 === 0 ? -4 : 5)}" data-my="${(idx % 3 === 0 ? 6 : -5)}">
                                <div class="velocity-parallax w-full h-full" data-depth="${depthFactor}" data-depth-y="${depthFactorY}">
                                    <div class="idle-float w-full h-full">
                                        <div class="gallery-item-inner block relative w-full h-full overflow-hidden rounded-sm group cursor-pointer bg-darkBg video-trigger border border-white/10 hover:border-simbionBlue/60 active:scale-95 transition-all duration-500" data-video-id="${item.videoId}">
                                            <img src="https://img.youtube.com/vi/${item.videoId}/maxresdefault.jpg" alt="${item.title}" class="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-all duration-700 ease-out">
                                            <div class="absolute inset-x-0 bottom-0 p-3 md:p-4 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-2 group-hover:translate-y-0 text-left pointer-events-none z-20">
                                                <div class="absolute inset-0 -z-10 bg-gradient-to-t from-darkBg/95 via-darkBg/60 to-transparent"></div>
                                                <span class="text-[7px] md:text-[9px] text-simbionBlue tracking-[0.2em] font-bold font-mono block uppercase">${item.year} — ${item.artist}</span>
                                                <h3 class="text-[10px] md:text-sm font-bold tracking-tight text-lightText mt-0.5 md:mt-1 uppercase">${item.title}</h3>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
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
        track.style.width = `${dynamicWidth}vw`;
        track.innerHTML = html;
        
        initVideoTriggers();
        initGalleryInteractions();
        initIdleFloat();
    }

    renderRecentRelease();
    renderSelectedWorks();

    function createSlotText() {
        const groups = new Map();
        document.querySelectorAll('.velocity-line').forEach(line => {
            const parentId = line.closest('section')?.id || line.closest('div').id;
            if (!groups.has(parentId)) groups.set(parentId, []);
            groups.get(parentId).push(line);
        });

        groups.forEach((lines) => {
            let totalChars = 0;
            lines.forEach(line => {
                const text = line.getAttribute('data-text');
                if (text) totalChars += text.replace(/ /g, '').length;
            });

            const impactedIndices = new Set();
            while(impactedIndices.size < 5 && impactedIndices.size < totalChars) {
                impactedIndices.add(Math.floor(Math.random() * totalChars));
            }

            let currentIndex = 0;
            lines.forEach(line => {
                const text = line.getAttribute('data-text');
                if (!text) return;
                line.innerHTML = '';
                text.split('').forEach(char => {
                    if (char === ' ') {
                        const space = document.createElement('span');
                        space.className = 'inline-block w-[0.3em]';
                        line.appendChild(space);
                        return;
                    }
                    const wrapper = document.createElement('span');
                    wrapper.className = 'slot-wrapper';

                    const track = document.createElement('div');
                    track.className = 'slot-track';
                    track.dataset.orig = char;

                    const isImpacted = impactedIndices.has(currentIndex);
                    track.dataset.impact = isImpacted ? 'true' : 'false';
                    currentIndex++;

                    const letters = Array(11).fill(char);

                    letters.forEach(l => {
                        const span = document.createElement('span');
                        span.className = 'slot-char';
                        span.textContent = l;
                        track.appendChild(span);
                    });

                    wrapper.appendChild(track);
                    line.appendChild(wrapper);
                });
            });
        });
    }
    createSlotText();

    let lastScrollY = window.pageYOffset;
    let slotScrollTimeout;
    const impactTracks = Array.from(document.querySelectorAll('.slot-track[data-impact="true"]'));
    const recentWidget = document.getElementById('recent-work-widget');

    window.addEventListener('scroll', () => {
        const currentScrollY = window.pageYOffset;
        const delta = currentScrollY - lastScrollY;
        lastScrollY = currentScrollY;

        if (Math.abs(delta) > 0.2 && impactTracks.length > 0) {
            const dir = delta > 0 ? 1 : -1;
            impactTracks.forEach((track, i) => {
                const multiplier = (i % 2 === 0) ? 1.5 : 0.9;
                const dynamicOffset = dir * multiplier * Math.min(Math.abs(delta) * 0.15, 2.75);
                const offset = Math.max(-8.5, Math.min(-3.0, -5.75 + dynamicOffset));
                track.style.transform = `translateY(${offset}em)`;
            });

            if (recentWidget && window.gsap) {
                const absDelta = Math.abs(delta);
                const targetScale = Math.min(1 + (absDelta * 0.002), 1.15);
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
            impactTracks.forEach(track => {
                track.style.transform = `translateY(-5.75em)`;
            });

            if (recentWidget && window.gsap) {
                gsap.to(recentWidget, {
                    scale: 1,
                    skewY: 0,
                    duration: 0.5,
                    ease: "elastic.out(1, 0.4)",
                    overwrite: "auto"
                });
            }
        }, 150);
    }, { passive: true });

    let isContactVisibleForBalloon = false;
    const contactSec = document.getElementById('contact');
    if (contactSec) {
        const contactObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                isContactVisibleForBalloon = entry.isIntersecting;
                updateChatBalloonState();
            });
        }, { threshold: [0, 0.25, 0.5] });
        contactObserver.observe(contactSec);
    }

    function updateChatBalloonState() {
        const cb = document.getElementById('chat-balloon');
        const cm = document.getElementById('chat-modal');
        if (!cb) return;
        
        if (cm && !cm.classList.contains('opacity-0') && !cm.classList.contains('pointer-events-none')) {
            cb.classList.add('opacity-0', 'pointer-events-none', 'scale-90', 'translate-y-4');
            cb.classList.remove('opacity-100', 'pointer-events-auto', 'scale-100', 'translate-y-0');
            return;
        }

        const isMobile = window.innerWidth < 768;

        if (isMobile) {
            if (isContactVisibleForBalloon) {
                cb.classList.remove('opacity-0', 'pointer-events-none', 'scale-90', 'translate-y-4');
                cb.classList.add('opacity-100', 'pointer-events-auto', 'scale-100', 'translate-y-0');
            } else {
                cb.classList.add('opacity-0', 'pointer-events-none', 'scale-90', 'translate-y-4');
                cb.classList.remove('opacity-100', 'pointer-events-auto', 'scale-100', 'translate-y-0');
            }
        } else {
            cb.classList.remove('opacity-0', 'pointer-events-none', 'scale-90', 'translate-y-4');
            cb.classList.add('opacity-100', 'pointer-events-auto', 'scale-100', 'translate-y-0');

            if (isContactVisibleForBalloon) {
                cb.style.bottom = '50%';
            } else {
                cb.style.bottom = '';
            }
        }
    }

    const chatBalloon = document.getElementById('chat-balloon');
    const chatModal = document.getElementById('chat-modal');
    const closeChatBtn = document.getElementById('close-chat');
    const chatForm = document.getElementById('contact-chat-form');

    function openChatModal() {
        if (!chatBalloon || !chatModal) return;
        chatBalloon.classList.add('opacity-0', 'pointer-events-none', 'scale-75');
        chatModal.classList.remove('opacity-0', 'pointer-events-none', 'translate-y-8', 'scale-95');
    }

    function closeChatModal() {
        if (!chatBalloon || !chatModal) return;
        chatModal.classList.add('opacity-0', 'pointer-events-none', 'translate-y-8', 'scale-95');
        chatBalloon.classList.remove('opacity-0', 'pointer-events-none', 'scale-75');
    }

    if (chatBalloon) chatBalloon.addEventListener('click', openChatModal);
    if (closeChatBtn) closeChatBtn.addEventListener('click', closeChatModal);

    document.addEventListener('click', (e) => {
        if (chatModal && !chatModal.classList.contains('opacity-0') && !chatModal.contains(e.target) && !chatBalloon.contains(e.target)) {
            closeChatModal();
        }
    });

    if (chatForm) {
        chatForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const submitBtn = document.getElementById('chat-submit-btn');
            if (submitBtn) submitBtn.textContent = "SENDING...";

            const formData = new FormData(chatForm);
            const object = Object.fromEntries(formData);
            const json = JSON.stringify(object);

            try {
                const response = await fetch("https://api.web3forms.com/submit", {
                    method: "POST",
                    headers: { "Content-Type": "application/json", "Accept": "application/json" },
                    body: json
                });
                const result = await response.json();
                if (result.success) {
                    showToast("Pesan berhasil terkirim ke Simbion Film!");
                    chatForm.reset();
                    closeChatModal();
                } else {
                    showToast("Gagal mengirim pesan. Silakan coba lagi.");
                }
            } catch (error) {
                console.error(error);
                showToast("Terjadi kesalahan koneksi.");
            } finally {
                if (submitBtn) submitBtn.textContent = "SEND MESSAGE";
            }
        });
    }

    const videoModal = document.getElementById('video-modal');
    const modalIframe = document.getElementById('modal-iframe');
    const closeModalBtn = document.getElementById('close-modal');

    function initVideoTriggers() {
        document.querySelectorAll('.video-trigger').forEach(trigger => {
            trigger.addEventListener('click', (e) => {
                e.preventDefault();
                const videoId = trigger.getAttribute('data-video-id');
                if (modalIframe) modalIframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;
                if (videoModal) {
                    videoModal.classList.remove('opacity-0', 'pointer-events-none');
                    const inner = videoModal.querySelector('.modal-inner');
                    if(inner) setTimeout(() => inner.classList.remove('scale-95'), 10);
                }
                document.body.style.overflow = 'hidden';
            });
        });
    }

    function closeVideoModal() {
        if (videoModal) {
            const inner = videoModal.querySelector('.modal-inner');
            if(inner) inner.classList.add('scale-95');
            setTimeout(() => {
                videoModal.classList.add('opacity-0', 'pointer-events-none');
                if (modalIframe) modalIframe.src = '';
            }, 300);
        }
        document.body.style.overflow = '';
    }

    if (closeModalBtn) closeModalBtn.addEventListener('click', closeVideoModal);
    if (videoModal) {
        videoModal.addEventListener('click', (e) => {
            if (e.target === videoModal) closeVideoModal();
        });
    }

    // CMS & Password Logic
    const passwordModal = document.getElementById('password-modal');
    const passwordForm = document.getElementById('password-form');
    const adminPasswordInput = document.getElementById('admin-password');
    const closePasswordBtn = document.getElementById('close-password');
    
    const cmsModal = document.getElementById('cms-modal');
    const closeCmsBtn = document.getElementById('close-cms');
    const saveCmsBtn = document.getElementById('cms-save');
    const resetCmsBtn = document.getElementById('cms-reset');
    const addItemBtn = document.getElementById('cms-add-item');

    let typedBuffer = "";
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeVideoModal();
            closeCmsModal();
            closePasswordModal();
            closeChatModal();
        }

        if (document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
            typedBuffer += e.key.toLowerCase();
            if (typedBuffer.length > 20) typedBuffer = typedBuffer.slice(-20);
            if (typedBuffer.includes(SECRET_KEYWORD.toLowerCase())) {
                typedBuffer = "";
                requestPasswordPrompt();
            }
        }
    });

    function requestPasswordPrompt() {
        if (!adminPasswordInput || !passwordModal) return;
        adminPasswordInput.value = '';
        passwordModal.classList.remove('opacity-0', 'pointer-events-none');
        const inner = passwordModal.querySelector('.modal-inner');
        if(inner) setTimeout(() => inner.classList.remove('scale-95'), 10);
        adminPasswordInput.focus();
        document.body.style.overflow = 'hidden';
    }

    function closePasswordModal() {
        if (!passwordModal) return;
        const inner = passwordModal.querySelector('.modal-inner');
        if(inner) inner.classList.add('scale-95');
        setTimeout(() => {
            passwordModal.classList.add('opacity-0', 'pointer-events-none');
            document.body.style.overflow = '';
        }, 300);
    }

    if (closePasswordBtn) closePasswordBtn.addEventListener('click', closePasswordModal);

    if (passwordForm) {
        passwordForm.addEventListener('submit', (e) => {
            e.preventDefault();
            if (adminPasswordInput && adminPasswordInput.value === ADMIN_PASSWORD) {
                closePasswordModal();
                setTimeout(openCmsModal, 350);
            } else {
                showToast('Incorrect Password!');
                if (adminPasswordInput) adminPasswordInput.value = '';
            }
        });
    }

    function openCmsModal() {
        if (!cmsModal) return;
        if (typeof window.lenis !== 'undefined' && window.lenis) window.lenis.stop();
        const rrTitle = document.getElementById('cms-rr-title');
        const rrId = document.getElementById('cms-rr-id');
        const rrLink = document.getElementById('cms-rr-link');
        if (rrTitle) rrTitle.value = cmsData.recentRelease.title;
        if (rrId) rrId.value = cmsData.recentRelease.videoId;
        if (rrLink) rrLink.value = cmsData.recentRelease.link;
        renderCmsWorksList();
        
        cmsModal.classList.remove('opacity-0', 'pointer-events-none');
        const inner = cmsModal.querySelector('.modal-inner');
        if(inner) setTimeout(() => inner.classList.remove('scale-95'), 10);
        document.body.style.overflow = 'hidden';
    }

    function closeCmsModal() {
        if (!cmsModal) return;
        const inner = cmsModal.querySelector('.modal-inner');
        if(inner) inner.classList.add('scale-95');
        setTimeout(() => {
            cmsModal.classList.add('opacity-0', 'pointer-events-none');
            document.body.style.overflow = '';
            if (typeof window.lenis !== 'undefined' && window.lenis) window.lenis.start();
        }, 300);
    }

    if (closeCmsBtn) closeCmsBtn.addEventListener('click', closeCmsModal);

    function renderCmsWorksList() {
        const container = document.getElementById('cms-items-container');
        const countEl = document.getElementById('cms-count');
        if (!container || !countEl) return;
        countEl.textContent = cmsData.works.length;
        let html = '';
        cmsData.works.forEach((w, index) => {
            html += `
                <div class="bg-darkBg border border-white/10 p-4 rounded-2xl flex flex-col md:flex-row gap-4 items-center justify-between hover:border-white/20" data-index="${index}">
                    <div class="grid grid-cols-2 md:grid-cols-5 gap-3 w-full">
                        <input type="text" class="cms-title bg-darkBg border border-white/20 rounded-xl px-3 py-2 text-xs focus:border-simbionBlue outline-none" value="${w.title}" placeholder="Title">
                        <input type="text" class="cms-artist bg-darkBg border border-white/20 rounded-xl px-3 py-2 text-xs focus:border-simbionBlue outline-none" value="${w.artist}" placeholder="Artist">
                        <input type="text" class="cms-year bg-darkBg border border-white/20 rounded-xl px-3 py-2 text-xs focus:border-simbionBlue outline-none" value="${w.year}" placeholder="Year">
                        <input type="text" class="cms-id bg-darkBg border border-white/20 rounded-xl px-3 py-2 text-xs focus:border-simbionBlue outline-none" value="${w.videoId}" placeholder="YouTube ID">
                        <select class="cms-row bg-darkBg border border-white/20 rounded-xl px-3 py-2 text-xs text-lightText focus:border-simbionBlue outline-none">
                            <option value="1" ${w.row==1?'selected':''}>Row 1 (Top)</option>
                            <option value="2" ${w.row==2?'selected':''}>Row 2 (Mid)</option>
                            <option value="3" ${w.row==3?'selected':''}>Row 3 (Btm)</option>
                        </select>
                    </div>
                    <button class="cms-del bg-red-500/20 text-red-400 hover:bg-red-500 hover:text-lightText px-3 py-2 rounded-xl text-xs font-mono shrink-0">DELETE</button>
                </div>
            `;
        });
        container.innerHTML = html;

        container.querySelectorAll('.cms-del').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const idx = parseInt(e.target.closest('[data-index]').getAttribute('data-index'));
                cmsData.works.splice(idx, 1);
                renderCmsWorksList();
            });
        });
    }

    if (addItemBtn) {
        addItemBtn.addEventListener('click', () => {
            cmsData.works.push({ title: "NEW WORK", artist: "ARTIST", year: "2026", videoId: "7KA1LaIy804", row: 1 });
            renderCmsWorksList();
            const container = document.getElementById('cms-items-container');
            if (container) setTimeout(() => container.scrollTop = container.scrollHeight, 50);
        });
    }

    if (saveCmsBtn) {
        saveCmsBtn.addEventListener('click', () => {
            const rrTitle = document.getElementById('cms-rr-title');
            const rrId = document.getElementById('cms-rr-id');
            const rrLink = document.getElementById('cms-rr-link');
            if (rrTitle) cmsData.recentRelease.title = rrTitle.value;
            if (rrId) cmsData.recentRelease.videoId = rrId.value;
            if (rrLink) cmsData.recentRelease.link = rrLink.value;

            const itemNodes = document.querySelectorAll('#cms-items-container > div');
            cmsData.works = [];
            itemNodes.forEach(node => {
                cmsData.works.push({
                    title: node.querySelector('.cms-title').value,
                    artist: node.querySelector('.cms-artist').value,
                    year: node.querySelector('.cms-year').value,
                    videoId: node.querySelector('.cms-id').value,
                    row: parseInt(node.querySelector('.cms-row').value)
                });
            });

            localStorage.setItem('simbion_cms', JSON.stringify(cmsData));
            renderRecentRelease();
            renderSelectedWorks();
            closeCmsModal();
            setTimeout(() => window.location.reload(), 350); 
        });
    }

    if (resetCmsBtn) {
        resetCmsBtn.addEventListener('click', () => {
            showConfirm("Reset Defaults", "Reset all items to default?", () => {
                localStorage.removeItem('simbion_cms');
                cmsData = JSON.parse(JSON.stringify(defaultCMS));
                renderRecentRelease();
                renderSelectedWorks();
                closeCmsModal();
                window.location.reload();
            });
        });
    }

    const resetScoresBtn = document.getElementById('cms-reset-scores');
    if (resetScoresBtn) {
        resetScoresBtn.addEventListener('click', () => {
            showConfirm("Reset Highscores", "Clear local highscores data?", () => {
                localStorage.removeItem('simbion_speedrun');
                highScores = [];
                renderLeaderboard();
                showToast("Local highscores cleared!");
            });
        });
    }

    // Lenis Smooth Scroll
    const isTouchDevice = window.matchMedia("(pointer: coarse), (hover: none), (max-width: 1024px)").matches;

    const lenis = new Lenis({
        duration: isTouchDevice ? 1.4 : 2.0, 
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), 
        direction: 'vertical',
        gestureDirection: 'vertical',
        smooth: true,
        smoothTouch: true,
        touchMultiplier: 1.6,
        wheelMultiplier: 0.75, 
        infinite: false,
    });
    window.lenis = lenis;

    ScrollTrigger.config({ ignoreMobileResize: true });

    // Mini Game Logic
    const playHint = document.getElementById('play-hint');
    const gameOverlay = document.getElementById('game-overlay');
    const closeGameBtn = document.getElementById('close-game');
    const gameArea = document.getElementById('game-area');
    const playerEl = document.getElementById('game-player');
    const scoreEl = document.getElementById('game-score');
    const wordEl = document.getElementById('game-word');
    const startMsg = document.getElementById('game-start-msg');
    const overMsg = document.getElementById('game-over-msg');
    const winMsg = document.getElementById('game-win-msg');
    
    const nameInputWin = document.getElementById('player-name-input-win');
    const winInputArea = document.getElementById('game-win-input-area');
    const scoreList = document.getElementById('score-list');
    const scorePanel = document.getElementById('scoreboard-panel');
    
    let isGameActive = false;
    let gameState = 'ready';
    let gameLoopId;
    let startTime = 0;
    let elapsedTime = 0;
    let entities = [];
    
    let playerX = 0; 
    let targetPlayerX = 0;
    let playerSpeed = 18;
    let keys = { ArrowLeft: false, ArrowRight: false };
    
    let fallSpeed = 6;
    let frameCount = 0;
    let obstacleCounter = 0;
    
    const targetWord = "SIMBION";
    let collectedCount = 0;
    let currentPlayerName = "";
    let hasSavedScore = false;

    let highScores = [];
    try {
        const stored = localStorage.getItem('simbion_speedrun');
        if (stored) highScores = JSON.parse(stored);
    } catch(e) {}

    function renderLeaderboard() {
        const sourceList = (window.globalHighScores && window.globalHighScores.length > 0)
            ? window.globalHighScores
            : highScores;

        const sorted = [...(sourceList || [])].sort((a, b) => a.time - b.time).slice(0, 10);

        if (scoreList) {
            scoreList.innerHTML = '';
            if (sorted.length === 0) {
                scoreList.innerHTML = '<div class="text-white/40 text-center text-xs mt-6 tracking-widest">NO SCORES YET</div>';
            } else {
                sorted.forEach((entry, idx) => {
                    const row = document.createElement('div');
                    row.className = 'flex justify-between items-center border-b border-white/10 pb-2';
                    const colorClass = idx === 0 ? 'text-[#000AC2] font-black' : (idx === 1 ? 'text-white font-bold' : 'text-white/80');
                    row.innerHTML = `<span class="${colorClass}">${idx + 1}. ${entry.name}</span><span class="${colorClass}">${entry.time.toFixed(2)}s</span>`;
                    scoreList.appendChild(row);
                });
            }
        }

        const mobileOverList = document.getElementById('score-list-mobile-over');
        if (mobileOverList) {
            mobileOverList.innerHTML = '';
            if (sorted.length === 0) {
                mobileOverList.innerHTML = '<div class="text-white/40 text-center text-[10px] py-1 tracking-widest">NO SCORES YET</div>';
            } else {
                sorted.slice(0, 5).forEach((entry, idx) => {
                    const row = document.createElement('div');
                    row.className = 'flex justify-between items-center border-b border-white/10 pb-1';
                    const colorClass = idx === 0 ? 'text-[#000AC2] font-black' : (idx === 1 ? 'text-white font-bold' : 'text-white/80');
                    row.innerHTML = `<span class="${colorClass}">${idx + 1}. ${entry.name}</span><span class="${colorClass}">${entry.time.toFixed(2)}s</span>`;
                    mobileOverList.appendChild(row);
                });
            }
        }

        const mobileWinList = document.getElementById('score-list-mobile-win');
        if (mobileWinList) {
            mobileWinList.innerHTML = '';
            if (sorted.length === 0) {
                mobileWinList.innerHTML = '<div class="text-black/40 text-center text-[10px] py-1 tracking-widest">NO SCORES YET</div>';
            } else {
                sorted.slice(0, 5).forEach((entry, idx) => {
                    const row = document.createElement('div');
                    row.className = 'flex justify-between items-center border-b border-black/10 pb-1';
                    const colorClass = idx === 0 ? 'text-[#000AC2] font-black' : (idx === 1 ? 'text-black font-bold' : 'text-black/80');
                    row.innerHTML = `<span class="${colorClass}">${idx + 1}. ${entry.name}</span><span class="${colorClass}">${entry.time.toFixed(2)}s</span>`;
                    mobileWinList.appendChild(row);
                });
            }
        }
    }
    window.renderLeaderboard = renderLeaderboard;

    function isQualifyingScore(time) {
        const sourceList = (window.globalHighScores && window.globalHighScores.length > 0)
            ? window.globalHighScores
            : highScores;
        const sorted = [...(sourceList || [])].sort((a, b) => a.time - b.time);
        if (sorted.length < 10) return true;
        return time < sorted[9].time;
    }

    function saveScore(inputEl, areaEl) {
        if (hasSavedScore || gameState === 'playing' || gameState === 'ready') return;
        if (!isQualifyingScore(elapsedTime)) {
            if (areaEl) {
                areaEl.classList.add('hidden');
                areaEl.classList.remove('flex');
            }
            return;
        }
        const val = inputEl.value.trim();
        if (val.length === 0) {
            inputEl.focus();
            inputEl.style.borderColor = 'red';
            setTimeout(() => inputEl.style.borderColor = '#000AC2', 300);
            return;
        }
        currentPlayerName = val.substring(0, 12).toUpperCase();
        
        if (elapsedTime > 0 && gameState === 'win') {
            highScores.push({ name: currentPlayerName, time: elapsedTime });
            highScores.sort((a, b) => a.time - b.time);
            highScores = highScores.slice(0, 10);
            try {
                localStorage.setItem('simbion_speedrun', JSON.stringify(highScores));
            } catch(e) {}

            if (typeof window.submitScoreToFirebase === 'function') {
                window.submitScoreToFirebase(currentPlayerName, elapsedTime);
            }

            hasSavedScore = true;
            renderLeaderboard();
            
            if (areaEl) {
                areaEl.classList.add('hidden');
                areaEl.classList.remove('flex');
            }
        }
    }

    let hintInterval;
    let hintTimeout;
    
    function triggerHint() {
        if (isGameActive || !playHint) return;
        playHint.classList.remove('opacity-0', '-translate-y-2');
        clearTimeout(hintTimeout);
        hintTimeout = setTimeout(() => {
            playHint.classList.add('opacity-0', '-translate-y-2');
        }, 3000);
    }
    
    hintInterval = setInterval(triggerHint, 10000);
    setTimeout(triggerHint, 3000);
    
    const logoTrigger = document.querySelector('nav img[alt="SIMBION FILM"]');
    if (logoTrigger) {
        logoTrigger.parentElement.addEventListener('click', (e) => {
            if (window.innerWidth < 768) {
                e.preventDefault();
                openGame();
            }
        });
    }

    if (playHint) {
        playHint.addEventListener('click', () => {
            if (window.innerWidth < 768) {
                openGame();
            }
        });
    }

    function openGame() {
        isGameActive = true;
        if(playHint) playHint.classList.add('opacity-0', '-translate-y-2');
        gameOverlay.classList.remove('hidden');
        gameOverlay.classList.add('flex');
        document.body.style.overflow = 'hidden';
        if (document.activeElement && document.activeElement.blur) {
            document.activeElement.blur();
        }
        if (window.lenis) window.lenis.stop();
        cancelAnimationFrame(gameLoopId);
        renderLeaderboard();
        showStartScreen();
    }

    function closeGame() {
        isGameActive = false;
        gameOverlay.classList.add('hidden');
        gameOverlay.classList.remove('flex');
        document.body.style.overflow = '';
        if (window.lenis) window.lenis.start();
        cancelAnimationFrame(gameLoopId);
        clearEntities();
    }

    function showStartScreen() {
        gameState = 'ready';
        if (scorePanel) scorePanel.style.opacity = '1';
        startMsg.classList.remove('hidden');
        overMsg.classList.add('hidden');
        winMsg.classList.add('hidden');
        winInputArea.classList.add('hidden');
        resetGameStats();
    }

    let invincibilityTimer = null;
    let invincibilityEndTime = 0;
    let isInvincibleActive = false;
    const slowMoOverlay = document.getElementById('slowmo-overlay');
    const slowMoHud = document.getElementById('slowmo-hud');
    const slowMoCountdownText = document.getElementById('slowmo-countdown-text');

    function triggerInvincibility() {
        isInvincibleActive = true;
        invincibilityEndTime = Date.now() + 5000;
        if (slowMoOverlay) slowMoOverlay.style.opacity = '1';
        if (slowMoHud) {
            slowMoHud.classList.remove('hidden');
            slowMoHud.classList.add('flex');
        }
        if (playerEl) playerEl.classList.add('invincible-active');

        const flash = document.createElement('div');
        flash.className = 'absolute inset-0 bg-white z-[100] pointer-events-none opacity-40 transition-opacity duration-300';
        gameArea.appendChild(flash);
        setTimeout(() => {
            flash.style.opacity = '0';
            setTimeout(() => flash.remove(), 300);
        }, 50);

        if (invincibilityTimer) clearTimeout(invincibilityTimer);
        invincibilityTimer = setTimeout(() => {
            isInvincibleActive = false;
            if (slowMoOverlay) slowMoOverlay.style.opacity = '0';
            if (slowMoHud) {
                slowMoHud.classList.add('hidden');
                slowMoHud.classList.remove('flex');
            }
            if (playerEl) playerEl.classList.remove('invincible-active');
        }, 5000);
    }

    function resetGameStats() {
        elapsedTime = 0;
        collectedCount = 0;
        playerX = 0;
        targetPlayerX = 0;
        frameCount = 0;
        obstacleCounter = 0;
        hasSavedScore = false;
        keys = { ArrowLeft: false, ArrowRight: false };
        
        if (invincibilityTimer) clearTimeout(invincibilityTimer);
        isInvincibleActive = false;
        if (slowMoOverlay) slowMoOverlay.style.opacity = '0';
        if (slowMoHud) {
            slowMoHud.classList.add('hidden');
            slowMoHud.classList.remove('flex');
        }
        if (playerEl) playerEl.classList.remove('invincible-active');

        updateSpeedByLevel();
        updateScore();
        updateWordDisplay();
        playerEl.style.transform = `translateX(-50%)`;
        clearEntities();
    }

    function updateSpeedByLevel() {
        const isMobile = window.innerWidth < 768;
        if (collectedCount <= 2) {
            fallSpeed = isMobile ? 6 : 8; 
        } else if (collectedCount <= 4) {
            fallSpeed = isMobile ? 9 : 12; 
        } else {
            fallSpeed = isMobile ? 13 : 18; 
        }
    }

    function clearEntities() {
        entities.forEach(ent => ent.el.remove());
        entities = [];
        document.querySelectorAll('.confetti').forEach(el => el.remove());
    }

    function updateWordDisplay(justCollectedIndex = -1) {
        let html = '';
        const isMobile = window.innerWidth < 768;
        const boxSize = isMobile ? 'w-6 h-7 text-xs' : 'w-8 h-9 text-sm';
        
        for (let i = 0; i < targetWord.length; i++) {
            const char = targetWord[i];
            const isCollected = i < collectedCount;
            const isPopping = (i === justCollectedIndex);
            
            const boxClass = isCollected 
                ? 'bg-[#000AC2] border-white text-white' 
                : 'bg-[#000AC2] border-white/40 text-transparent';
            
            const textClass = isPopping ? 'animate-letter-pop inline-block' : 'inline-block';
            const content = isCollected ? `<span class="${textClass}">${char}</span>` : '&nbsp;';
            
            html += `<div class="${boxSize} ${boxClass} border flex items-center justify-center font-mono font-black rounded select-none shadow-sm">${content}</div>`;
        }
        wordEl.innerHTML = html;
    }

    function tryStartGame() {
        if (gameState !== 'ready') return;
        
        gameState = 'playing';
        if (scorePanel) scorePanel.style.opacity = '0.15';
        startMsg.classList.add('hidden');
        overMsg.classList.add('hidden');
        winMsg.classList.add('hidden');
        resetGameStats();
        startTime = Date.now();
        gameLoopId = requestAnimationFrame(updateGame);
    }

    function createEntity() {
        const isMobile = window.innerWidth < 768;
        const el = document.createElement('div');
        el.className = 'absolute z-10 flex items-center justify-center';
        
        const hasLetterOnScreen = entities.some(e => e.type === 'letter');
        const hasAwardOnScreen = entities.some(e => e.type === 'award');
        
        let spawnType = 'obstacle';

        if (collectedCount < targetWord.length && !hasLetterOnScreen) {
            if (obstacleCounter >= 2) {
                spawnType = 'letter';
                obstacleCounter = 0;
            } else if (Math.random() > 0.6) {
                spawnType = 'letter';
                obstacleCounter = 0;
            } else {
                obstacleCounter++;
            }
        } else {
            obstacleCounter++;
        }

        if (spawnType === 'obstacle' && !hasAwardOnScreen && !isInvincibleActive && Math.random() < 0.08) {
            spawnType = 'award';
        }

        let size;
        const equipmentPNGs = window.equipmentPNGs || [];
        const filmAwardPNG = window.filmAwardPNG || '';

        if (spawnType === 'letter') {
            size = isMobile ? 64 : 80;
            const letterToCollect = targetWord[collectedCount];
            el.innerHTML = `<div class="text-[#000AC2] font-black font-mono w-full h-full flex items-center justify-center animate-float-letter" style="font-size: ${isMobile ? 64 : 80}px; line-height: 1;">${letterToCollect}</div>`;
        } else if (spawnType === 'award') {
            size = isMobile ? 60 : 75;
            const awardPaths = (filmAwardPNG && filmAwardPNG.paths) ? filmAwardPNG.paths : [(filmAwardPNG.src || 'award.png'), './award.png', 'assets/award.png', './assets/award.png', 'award.PNG'];
            const awardFallback = (filmAwardPNG && filmAwardPNG.fallback) ? filmAwardPNG.fallback : (window.filmAwardSVG || '');
            
            const wrap = document.createElement('div');
            wrap.className = 'w-full h-full animate-film-award-glow flex items-center justify-center';
            const img = document.createElement('img');
            img.className = 'w-full h-full obstacle-png-img pointer-events-none';
            img.alt = 'Film Award';
            
            let pathIdx = 0;
            const applyImgStyle = (el) => {
                if (el.src && el.src.startsWith('data:')) {
                    el.style.filter = 'drop-shadow(0 0 16px rgba(255, 255, 255, 0.9)) drop-shadow(0 0 30px rgba(0, 10, 194, 0.9))';
                } else {
                    el.style.filter = 'brightness(0) invert(1) drop-shadow(0 0 16px rgba(255, 255, 255, 0.9)) drop-shadow(0 0 30px rgba(0, 10, 194, 0.9))';
                }
            };

            img.onerror = function() {
                pathIdx++;
                if (pathIdx < awardPaths.length) {
                    this.src = awardPaths[pathIdx];
                    applyImgStyle(this);
                } else if (awardFallback && this.src !== awardFallback) {
                    this.onerror = null;
                    this.src = awardFallback;
                    applyImgStyle(this);
                }
            };
            img.onload = function() {
                applyImgStyle(this);
            };
            img.src = awardPaths[0];
            applyImgStyle(img);
            wrap.appendChild(img);
            el.appendChild(wrap);
        } else {
            size = isMobile ? 55 : 85; 
            const chosenItem = equipmentPNGs[Math.floor(Math.random() * equipmentPNGs.length)] || { src: '1.png', fallback: '' };
            const candidatePaths = (chosenItem && chosenItem.paths) ? chosenItem.paths : [
                chosenItem.src || 'clapperboard.png',
                `./${chosenItem.src || 'clapperboard.png'}`,
                `assets/${chosenItem.src || 'clapperboard.png'}`,
                `./assets/${chosenItem.src || 'clapperboard.png'}`,
                `img/${chosenItem.src || 'clapperboard.png'}`,
                `./img/${chosenItem.src || 'clapperboard.png'}`
            ];
            const fallbackSrc = (chosenItem && chosenItem.fallback) ? chosenItem.fallback : '';
            
            const wrap = document.createElement('div');
            wrap.className = 'w-full h-full animate-float-obstacle flex items-center justify-center';
            const img = document.createElement('img');
            img.className = 'w-full h-full obstacle-png-img pointer-events-none';
            img.alt = chosenItem.name || 'Equipment Obstacle';
            
            let pathIdx = 0;
            const applyObstacleStyle = (el) => {
                if (el.src && el.src.startsWith('data:')) {
                    el.style.filter = 'drop-shadow(0 2px 10px rgba(0, 10, 194, 0.8))';
                } else {
                    el.style.filter = 'brightness(0) invert(1) drop-shadow(0 2px 10px rgba(0, 10, 194, 0.8))';
                }
            };

            img.onerror = function() {
                pathIdx++;
                if (pathIdx < candidatePaths.length) {
                    this.src = candidatePaths[pathIdx];
                    applyObstacleStyle(this);
                } else if (fallbackSrc && this.src !== fallbackSrc) {
                    this.onerror = null;
                    this.src = fallbackSrc;
                    applyObstacleStyle(this);
                }
            };
            img.onload = function() {
                applyObstacleStyle(this);
            };
            img.src = candidatePaths[0];
            applyObstacleStyle(img);
            wrap.appendChild(img);
            el.appendChild(wrap);
        }
        
        el.style.width = size + 'px';
        el.style.height = size + 'px';
        
        const areaWidth = gameArea.clientWidth;
        let x;
        if (spawnType === 'award') {
            const side = Math.random() < 0.5 ? 0 : 1;
            if (side === 0) {
                x = Math.max(15, Math.min((areaWidth * 0.32) - size, (areaWidth * (0.12 + Math.random() * 0.18))));
            } else {
                x = Math.max(areaWidth * 0.68, Math.min(areaWidth - size - 15, (areaWidth * (0.70 + Math.random() * 0.18))));
            }
        } else {
            x = Math.random() * (areaWidth - size);
        }
        const y = gameArea.clientHeight + 50; 
        
        el.style.left = x + 'px';
        el.style.top = y + 'px';
        
        if (spawnType === 'obstacle') {
            el.style.transform = `rotate(${Math.random() * 360}deg)`;
        }
        
        gameArea.appendChild(el);
        entities.push({ el, x, y, size: size, type: spawnType });
    }

    function updateGame() {
        if (gameState !== 'playing') return;
        
        elapsedTime = (Date.now() - startTime) / 1000;
        updateScore();

        if (isInvincibleActive && slowMoCountdownText) {
            const remainingMs = Math.max(0, invincibilityEndTime - Date.now());
            const remainingSec = (remainingMs / 1000).toFixed(1);
            slowMoCountdownText.innerText = `SHIELD: ${remainingSec}s`;
        }

        if (keys.ArrowLeft) targetPlayerX -= playerSpeed;
        if (keys.ArrowRight) targetPlayerX += playerSpeed;

        const areaWidth = gameArea.clientWidth;
        const maxTravel = (areaWidth / 2) - 30; 
        targetPlayerX = Math.max(-maxTravel, Math.min(maxTravel, targetPlayerX));
        
        playerX += (targetPlayerX - playerX) * 0.2;
        playerEl.style.transform = `translateX(calc(-50% + ${playerX}px))`;

        frameCount++;
        
        const currentFallSpeed = fallSpeed;
        const baseRate = window.innerWidth < 768 ? 40 : 45;
        const spawnRate = Math.max(12, Math.floor(baseRate - (fallSpeed * 1.5)));
        
        if (frameCount % spawnRate === 0) {
            createEntity();
        }

        const hitboxWidth = window.innerWidth < 768 ? 45 : 70;
        const hitboxHeight = window.innerWidth < 768 ? 90 : 130;
        
        const pRect = playerEl.getBoundingClientRect();
        const pCenterX = pRect.left + (pRect.width / 2);
        const pCenterY = pRect.top + (pRect.height / 2);
        
        const pLeft = pCenterX - (hitboxWidth / 2);
        const pRight = pCenterX + (hitboxWidth / 2);
        const pTop = pCenterY - (hitboxHeight / 2) + 15;
        const pBottom = pCenterY + (hitboxHeight / 2);
        
        for (let i = 0; i < entities.length; i++) {
            let ent = entities[i];
            ent.y -= currentFallSpeed; 
            ent.el.style.top = ent.y + 'px';
            
            const oRect = ent.el.getBoundingClientRect();
            const oShrink = ent.size * 0.25; 
            const oLeft = oRect.left + oShrink;
            const oRight = oRect.right - oShrink;
            const oTop = oRect.top + oShrink;
            const oBottom = oRect.bottom - oShrink;

            if (pLeft < oRight && pRight > oLeft && pTop < oBottom && pBottom > oTop) {
                if (ent.type === 'obstacle') {
                    if (isInvincibleActive) {
                        ent.el.style.transition = 'transform 0.3s, opacity 0.3s';
                        ent.el.style.transform += ' scale(1.4)';
                        ent.el.style.opacity = '0';
                        setTimeout(() => ent.el.remove(), 300);
                        entities.splice(i, 1);
                        i--;
                    } else {
                        gameOver();
                        return;
                    }
                } else if (ent.type === 'award') {
                    ent.el.remove();
                    entities.splice(i, 1);
                    i--;
                    triggerInvincibility();
                } else if (ent.type === 'letter') {
                    ent.el.remove();
                    entities.splice(i, 1);
                    i--;
                    const justCollectedIdx = collectedCount;
                    collectedCount++;
                    updateWordDisplay(justCollectedIdx);
                    updateSpeedByLevel();
                    
                    const flash = document.createElement('div');
                    flash.className = 'absolute inset-0 bg-white z-[100] pointer-events-none opacity-20';
                    gameArea.appendChild(flash);
                    setTimeout(() => {
                        flash.style.transition = 'opacity 0.2s';
                        flash.style.opacity = '0';
                        setTimeout(() => flash.remove(), 200);
                    }, 50);

                    if (collectedCount === targetWord.length) {
                        gameWin();
                        return;
                    }
                }
            }
        }

        if (entities.length > 0 && entities[0].y < -200) {
            entities[0].el.remove();
            entities.shift();
        }

        gameLoopId = requestAnimationFrame(updateGame);
    }

    function updateScore() {
        scoreEl.innerText = 'TIME: ' + elapsedTime.toFixed(2) + 's';
    }

    function gameOver() {
        gameState = 'gameover';
        if (scorePanel) scorePanel.style.opacity = '1';
        overMsg.classList.remove('hidden');
        
        if (window.gsap) {
            gsap.fromTo(gameArea, {x: -10, y: -5}, {x: 10, y: 5, duration: 0.1, yoyo: true, repeat: 5, clearProps: "all"});
        }
        
        const flash = document.createElement('div');
        flash.className = 'absolute inset-0 bg-[#000AC2] z-[100] pointer-events-none opacity-30';
        gameArea.appendChild(flash);
        setTimeout(() => {
            flash.style.transition = 'opacity 0.5s';
            flash.style.opacity = '0';
            setTimeout(() => flash.remove(), 500);
        }, 100);
    }
    
    function createConfetti() {
        for (let i = 0; i < 60; i++) {
            const conf = document.createElement('div');
            conf.className = 'confetti absolute z-[150] w-2 h-4 pointer-events-none';
            conf.style.backgroundColor = Math.random() > 0.5 ? '#FFFFFF' : '#000AC2';
            conf.style.left = (Math.random() * 100) + 'vw';
            conf.style.top = -20 + 'px';
            gameArea.appendChild(conf);
            
            if (window.gsap) {
                gsap.to(conf, {
                    y: window.innerHeight + 100,
                    x: `+=${(Math.random() - 0.5) * 200}`,
                    rotation: `+=${Math.random() * 720}`,
                    duration: 1.5 + Math.random() * 2,
                    ease: 'power1.out',
                    onComplete: () => conf.remove()
                });
            }
        }
    }

    function gameWin() {
        gameState = 'win';
        if (scorePanel) scorePanel.style.opacity = '1';
        updateScore();
        document.getElementById('final-time-msg').innerText = 'TIME: ' + elapsedTime.toFixed(2) + 's';
        winMsg.classList.remove('hidden');
        
        const qualifies = isQualifyingScore(elapsedTime);
        if (qualifies) {
            winInputArea.classList.remove('hidden');
            winInputArea.classList.add('flex');
            nameInputWin.value = currentPlayerName;
            if (window.innerWidth > 768) {
                setTimeout(() => nameInputWin.focus(), 100);
            }
        } else {
            winInputArea.classList.add('hidden');
            winInputArea.classList.remove('flex');
        }
        
        const flash = document.createElement('div');
        flash.className = 'absolute inset-0 bg-white z-[100] pointer-events-none';
        gameArea.appendChild(flash);
        if (window.gsap) {
            gsap.to(flash, {opacity: 0, duration: 1, onComplete: () => flash.remove()});
        }
        
        createConfetti();
        let confInterval = setInterval(() => {
            if (gameState === 'win') createConfetti();
            else clearInterval(confInterval);
        }, 800);
    }
    
    if (nameInputWin) {
        nameInputWin.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                saveScore(nameInputWin, winInputArea);
            }
            e.stopPropagation(); 
        });
    }
    
    if (document.getElementById('start-btn')) document.getElementById('start-btn').addEventListener('click', tryStartGame);
    if (startMsg) startMsg.addEventListener('click', tryStartGame);
    
    if (document.getElementById('restart-btn')) document.getElementById('restart-btn').addEventListener('click', () => {
        showStartScreen();
        tryStartGame();
    });
    
    if (document.getElementById('play-again-btn')) document.getElementById('play-again-btn').addEventListener('click', () => {
        if (!hasSavedScore && nameInputWin && nameInputWin.value.trim() !== '') {
            saveScore(nameInputWin, winInputArea);
        }
        showStartScreen();
        tryStartGame();
    });

    window.addEventListener('keydown', (e) => {
        const isSpace = e.code === 'Space' || e.key === ' ' || e.keyCode === 32;
        if (isSpace) {
            if (!isGameActive) {
                e.preventDefault();
                openGame();
            } else {
                if (document.activeElement === nameInputWin) return;
                e.preventDefault();
                if (gameState === 'ready') {
                    tryStartGame();
                } else if (gameState === 'gameover' || gameState === 'win') {
                    if (gameState === 'win' && !hasSavedScore && nameInputWin && nameInputWin.value.trim() !== '') {
                        saveScore(nameInputWin, winInputArea);
                    }
                    showStartScreen();
                    tryStartGame();
                }
            }
        }
        if ((e.code === 'Escape' || e.key === 'Escape') && isGameActive) {
            closeGame();
        }
        
        if (isGameActive && (e.code === 'ArrowLeft' || e.key === 'ArrowLeft' || e.code === 'KeyA' || e.key === 'a' || e.key === 'A')) { 
            if(gameState === 'playing') e.preventDefault(); 
            keys.ArrowLeft = true; 
        }
        if (isGameActive && (e.code === 'ArrowRight' || e.key === 'ArrowRight' || e.code === 'KeyD' || e.key === 'd' || e.key === 'D')) { 
            if(gameState === 'playing') e.preventDefault(); 
            keys.ArrowRight = true; 
        }
    });
    
    window.addEventListener('keyup', (e) => {
        if (e.code === 'ArrowLeft' || e.key === 'ArrowLeft' || e.code === 'KeyA' || e.key === 'a' || e.key === 'A') keys.ArrowLeft = false;
        if (e.code === 'ArrowRight' || e.key === 'ArrowRight' || e.code === 'KeyD' || e.key === 'd' || e.key === 'D') keys.ArrowRight = false;
    });

    let isDragging = false;
    if (gameArea) {
        gameArea.addEventListener('pointerdown', (e) => {
            if (e.target.closest('#close-game') || e.target.closest('#game-start-msg') || e.target.closest('#game-over-msg') || e.target.closest('#game-win-msg')) return;
            if (gameState === 'playing') {
                isDragging = true;
                updateDragPosition(e);
            }
        });
        
        window.addEventListener('pointermove', (e) => {
            if (isDragging && gameState === 'playing') {
                updateDragPosition(e);
            }
        });
        
        window.addEventListener('pointerup', () => {
            isDragging = false;
        });
    }
    
    function updateDragPosition(e) {
        const rect = gameArea.getBoundingClientRect();
        const xPos = e.clientX - rect.left;
        const center = rect.width / 2;
        targetPlayerX = (xPos - center) * 1.5; 
    }

    if (closeGameBtn) closeGameBtn.addEventListener('click', closeGame);

    // Scroll Progress & Indicator Logic
    function getPageScrollProgress() {
        if (typeof window.lenis !== 'undefined' && window.lenis && typeof window.lenis.progress === 'number' && !isNaN(window.lenis.progress)) {
            return Math.max(0, Math.min(1, window.lenis.progress));
        }
        const total = document.documentElement.scrollHeight - window.innerHeight;
        if (total <= 0) return 0;
        const current = window.pageYOffset || document.documentElement.scrollTop || 0;
        return Math.max(0, Math.min(1, current / total));
    }

    const trackContainer = document.getElementById('scroll-track-container');
    const runner = document.getElementById('falling-cameraman-runner');
    let cachedTrackHeight = 0;
    let cachedRunnerHeight = 72;

    function measureScrollTrack() {
        if (trackContainer && runner) {
            cachedTrackHeight = trackContainer.clientHeight;
            cachedRunnerHeight = runner.offsetHeight || 72;
        }
    }
    measureScrollTrack();

    function updateScrollIndicator(progress) {
        if (!runner) return;
        const p = Math.max(0, Math.min(1, progress));
        const maxTravel = Math.max(0, cachedTrackHeight - cachedRunnerHeight);
        const currentY = p * maxTravel;
        runner.style.transform = `translate3d(-50%, ${currentY}px, 0)`;
    }

    lenis.on('scroll', (e) => {
        if (window.ScrollTrigger) ScrollTrigger.update();
        const p = typeof e.progress === 'number' ? e.progress : getPageScrollProgress();
        updateScrollIndicator(p);
        updateHeaderSceneState(typeof e.scroll === 'number' ? e.scroll : window.pageYOffset);
        updateChatBalloonState();
    });

    window.addEventListener('resize', () => {
        measureScrollTrack();
        updateScrollIndicator(getPageScrollProgress());
        updateHeaderSceneState(window.pageYOffset);
    }, { passive: true });

    if (window.gsap) {
        gsap.ticker.add((time) => {
            lenis.raf(time * 1000);
        });
        gsap.ticker.lagSmoothing(0);
    }

    function initScrollIndicator() {
        const indicator = document.getElementById('left-scroll-indicator');
        if (!indicator || !window.gsap) return;

        measureScrollTrack();
        gsap.to(indicator, { opacity: 1, duration: 1, ease: "power2.out", delay: 0.4 });
        updateScrollIndicator(getPageScrollProgress());
    }
    initScrollIndicator();

    // GSAP Scroll Animations
    if (window.gsap && window.ScrollTrigger) {
        const soulTl = gsap.timeline({
            scrollTrigger: {
                trigger: "#the-soul",
                start: "top 75%",
                toggleActions: "play none none reverse"
            }
        });

        soulTl.to("#soul-title", { opacity: 1, y: 0, duration: 1.2, ease: "power3.out" })
              .to("#soul-desc", { opacity: 1, y: 0, duration: 1.2, ease: "power3.out" }, "-=0.9")
              .to(".bts-enter", { opacity: 1, duration: 1.5, ease: "power3.out" }, "-=0.8");

        const btsRing = document.getElementById('bts-carousel-ring');
        if (btsRing) {
            btsRing.innerHTML = ''; // Clear contents
            const numImagesPerRow = 14; 
            const isMobile = window.innerWidth < 768;
            
            const radius = isMobile ? 280 : 600;
            const imgWidth = isMobile ? 70 : 130;
            const rowHeight = isMobile ? 120 : 185;
            
            btsRing.style.width = imgWidth + 'px';
            btsRing.style.height = (imgWidth * 0.6) + 'px';
            btsRing.style.transformStyle = 'preserve-3d';

            const rows = [];
            const allItems = []; 
            
            // 1. ADD CENTER 3D CANVAS inside the ring
            // It sits at Z=0, meaning images will orbit around it!
            const center3DContainer = document.createElement('div');
            center3DContainer.className = 'absolute top-0 left-0 w-full h-full flex justify-center items-center pointer-events-none';
            center3DContainer.style.transformStyle = 'preserve-3d';
            
            const centerCanvas = document.createElement('canvas');
            const cSize = isMobile ? 360 : 600; // CSS display size
            const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
            centerCanvas.width = Math.floor(cSize * dpr);
            centerCanvas.height = Math.floor(cSize * dpr);
            centerCanvas.style.width = `${cSize}px`;
            centerCanvas.style.height = `${cSize}px`;
            
            // Perfectly centered vertically
            centerCanvas.style.transform = "translateY(0%)"; 
            
            const ctxCenter = centerCanvas.getContext('2d');
            ctxCenter.scale(dpr, dpr);
            ctxCenter.imageSmoothingEnabled = true;
            ctxCenter.imageSmoothingQuality = "high";
            
            center3DContainer.appendChild(centerCanvas);
            btsRing.appendChild(center3DContainer);

            for (let r = -1; r <= 1; r++) {
                const rowEl = document.createElement('div');
                rowEl.className = 'absolute top-0 left-0 w-full h-full flex justify-center items-center';
                rowEl.style.transformStyle = 'preserve-3d';
                rowEl.style.transform = `translateY(${r * rowHeight}px)`;
                
                const dir = r === 0 ? -1 : 1;

                for (let i = 1; i <= numImagesPerRow; i++) {
                    const imgIndex = ((i - 1 + (r + 1) * 4) % 14) + 1; 
                    const baseAngle = (i - 1) * (360 / numImagesPerRow);
                    const angleOffset = r === 0 ? (360 / numImagesPerRow) / 2 : 0;
                    const finalAngle = baseAngle + angleOffset;
                    
                    const el = document.createElement('div');
                    el.className = 'absolute top-0 left-0 w-full h-full flex justify-center items-center bts-float';
                    
                    el.style.transform = `rotateY(${finalAngle}deg) translateZ(${radius}px)`;
                    el.style.backfaceVisibility = 'visible';
                    
                    const img = document.createElement('img');
                    img.src = `${imgIndex}.webp`;
                    img.onerror = () => { img.src = `https://placehold.co/300x200/111111/FFFFFF?text=BTS+${imgIndex}`; };
                    img.alt = `BTS ${imgIndex}`;
                    
                    const applyImgSize = () => {
                        if (img.naturalHeight && img.naturalWidth) {
                            if (img.naturalHeight > img.naturalWidth) {
                                // Portrait photo: smaller width and height to keep balanced proportions
                                img.style.maxWidth = `${isMobile ? 48 : 82}px`;
                                img.style.maxHeight = `${isMobile ? 68 : 110}px`;
                            } else {
                                img.style.maxWidth = `${imgWidth}px`;
                                img.style.maxHeight = `${isMobile ? 64 : 100}px`;
                            }
                        }
                    };

                    if (img.complete) {
                        applyImgSize();
                    } else {
                        img.onload = applyImgSize;
                    }

                    // KINETIC HOVER EFFECT: scale-150 and bouncy transition
                    img.className = "rounded-none opacity-100 hover:scale-150 cursor-pointer bts-card-optimized shadow-2xl object-contain";
                    img.style.maxWidth = `${imgWidth}px`;
                    img.style.maxHeight = `${isMobile ? 68 : 110}px`;
                    img.style.transition = "transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.25s ease"; 
                    img.style.transform = "translateZ(0)"; 
                    img.style.willChange = "transform, opacity";
                    
                    el.appendChild(img);
                    rowEl.appendChild(el);
                    
                    allItems.push({ el, img, angle: finalAngle, dir });
                }
                
                btsRing.appendChild(rowEl);
                rows.push({ el: rowEl, dir, y: r * rowHeight }); 
            }
            
            let baseRotation = 0;
            let scrollRotation = 0;
            const minBtsFrame = 76; // ezgif-frame-077.png (0-indexed: 76)
            const maxBtsFrame = 243; // ezgif-frame-244.png (0-indexed: 243)
            let autoPingPongFrame = maxBtsFrame;
            let autoPingPongDirection = -1; // Start by playing from 244 down to 077
            const autoSpeed = 0.5; // Smooth automatic ping-pong speed (~60fps)
            
            ScrollTrigger.create({
                trigger: "#the-soul",
                start: "top bottom",
                end: "bottom top",
                scrub: 0.5,
                onUpdate: (self) => {
                    scrollRotation = self.progress * 360; 
                }
            });
            
            let reqId = null;
            let isCarouselVisible = false;

            function renderCarousel() {
                if (!isCarouselVisible) {
                    reqId = null;
                    return;
                }

                baseRotation -= 0.10; 
                
                rows.forEach(row => {
                    const totalRotation = (baseRotation + scrollRotation) * row.dir;
                    row.el.style.transform = `translateY(${row.y}px) rotateY(${totalRotation.toFixed(2)}deg)`;
                });
                
                // AUTOMATIC PING-PONG 3D SEQUENCE LOOP (244.png <-> 077.png)
                autoPingPongFrame += autoSpeed * autoPingPongDirection;
                if (autoPingPongFrame >= maxBtsFrame) {
                    autoPingPongFrame = maxBtsFrame;
                    autoPingPongDirection = -1;
                } else if (autoPingPongFrame <= minBtsFrame) {
                    autoPingPongFrame = minBtsFrame;
                    autoPingPongDirection = 1;
                }
                const currentFrameIdx = Math.floor(autoPingPongFrame);
                
                // DRAW FRAME to center canvas using nearest-neighbor resolver
                const frameImg = (typeof window.getNearestSequenceFrame === 'function')
                    ? window.getNearestSequenceFrame(currentFrameIdx)
                    : (window.sequenceImages ? window.sequenceImages[currentFrameIdx] : null);

                if (frameImg && frameImg.complete && frameImg.naturalWidth > 0) {
                    ctxCenter.clearRect(0, 0, cSize, cSize);
                    
                    const imgRatio = frameImg.naturalWidth / frameImg.naturalHeight;
                    let drawW = cSize;
                    let drawH = cSize / imgRatio;
                    if (drawH > cSize) {
                        drawH = cSize;
                        drawW = cSize * imgRatio;
                    }
                    const dx = (cSize - drawW) / 2;
                    const dy = (cSize - drawH) / 2;
                    
                    ctxCenter.drawImage(frameImg, dx, dy, drawW, drawH);
                }
                
                // Hardware-composited Depth with opacity write-throttling
                allItems.forEach(item => {
                    const currentRingRot = (baseRotation + scrollRotation) * item.dir;
                    const globalAngle = (item.angle + currentRingRot) % 360;
                    const rad = globalAngle * Math.PI / 180;
                    const z = Math.cos(rad); 
                    
                    const targetOpacity = z < -0.1 ? Math.max(0.25, 1 - Math.abs(z + 0.1) * 0.75) : 1;

                    if (item.lastOpacity === undefined || Math.abs(targetOpacity - item.lastOpacity) >= 0.05) {
                        item.lastOpacity = targetOpacity;
                        item.img.style.opacity = targetOpacity.toFixed(2);
                    }
                });

                reqId = requestAnimationFrame(renderCarousel);
            }

            // Intersection Observer to stop carousel loop when scrolled away (Huge CPU/GPU saving)
            const soulSection = document.getElementById('the-soul');
            if (soulSection) {
                const soulObserver = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        isCarouselVisible = entry.isIntersecting;
                        if (isCarouselVisible && !reqId) {
                            reqId = requestAnimationFrame(renderCarousel);
                        }
                    });
                }, { rootMargin: "150px" });
                soulObserver.observe(soulSection);
            } else {
                isCarouselVisible = true;
                reqId = requestAnimationFrame(renderCarousel);
            }
            
            ScrollTrigger.addEventListener("refreshInit", () => {
                // Not strictly necessary but good practice
            });
        }

        gsap.to('.parallax-hero', {
            yPercent: 35, rotation: 3, ease: "none",
            scrollTrigger: { trigger: "#hero", start: "top top", end: "bottom top", scrub: 1.5 }
        });

        gsap.to('#hero', {
            yPercent: 100,
            opacity: 0,
            ease: "none",
            scrollTrigger: { trigger: "#hero", start: "top top", end: "bottom top", scrub: true }
        });

        gsap.to('#about', {
            yPercent: 30,
            opacity: 0.3,
            ease: "none",
            scrollTrigger: { trigger: "#we-are-made", start: "top bottom", end: "top top", scrub: true }
        });

        const statementSection = document.querySelector('#statement') || document.querySelector('#project-fit');
        if (statementSection) {
            gsap.set(statementSection, { opacity: 1, yPercent: 0 });
        }

        const filmTrack = document.getElementById("film-track");
        if (filmTrack) {
            let blurTimeout;
            let velParallaxTimeout;
            const galleryItemsList = () => gsap.utils.toArray('.gallery-item-inner');
            const velParallaxItems = () => gsap.utils.toArray('.velocity-parallax');

            const trackTl = gsap.timeline({
                scrollTrigger: {
                    trigger: "#selected-work",
                    start: "top top",
                    end: () => "+=" + Math.max(isTouchDevice ? 600 : 800, (filmTrack.scrollWidth - window.innerWidth) * (isTouchDevice ? 1.0 : 1.2)),
                    scrub: isTouchDevice ? 1.0 : 1.8,
                    pin: true,
                    anticipatePin: 1,
                    invalidateOnRefresh: true,
                    onUpdate: (self) => {
                        if (!self.isActive) return;
                        const vel = self.getVelocity();
                        const absVel = Math.abs(vel);

                        const blurAmount = Math.min(3.5, absVel / 650);
                        const skewAmount = Math.max(-2.5, Math.min(2.5, -vel / 1200));

                        if (absVel > 30) {
                            gsap.to(galleryItemsList(), {
                                filter: `blur(${blurAmount.toFixed(2)}px)`,
                                skewX: `${skewAmount.toFixed(2)}deg`,
                                duration: 0.15,
                                ease: "power1.out",
                                overwrite: "auto"
                            });

                            clearTimeout(blurTimeout);
                            blurTimeout = setTimeout(() => {
                                gsap.to(galleryItemsList(), {
                                    filter: "blur(0px)",
                                    skewX: "0deg",
                                    duration: 0.35,
                                    ease: "power2.out",
                                    overwrite: "auto"
                                });
                            }, 80);
                        }

                        if (absVel > 15) {
                            const pItems = velParallaxItems();
                            pItems.forEach((el) => {
                                const depth = parseFloat(el.getAttribute('data-depth')) || 1.0;
                                const depthY = parseFloat(el.getAttribute('data-depth-y')) || 1.0;
                                const speedDelta = (depth - 1.0);

                                const shiftX = Math.max(-60, Math.min(60, -(vel * speedDelta * 0.052)));
                                const shiftY = Math.max(-20, Math.min(20, (vel / 900) * depthY * 6));
                                const scaleShift = 1 + Math.max(-0.03, Math.min(0.04, (absVel / 2500) * speedDelta));

                                gsap.to(el, {
                                    x: shiftX,
                                    y: shiftY,
                                    scale: scaleShift,
                                    duration: 0.18,
                                    ease: "power1.out",
                                    overwrite: "auto"
                                });
                            });

                            clearTimeout(velParallaxTimeout);
                            velParallaxTimeout = setTimeout(() => {
                                gsap.to(velParallaxItems(), {
                                    x: 0,
                                    y: 0,
                                    scale: 1,
                                    duration: 0.65,
                                    ease: "power2.out",
                                    overwrite: "auto"
                                });
                            }, 90);
                        }
                    },
                    onLeave: () => {
                        gsap.to(galleryItemsList(), { filter: "blur(0px)", skewX: "0deg", duration: 0.2, overwrite: "auto" });
                        gsap.to(velParallaxItems(), { x: 0, y: 0, scale: 1, duration: 0.35, overwrite: "auto" });
                    },
                    onLeaveBack: () => {
                        gsap.to(galleryItemsList(), { filter: "blur(0px)", skewX: "0deg", duration: 0.2, overwrite: "auto" });
                        gsap.to(velParallaxItems(), { x: 0, y: 0, scale: 1, duration: 0.35, overwrite: "auto" });
                    }
                }
            });

            trackTl.to(filmTrack, {
                x: () => {
                    const maxMove = filmTrack.scrollWidth - window.innerWidth;
                    return maxMove > 0 ? -maxMove : 0;
                }, 
                ease: "none"
            });
        }

        gsap.to("#selected-title", {
            opacity: 0,
            y: -30,
            ease: "power2.out",
            scrollTrigger: {
                trigger: "#selected-work",
                start: "top top",
                end: "top+=150",
                scrub: true
            }
        });

        gsap.utils.toArray('.contact-title-line').forEach(line => {
            gsap.fromTo(line,
                { y: "110%", filter: "blur(10px)", scale: 1.2 },
                {
                    scrollTrigger: { trigger: "#contact", start: "top 75%" },
                    y: "0%", filter: "blur(0px)", scale: 1, duration: 1.5, ease: "power4.out", stagger: 0.1
                }
            );
        });
        
        gsap.to('.reveal-quote', {
            scrollTrigger: { trigger: '.reveal-quote', start: "top 90%" },
            y: 0, opacity: 1, duration: 1.5, ease: "expo.out", delay: 0.5
        });
    }

    function initGalleryInteractions() {
        const galleryItems = document.querySelectorAll('.gallery-item');
        galleryItems.forEach((item) => {
            const inner = item.querySelector('.gallery-item-inner');
            if (!inner || !window.gsap) return;
            
            inner.addEventListener('mouseenter', () => {
                gsap.set(item, { zIndex: 100 });
                gsap.to(inner, { scale: 1.12, duration: 0.35, ease: "power2.out", overwrite: "auto" });
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

            inner.addEventListener('touchstart', () => {
                gsap.set(item, { zIndex: 100 });
                gsap.to(inner, { scale: 1.08, duration: 0.2, ease: "power2.out" });
            }, { passive: true });

            inner.addEventListener('touchend', () => {
                gsap.to(inner, { scale: 1, duration: 0.3, ease: "power2.out", onComplete: () => gsap.set(item, { zIndex: 10 }) });
            }, { passive: true });
        });
    }
    
    initGalleryInteractions();
    initParagraphAnimations();
    if (window.ScrollTrigger) ScrollTrigger.refresh();

    if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(() => {
            setTimeout(() => {
                initParagraphAnimations();
                if (window.ScrollTrigger) ScrollTrigger.refresh();
            }, 60);
        });
    }
    window.addEventListener('load', () => {
        setTimeout(() => {
            initParagraphAnimations();
            if (window.ScrollTrigger) ScrollTrigger.refresh();
        }, 100);
    });

    let resizeDebounce;
    window.addEventListener('resize', () => {
        clearTimeout(resizeDebounce);
        resizeDebounce = setTimeout(() => {
            initParagraphAnimations();
            if (window.ScrollTrigger) ScrollTrigger.refresh();
        }, 200);
    });
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startSimbionApp);
} else {
    startSimbionApp();
}
