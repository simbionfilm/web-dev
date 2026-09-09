// Precise vector representations and file path resolvers for the 11 film equipment assets

function svgData(svg) {
    return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg.trim());
}

// 1. Clapperboard (clapperboard.png)
const clapperboardSVG = svgData(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="white">
    <!-- Slanted Top Clapper -->
    <g transform="rotate(-15 60 200)">
        <rect x="50" y="80" width="412" height="70" rx="12" fill="white"/>
        <polygon points="120,80 170,80 130,150 80,150" fill="black"/>
        <polygon points="220,80 270,80 230,150 180,150" fill="black"/>
        <polygon points="320,80 370,80 330,150 280,150" fill="black"/>
        <polygon points="420,80 450,80 430,150 400,150" fill="black"/>
    </g>
    <!-- Bottom Slate Body -->
    <rect x="74" y="240" width="364" height="230" rx="16" fill="white"/>
    <!-- Slate Upper Strips -->
    <polygon points="130,240 180,240 140,300 90,300" fill="black"/>
    <polygon points="230,240 280,240 240,300 190,300" fill="black"/>
    <polygon points="330,240 380,240 340,300 290,300" fill="black"/>
    <polygon points="415,240 438,240 438,275 390,300" fill="black"/>
    <!-- Slate dividing lines -->
    <line x1="80" y1="300" x2="430" y2="300" stroke="black" stroke-width="8"/>
</svg>
`);

// 2. Cinema Spotlight (cinema.png)
const cinemaSVG = svgData(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="white">
    <!-- Spotlight Housing Angled -->
    <g transform="rotate(25 256 256)">
        <path d="M120,180 Q100,256 120,332 L300,380 L300,132 Z" fill="white"/>
        <path d="M80,205 Q60,256 80,307 L110,315 L110,197 Z" fill="white"/>
        <polygon points="315,128 440,80 440,432 315,384" fill="white"/>
        <!-- Mounting Yoke -->
        <path d="M220,60 L220,240 A20,20 0 0,0 260,240 L260,60" fill="none" stroke="white" stroke-width="32" stroke-linecap="round"/>
        <circle cx="240" cy="240" r="18" fill="black"/>
    </g>
</svg>
`);

// 3. Studio Light with Barn Doors (light.png)
const lightSVG = svgData(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="white">
    <!-- Center Lamp Housing -->
    <rect x="70" y="160" width="220" height="170" rx="20" fill="white"/>
    <rect x="40" y="180" width="30" height="130" rx="12" fill="white"/>
    <rect x="100" y="185" width="80" height="12" rx="6" fill="black"/>
    <rect x="100" y="215" width="80" height="12" rx="6" fill="black"/>
    <!-- Barn Doors -->
    <polygon points="300,130 460,50 460,180 300,165" fill="white"/>
    <polygon points="300,175 460,190 460,322 300,337" fill="white"/>
    <polygon points="300,347 460,332 460,462 300,382" fill="white"/>
    <!-- Stand Mount -->
    <rect x="140" y="340" width="60" height="35" rx="8" fill="white"/>
    <rect x="150" y="375" width="40" height="80" rx="4" fill="white"/>
</svg>
`);

// 4. Boom Microphone (microphone.png)
const microphoneSVG = svgData(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="white">
    <!-- Diagonal Blimp / Mic Capsule -->
    <g transform="rotate(45 256 256)">
        <rect x="156" y="80" width="200" height="130" rx="45" fill="white"/>
        <!-- Ring cuts -->
        <rect x="176" y="100" width="30" height="90" rx="12" fill="black"/>
        <rect x="226" y="100" width="10" height="90" rx="4" fill="black"/>
        <!-- Handle & Shockmount Grip -->
        <rect x="236" y="210" width="40" height="230" rx="14" fill="white"/>
        <path d="M210,180 C120,200 120,380 236,390" fill="none" stroke="white" stroke-width="26" stroke-linecap="round"/>
    </g>
</svg>
`);

