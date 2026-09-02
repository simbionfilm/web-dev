// Ultra-lightweight 3D Vector Crystallized Cameraman Sequence Engine (60 High-Res Frames)
// Mathematical 3D Gyroscopic Rotation with Realtime Scroll Control

function generate3DSequenceFrames(totalFrames = 60) {
    const frames = [];
    for (let f = 0; f < totalFrames; f++) {
        const angle = (f / totalFrames) * Math.PI * 2; // 0 to 360 deg
        const cosA = Math.cos(angle);
        const sinA = Math.sin(angle);
        
        // Depth-based lighting & parallax shifts for 3D crystal blue cameraman
        const bodyThickness = 22 * cosA;
        const cameraAngle = -12 + (sinA * 15);
        const limbSpread = 1 + (Math.abs(cosA) * 0.15);
        const blueHighlight = Math.round(180 + (cosA * 60));
        const depthAlpha = (0.75 + (cosA * 0.25)).toFixed(2);
        const glowOpacity = (0.6 + (Math.sin(angle * 2) * 0.3)).toFixed(2);

        // Perspective 3D Coordinates
        const headX = 256 + (sinA * 8);
        const headY = 210 - (Math.abs(sinA) * 6);
        
        const camX = 256 + (sinA * 28);
        const camY = 100 - (cosA * 8);
        const camWidth = 140 * (0.85 + (Math.abs(cosA) * 0.3));
        const camReelSize = 36 * (0.8 + (Math.abs(cosA) * 0.25));

        const svg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 600" width="512" height="600">
    <defs>
        <!-- Simbion Royal Glass Gradient -->
        <linearGradient id="crystalGrad_${f}" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#4862ff" stop-opacity="${depthAlpha}"/>
            <stop offset="45%" stop-color="#000AC2" stop-opacity="0.95"/>
            <stop offset="85%" stop-color="#020542" stop-opacity="0.98"/>
            <stop offset="100%" stop-color="#7090ff" stop-opacity="${depthAlpha}"/>
        </linearGradient>

        <!-- Inner Ambient Sparkle Flare -->
        <radialGradient id="sparkleGrad_${f}" cx="50%" cy="40%" r="60%">
            <stop offset="0%" stop-color="#ffffff" stop-opacity="0.8"/>
            <stop offset="30%" stop-color="#3e64ff" stop-opacity="0.4"/>
            <stop offset="100%" stop-color="#000AC2" stop-opacity="0"/>
        </radialGradient>

        <!-- Specular Highlight -->
        <linearGradient id="edgeGlow_${f}" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#ffffff" stop-opacity="0.9"/>
            <stop offset="50%" stop-color="#6488ff" stop-opacity="0.3"/>
            <stop offset="100%" stop-color="#000AC2" stop-opacity="0.1"/>
        </linearGradient>
    </defs>

    <!-- 3D Aura / Shadow Floor -->
    <ellipse cx="256" cy="560" rx="${80 * Math.abs(cosA) + 40}" ry="14" fill="#000AC2" opacity="0.3" filter="blur(8px)"/>

    <g transform="translate(0, 15)">
        <!-- 3D Back Depth Layer (When turning away) -->
        ${cosA < 0 ? `
        <g transform="translate(${-bodyThickness * 0.6}, 0) scale(${limbSpread}, 1)" opacity="0.4">
            <path d="M ${headX-20},${headY+40} Q 256,360 ${256-40*sinA},440 L ${256+40*sinA},440 Q 256,360 ${headX+20},${headY+40} Z" fill="#00052a"/>
        </g>
        ` : ''}

        <!-- 3D Cameraman Character Body -->
        <g id="char-body">
            <!-- Dynamic Kicking Legs (Simbion Pose) -->
            <!-- Right Leg (Bent Outward) -->
            <path d="M 270,370 C ${310+cosA*25},${390-sinA*15} ${360+cosA*20},${370+sinA*20} ${350+cosA*15},${420+sinA*10} C ${335+cosA*10},${435+sinA*10} ${285+cosA*10},${405} 255,395" 
                  fill="url(#crystalGrad_${f})" stroke="#7aa0ff" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>
            
            <!-- Left Leg (Standing / Curved Anchor) -->
            <path d="M 240,370 C ${220-cosA*10},${420} ${245+sinA*15},${480} ${250+sinA*20},${530} C ${235+sinA*15},${532} ${210-cosA*15},${470} 225,385" 
                  fill="url(#crystalGrad_${f})" stroke="#7aa0ff" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>

            <!-- Main Torso Arch -->
            <path d="M ${236-cosA*10},${headY+55} C ${215-sinA*20},${headY+120} ${230+sinA*15},350 256,380 C ${282-sinA*15},350 ${297+sinA*20},${headY+120} ${276+cosA*10},${headY+55} Z" 
                  fill="url(#crystalGrad_${f})" stroke="#9bbaff" stroke-width="7" stroke-linejoin="round"/>
            
            <!-- Torso Crystal Core Sparkles -->
            <ellipse cx="256" cy="300" rx="${22*Math.abs(cosA)+10}" ry="45" fill="url(#sparkleGrad_${f})" opacity="${glowOpacity}"/>

            <!-- Athletic Arms Holding Camera Upward -->
            <!-- Left Arm -->
            <path d="M ${232-cosA*8},${headY+70} C ${180-sinA*25},${headY+40} ${170-cosA*20},${camY+60} ${camX-45},${camY+35}" 
                  fill="none" stroke="url(#crystalGrad_${f})" stroke-width="26" stroke-linecap="round"/>
            <path d="M ${232-cosA*8},${headY+70} C ${180-sinA*25},${headY+40} ${170-cosA*20},${camY+60} ${camX-45},${camY+35}" 
                  fill="none" stroke="#a6c4ff" stroke-width="6" stroke-linecap="round" opacity="0.8"/>

            <!-- Right Arm -->
            <path d="M ${280+cosA*8},${headY+70} C ${332+sinA*25},${headY+40} ${342+cosA*20},${camY+60} ${camX+45},${camY+35}" 
                  fill="none" stroke="url(#crystalGrad_${f})" stroke-width="26" stroke-linecap="round"/>
            <path d="M ${280+cosA*8},${headY+70} C ${332+sinA*25},${headY+40} ${342+cosA*20},${camY+60} ${camX+45},${camY+35}" 
                  fill="none" stroke="#a6c4ff" stroke-width="6" stroke-linecap="round" opacity="0.8"/>

            <!-- Crystal Head with Ring Core -->
            <circle cx="${headX}" cy="${headY}" r="38" fill="url(#crystalGrad_${f})" stroke="#ffffff" stroke-width="6"/>
            <circle cx="${headX + cosA*6}" cy="${headY - 4}" r="22" fill="#000738" stroke="#5078ff" stroke-width="4"/>
            <circle cx="${headX + cosA*10}" cy="${headY - 10}" r="9" fill="#ffffff" opacity="0.9"/>
        </g>

        <!-- 3D Overhead Cinema Movie Camera (Rotating) -->
        <g id="overhead-camera" transform="translate(${camX}, ${camY}) rotate(${cameraAngle} 0 0)">
            <!-- Camera Film Reels -->
            <g transform="translate(${-30*cosA}, -35)">
                <circle cx="-35" cy="0" r="${camReelSize}" fill="url(#crystalGrad_${f})" stroke="#ffffff" stroke-width="5"/>
                <circle cx="-35" cy="0" r="10" fill="#ffffff"/>
                <circle cx="35" cy="0" r="${camReelSize}" fill="url(#crystalGrad_${f})" stroke="#ffffff" stroke-width="5"/>
                <circle cx="35" cy="0" r="10" fill="#ffffff"/>
            </g>

            <!-- Camera Main Body -->
            <rect x="${-camWidth/2}" y="-20" width="${camWidth}" height="70" rx="16" fill="url(#crystalGrad_${f})" stroke="#8ab0ff" stroke-width="7"/>
            <rect x="${-camWidth/2 + 10}" y="-10" width="${camWidth - 20}" height="20" rx="6" fill="#010636"/>

            <!-- Front Lens Cone with 3D Depth Direction -->
            <polygon points="${camWidth/2 - 5},-10 ${camWidth/2 + 45*cosA + 15},-28 ${camWidth/2 + 45*cosA + 15},58 ${camWidth/2 - 5},40" 
                     fill="url(#crystalGrad_${f})" stroke="#ffffff" stroke-width="5"/>
            <!-- Viewfinder / Mattebox -->
            <rect x="${-camWidth/2 - 22}" y="0" width="22" height="32" rx="4" fill="#00094b" stroke="#7096ff" stroke-width="3"/>
        </g>
    </g>
</svg>`;
        frames.push('data:image/svg+xml;utf8,' + encodeURIComponent(svg.trim()));
    }
    return frames;
}

export const sequence3DFrames = generate3DSequenceFrames(60);

if (typeof window !== 'undefined') {
    window.sequence3DFrames = sequence3DFrames;
}
