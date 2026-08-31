// Film equipment SVG icons & Film Award Power-up Data URLs for high-DPI rendering

function createSvgDataUrl(svgString) {
    return 'data:image/svg+xml;utf8,' + encodeURIComponent(svgString);
}

export const equipmentPNGs = [
    // 1. Cinema Camera
    createSvgDataUrl(`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none" stroke="#dedede" stroke-width="4" stroke-linecap="round" stroke-linejoin="round">
            <rect x="15" y="30" width="50" height="42" rx="6" fill="#141414" stroke="#dedede"/>
            <polygon points="65,42 90,28 90,74 65,60" fill="#141414" stroke="#dedede"/>
            <circle cx="32" cy="51" r="10" stroke="#000AC2" stroke-width="4" fill="#0a0a0a"/>
            <circle cx="28" cy="20" r="10" fill="#141414" stroke="#dedede"/>
            <circle cx="52" cy="20" r="10" fill="#141414" stroke="#dedede"/>
            <line x1="20" y1="80" x2="35" y2="72" stroke="#dedede"/>
            <line x1="60" y1="80" x2="45" y2="72" stroke="#dedede"/>
        </svg>
    `),
    // 2. Clapperboard
    createSvgDataUrl(`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none" stroke="#dedede" stroke-width="4" stroke-linecap="round" stroke-linejoin="round">
            <rect x="12" y="38" width="76" height="50" rx="4" fill="#141414" stroke="#dedede"/>
            <path d="M12,38 L88,20 L88,38 Z" fill="#141414" stroke="#dedede"/>
            <line x1="24" y1="35" x2="36" y2="23" stroke="#dedede" stroke-width="5"/>
            <line x1="48" y1="30" x2="60" y2="18" stroke="#dedede" stroke-width="5"/>
            <line x1="72" y1="25" x2="84" y2="13" stroke="#dedede" stroke-width="5"/>
            <line x1="12" y1="62" x2="88" y2="62" stroke="#dedede" stroke-width="3"/>
            <line x1="50" y1="62" x2="50" y2="88" stroke="#dedede" stroke-width="3"/>
            <text x="22" y="55" fill="#000AC2" font-size="10" font-family="monospace" font-weight="900">SIMBION</text>
        </svg>
    `),
    // 3. Studio Fresnel Spotlight
    createSvgDataUrl(`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none" stroke="#dedede" stroke-width="4" stroke-linecap="round" stroke-linejoin="round">
            <rect x="25" y="22" width="45" height="38" rx="4" fill="#141414" stroke="#dedede"/>
            <polygon points="70,22 92,10 92,72 70,60" fill="#141414" stroke="#dedede"/>
            <polygon points="25,22 8,12 8,70 25,60" fill="#141414" stroke="#dedede"/>
            <ellipse cx="70" cy="41" rx="4" ry="18" fill="#000AC2" stroke="#dedede"/>
            <line x1="47" y1="60" x2="47" y2="88" stroke="#dedede" stroke-width="5"/>
            <line x1="30" y1="94" x2="47" y2="88" stroke="#dedede" stroke-width="4"/>
            <line x1="64" y1="94" x2="47" y2="88" stroke="#dedede" stroke-width="4"/>
        </svg>
    `),
    // 4. Boom Microphone with Blimp
    createSvgDataUrl(`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none" stroke="#dedede" stroke-width="4" stroke-linecap="round" stroke-linejoin="round">
            <rect x="20" y="24" width="60" height="22" rx="11" fill="#141414" stroke="#dedede"/>
            <line x1="26" y1="24" x2="26" y2="46" stroke="#000AC2" stroke-width="3"/>
            <line x1="38" y1="24" x2="38" y2="46" stroke="#000AC2" stroke-width="3"/>
            <line x1="50" y1="24" x2="50" y2="46" stroke="#000AC2" stroke-width="3"/>
            <line x1="62" y1="24" x2="62" y2="46" stroke="#000AC2" stroke-width="3"/>
            <path d="M50,46 L50,62 L85,92" stroke="#dedede" stroke-width="4"/>
            <circle cx="50" cy="54" r="5" fill="#dedede"/>
        </svg>
    `),
    // 5. Director's Chair
    createSvgDataUrl(`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none" stroke="#dedede" stroke-width="4" stroke-linecap="round" stroke-linejoin="round">
            <line x1="20" y1="18" x2="20" y2="52" stroke="#dedede" stroke-width="5"/>
            <line x1="80" y1="18" x2="80" y2="52" stroke="#dedede" stroke-width="5"/>
            <rect x="20" y="20" width="60" height="18" fill="#141414" stroke="#000AC2" stroke-width="4"/>
            <rect x="18" y="50" width="64" height="8" fill="#dedede" stroke="#dedede"/>
            <line x1="22" y1="58" x2="78" y2="94" stroke="#dedede" stroke-width="4"/>
            <line x1="78" y1="58" x2="22" y2="94" stroke="#dedede" stroke-width="4"/>
            <line x1="25" y1="78" x2="75" y2="78" stroke="#dedede" stroke-width="3"/>
        </svg>
    `),
    // 6. 35mm Film Reel
    createSvgDataUrl(`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none" stroke="#dedede" stroke-width="4" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="50" cy="50" r="38" fill="#141414" stroke="#dedede" stroke-width="5"/>
            <circle cx="50" cy="50" r="14" fill="#000AC2" stroke="#dedede" stroke-width="4"/>
            <circle cx="50" cy="50" r="4" fill="#dedede"/>
            <circle cx="50" cy="24" r="7" fill="#0a0a0a" stroke="#dedede" stroke-width="3"/>
            <circle cx="50" cy="76" r="7" fill="#0a0a0a" stroke="#dedede" stroke-width="3"/>
            <circle cx="24" cy="50" r="7" fill="#0a0a0a" stroke="#dedede" stroke-width="3"/>
            <circle cx="76" cy="50" r="7" fill="#0a0a0a" stroke="#dedede" stroke-width="3"/>
        </svg>
    `),
    // 7. Megaphone
    createSvgDataUrl(`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none" stroke="#dedede" stroke-width="4" stroke-linecap="round" stroke-linejoin="round">
            <polygon points="25,38 75,18 75,82 25,62" fill="#141414" stroke="#dedede"/>
            <ellipse cx="75" cy="50" rx="8" ry="32" fill="#000AC2" stroke="#dedede"/>
            <rect x="12" y="42" width="13" height="16" rx="3" fill="#dedede" stroke="#dedede"/>
            <path d="M35,62 L40,84 L52,84 L46,62" fill="#141414" stroke="#dedede"/>
            <line x1="42" y1="50" x2="62" y2="50" stroke="#dedede" stroke-dasharray="3,3"/>
        </svg>
    `),
    // 8. Heavy Duty C-Stand / Tripod
    createSvgDataUrl(`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none" stroke="#dedede" stroke-width="4" stroke-linecap="round" stroke-linejoin="round">
            <line x1="50" y1="12" x2="50" y2="82" stroke="#dedede" stroke-width="6"/>
            <circle cx="50" cy="14" r="6" fill="#000AC2" stroke="#dedede"/>
            <circle cx="50" cy="38" r="5" fill="#dedede"/>
            <circle cx="50" cy="62" r="5" fill="#dedede"/>
            <line x1="50" y1="80" x2="16" y2="94" stroke="#dedede" stroke-width="5"/>
            <line x1="50" y1="80" x2="84" y2="94" stroke="#dedede" stroke-width="5"/>
            <line x1="50" y1="80" x2="50" y2="96" stroke="#dedede" stroke-width="5"/>
            <line x1="48" y1="14" x2="88" y2="8" stroke="#dedede" stroke-width="4"/>
        </svg>
    `),
    // 9. Production Video Monitor
    createSvgDataUrl(`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none" stroke="#dedede" stroke-width="4" stroke-linecap="round" stroke-linejoin="round">
            <rect x="14" y="20" width="72" height="54" rx="6" fill="#141414" stroke="#dedede"/>
            <rect x="22" y="26" width="56" height="40" rx="3" fill="#000AC2" stroke="#dedede" stroke-width="2"/>
            <circle cx="70" cy="32" r="2.5" fill="#ff0044"/>
            <line x1="18" y1="12" x2="26" y2="20" stroke="#dedede" stroke-width="4"/>
            <line x1="82" y1="12" x2="74" y2="20" stroke="#dedede" stroke-width="4"/>
            <rect x="36" y="74" width="28" height="14" fill="#141414" stroke="#dedede"/>
            <line x1="26" y1="88" x2="74" y2="88" stroke="#dedede" stroke-width="4"/>
        </svg>
    `),
    // 10. Cine Gimbal Rig
    createSvgDataUrl(`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none" stroke="#dedede" stroke-width="4" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="50" cy="46" r="32" stroke="#dedede" stroke-width="4" fill="none"/>
            <rect x="34" y="34" width="32" height="24" rx="4" fill="#141414" stroke="#000AC2" stroke-width="3"/>
            <circle cx="50" cy="46" r="6" fill="#dedede"/>
            <line x1="50" y1="78" x2="50" y2="94" stroke="#dedede" stroke-width="6"/>
            <line x1="30" y1="94" x2="70" y2="94" stroke="#dedede" stroke-width="5"/>
            <circle cx="18" cy="46" r="4" fill="#000AC2"/>
            <circle cx="82" cy="46" r="4" fill="#000AC2"/>
        </svg>
    `)
];