// 5. Film Roll (film-roll.png)
const filmRollSVG = svgData(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="white">
    <!-- Large Film Reel -->
    <circle cx="310" cy="230" r="180" fill="white"/>
    <circle cx="310" cy="230" r="60" fill="black"/>
    <circle cx="310" cy="230" r="18" fill="white"/>
    <!-- Reel Cutouts -->
    <circle cx="310" cy="110" r="35" fill="black"/>
    <circle cx="430" cy="230" r="35" fill="black"/>
    <circle cx="310" cy="350" r="35" fill="black"/>
    <circle cx="190" cy="230" r="35" fill="black"/>
    <!-- Unrolling Film Ribbon -->
    <path d="M190,340 C100,370 40,430 40,490 L150,490 C150,440 180,410 240,390 Z" fill="white"/>
</svg>
`);

// 6. Video Camera (video-camera.png)
const videoCameraSVG = svgData(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="white">
    <!-- Twin Film Reels On Top -->
    <circle cx="160" cy="120" r="75" fill="white"/>
    <circle cx="160" cy="120" r="20" fill="black"/>
    <circle cx="160" cy="80" r="12" fill="black"/>
    <circle cx="160" cy="160" r="12" fill="black"/>
    <circle cx="120" cy="120" r="12" fill="black"/>
    <circle cx="200" cy="120" r="12" fill="black"/>

    <circle cx="320" cy="120" r="75" fill="white"/>
    <circle cx="320" cy="120" r="20" fill="black"/>
    <circle cx="320" cy="80" r="12" fill="black"/>
    <circle cx="320" cy="160" r="12" fill="black"/>
    <circle cx="280" cy="120" r="12" fill="black"/>
    <circle cx="360" cy="120" r="12" fill="black"/>

    <!-- Camera Body -->
    <rect x="10" y="210" width="370" height="230" rx="35" fill="white"/>
    <circle cx="240" cy="430" r="12" fill="black"/>
    <rect x="265" y="420" width="80" height="20" rx="10" fill="black"/>

    <!-- Front Lens Cone -->
    <polygon points="390,260 495,210 495,430 390,380" fill="white"/>
</svg>
`);

// 7. Director Chair (director-chair.png)
const directorChairSVG = svgData(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="white">
    <!-- Backrest Slab -->
    <rect x="90" y="40" width="332" height="130" rx="10" fill="white"/>
    <!-- Seat Slab -->
    <rect x="60" y="270" width="392" height="60" rx="12" fill="white"/>
    <!-- Side Posts -->
    <rect x="90" y="40" width="28" height="240" fill="white"/>
    <rect x="394" y="40" width="28" height="240" fill="white"/>
    <!-- X Frame Legs -->
    <line x1="120" y1="330" x2="392" y2="490" stroke="white" stroke-width="36" stroke-linecap="round"/>
    <line x1="392" y1="330" x2="120" y2="490" stroke="white" stroke-width="36" stroke-linecap="round"/>
</svg>
`);

// 8. Photography Softbox / Studio Dish (photography.png)
const photographySVG = svgData(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="white">
    <!-- Reflector Dome -->
    <path d="M110,40 Q240,140 240,280 L110,280 Z" fill="white"/>
    <rect x="190" y="125" width="60" height="30" rx="4" fill="white"/>
    <!-- Central Pole -->
    <rect x="270" y="100" width="32" height="310" rx="6" fill="white"/>
    <!-- Tripod Legs -->
    <line x1="286" y1="390" x2="180" y2="480" stroke="white" stroke-width="32" stroke-linecap="square"/>
    <line x1="180" y1="480" x2="180" y2="505" stroke="white" stroke-width="32" stroke-linecap="square"/>
    <line x1="286" y1="390" x2="392" y2="480" stroke="white" stroke-width="32" stroke-linecap="square"/>
    <line x1="392" y1="480" x2="392" y2="505" stroke="white" stroke-width="32" stroke-linecap="square"/>
</svg>
`);

// 9. Camera Crane / Jib (camera-crane.png)
const cameraCraneSVG = svgData(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="white">
    <!-- Diagonal Jib Arm -->
    <polygon points="10,180 260,80 260,120 10,220" fill="white"/>
    <!-- Counterweight Box -->
    <rect x="290" y="0" width="120" height="110" rx="14" fill="white"/>
    <rect x="330" y="110" width="30" height="40" fill="white"/>
    <!-- Camera Body & Lens -->
    <rect x="280" y="170" width="140" height="130" rx="24" fill="white"/>
    <polygon points="440,200 505,180 505,290 440,270" fill="white"/>
    <!-- Tripod Head & Legs -->
    <rect x="140" y="190" width="90" height="100" rx="16" fill="white"/>
    <polygon points="80,230 140,230 140,260 80,260" rx="10" fill="white"/>
    <line x1="185" y1="280" x2="60" y2="480" stroke="white" stroke-width="32" stroke-linecap="round"/>
    <line x1="185" y1="280" x2="185" y2="480" stroke="white" stroke-width="32" stroke-linecap="round"/>
    <line x1="185" y1="280" x2="310" y2="480" stroke="white" stroke-width="32" stroke-linecap="round"/>
    <!-- Wheels/Feet -->
    <circle cx="50" cy="490" r="22" fill="white"/>
    <circle cx="185" cy="490" r="22" fill="white"/>
    <circle cx="320" cy="490" r="22" fill="white"/>
</svg>
`);

// 10. Film Making Dolly Cart (film-making.png)
const filmMakingSVG = svgData(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="white">
    <!-- Camera Body -->
    <rect x="60" y="40" width="320" height="210" rx="24" fill="white"/>
    <!-- Viewfinder Screen -->
    <rect x="100" y="80" width="160" height="85" rx="8" fill="black"/>
    <circle cx="310" cy="120" r="22" fill="black"/>
    <!-- Lens and Eyepiece -->
    <rect x="16" y="75" width="36" height="36" rx="8" fill="white"/>
    <polygon points="390,110 490,60 490,200 390,150" fill="white"/>
    <!-- Mount Column -->
    <path d="M190,250 L250,250 L270,360 L170,360 Z" fill="white"/>
    <!-- Dolly Base & Track Wheels -->
    <rect x="50" y="390" width="340" height="38" rx="10" fill="white"/>
    <circle cx="60" cy="410" r="38" fill="white"/>
    <circle cx="380" cy="410" r="38" fill="white"/>
</svg>
`);