// 11. Film Award Special Power-Up (Laurel Wreath + Golden Film Trophy)
export const filmAwardPNG = createSvgDataUrl(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none" stroke="#ffffff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
        <!-- Laurel Left -->
        <path d="M 30,82 C 16,68 14,38 32,18" stroke="#ffffff" stroke-width="3.5" fill="none"/>
        <path d="M 28,74 C 18,72 16,62 26,62" fill="#ffffff"/>
        <path d="M 23,58 C 13,56 12,46 22,46" fill="#ffffff"/>
        <path d="M 22,42 C 12,40 12,30 22,30" fill="#ffffff"/>
        <path d="M 26,27 C 18,24 20,14 30,16" fill="#ffffff"/>
        
        <!-- Laurel Right -->
        <path d="M 70,82 C 84,68 86,38 68,18" stroke="#ffffff" stroke-width="3.5" fill="none"/>
        <path d="M 72,74 C 82,72 84,62 74,62" fill="#ffffff"/>
        <path d="M 77,58 C 87,56 88,46 78,46" fill="#ffffff"/>
        <path d="M 78,42 C 88,40 88,30 78,30" fill="#ffffff"/>
        <path d="M 74,27 C 82,24 80,14 70,16" fill="#ffffff"/>
        
        <!-- Center Film Trophy -->
        <polygon points="50,22 56,36 70,37 59,47 63,61 50,53 37,61 41,47 30,37 44,36" fill="#000AC2" stroke="#ffffff" stroke-width="2.5"/>
        <rect x="42" y="65" width="16" height="12" fill="#141414" stroke="#ffffff" stroke-width="2"/>
        <rect x="36" y="77" width="28" height="8" rx="2" fill="#ffffff" stroke="#ffffff"/>
        <circle cx="50" cy="42" r="3" fill="#ffffff"/>
    </svg>
`);

if (typeof window !== 'undefined') {
    window.equipmentPNGs = equipmentPNGs;
    window.filmAwardPNG = filmAwardPNG;
}