// 11. Film Award Trophy (film award.png) - Power-Up / Shield
export const filmAwardSVG = svgData(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="white">
    <!-- Laurel Wreath Left -->
    <path d="M 190,420 C 70,360 30,220 100,100" stroke="white" stroke-width="18" fill="none" stroke-linecap="round"/>
    <ellipse cx="65" cy="350" rx="26" ry="14" transform="rotate(-30 65 350)" fill="white"/>
    <ellipse cx="40" cy="270" rx="26" ry="14" transform="rotate(-15 40 270)" fill="white"/>
    <ellipse cx="45" cy="190" rx="26" ry="14" transform="rotate(10 45 190)" fill="white"/>
    <ellipse cx="80" cy="120" rx="26" ry="14" transform="rotate(35 80 120)" fill="white"/>
    
    <!-- Laurel Wreath Right -->
    <path d="M 322,420 C 442,360 482,220 412,100" stroke="white" stroke-width="18" fill="none" stroke-linecap="round"/>
    <ellipse cx="447" cy="350" rx="26" ry="14" transform="rotate(30 447 350)" fill="white"/>
    <ellipse cx="472" cy="270" rx="26" ry="14" transform="rotate(15 472 270)" fill="white"/>
    <ellipse cx="467" cy="190" rx="26" ry="14" transform="rotate(-10 467 190)" fill="white"/>
    <ellipse cx="432" cy="120" rx="26" ry="14" transform="rotate(-35 432 120)" fill="white"/>

    <!-- Center Film Reel Trophy -->
    <circle cx="256" cy="256" r="105" fill="white"/>
    <circle cx="256" cy="256" r="32" fill="black"/>
    <circle cx="256" cy="180" r="18" fill="black"/>
    <circle cx="332" cy="256" r="18" fill="black"/>
    <circle cx="256" cy="332" r="18" fill="black"/>
    <circle cx="180" cy="256" r="18" fill="black"/>
    
    <!-- Ribbon Arch -->
    <path d="M 180,450 Q 256,410 332,450 L 256,420 Z" fill="white"/>
</svg>
`);

// Complete 10 Obstacles mapping with exact filenames, paths, and built-in vector fallback
export const equipmentPNGs = [
    {
        name: 'Clapperboard',
        id: 1,
        src: 'clapperboard.png',
        paths: ['clapperboard.png', './clapperboard.png', 'assets/clapperboard.png', './assets/clapperboard.png', '1.png', './1.png'],
        fallback: clapperboardSVG
    },
    {
        name: 'Cinema Spotlight',
        id: 2,
        src: 'cinema.png',
        paths: ['cinema.png', './cinema.png', 'assets/cinema.png', './assets/cinema.png', '2.png', './2.png'],
        fallback: cinemaSVG
    },
    {
        name: 'Studio Light',
        id: 3,
        src: 'light.png',
        paths: ['light.png', './light.png', 'assets/light.png', './assets/light.png', '3.png', './3.png'],
        fallback: lightSVG
    },
    {
        name: 'Boom Microphone',
        id: 4,
        src: 'microphone.png',
        paths: ['microphone.png', './microphone.png', 'assets/microphone.png', './assets/microphone.png', '4.png', './4.png'],
        fallback: microphoneSVG
    },
    {
        name: 'Film Roll',
        id: 5,
        src: 'film-roll.png',
        paths: ['film-roll.png', './film-roll.png', 'assets/film-roll.png', './assets/film-roll.png', '5.png', './5.png'],
        fallback: filmRollSVG
    },
    {
        name: 'Video Camera',
        id: 6,
        src: 'video-camera.png',
        paths: ['video-camera.png', './video-camera.png', 'assets/video-camera.png', './assets/video-camera.png', '6.png', './6.png'],
        fallback: videoCameraSVG
    },
    {
        name: 'Director Chair',
        id: 7,
        src: 'director-chair.png',
        paths: ['director-chair.png', './director-chair.png', 'assets/director-chair.png', './assets/director-chair.png', '7.png', './7.png'],
        fallback: directorChairSVG
    },
    {
        name: 'Photography Softbox',
        id: 8,
        src: 'photography.png',
        paths: ['photography.png', './photography.png', 'assets/photography.png', './assets/photography.png', '8.png', './8.png'],
        fallback: photographySVG
    },
    {
        name: 'Camera Crane',
        id: 9,
        src: 'camera-crane.png',
        paths: ['camera-crane.png', './camera-crane.png', 'assets/camera-crane.png', './assets/camera-crane.png', '9.png', './9.png'],
        fallback: cameraCraneSVG
    },
    {
        name: 'Film Making Dolly',
        id: 10,
        src: 'film-making.png',
        paths: ['film-making.png', './film-making.png', 'assets/film-making.png', './assets/film-making.png', '10.png', './10.png'],
        fallback: filmMakingSVG
    }
];

// Film Award Trophy Item (Power-Up / Invincible Shield)
export const filmAwardPNG = {
    name: 'Film Award',
    src: 'film award.png',
    paths: ['film award.png', './film award.png', 'assets/film award.png', './assets/film award.png', 'award.png', './award.png'],
    fallback: filmAwardSVG
};

if (typeof window !== 'undefined') {
    window.equipmentPNGs = equipmentPNGs;
    window.filmAwardPNG = filmAwardPNG;
    window.filmAwardSVG = filmAwardSVG;
}
