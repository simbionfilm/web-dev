const fs = require('fs');
const path = require('path');

const indexFile = 'index.html';
let html = fs.readFileSync(indexFile, 'utf8');

const htmlStart = `<div class="relative w-full py-4 lg:py-8 bts-enter overflow-hidden" style="perspective: 1000px;">`;
const htmlEnd = `</div>
                </div>
            </div>
        </div>
    </section>`;

const startIndex = html.indexOf(htmlStart);
const endIndex = html.indexOf(htmlEnd, startIndex) + htmlEnd.length;

if (startIndex > -1 && endIndex > -1) {
    const newHtml = `<div class="relative w-full py-16 lg:py-32 bts-enter flex justify-center items-center overflow-hidden" style="perspective: 1200px; min-height: 50vh;">
            <div id="bts-carousel-ring" class="relative flex justify-center items-center" style="transform-style: preserve-3d; width: 100%; height: 100%;">
                <!-- Images injected by JS -->
            </div>
        </div>
    </section>`;
    
    html = html.substring(0, startIndex) + newHtml + html.substring(endIndex);
    fs.writeFileSync(indexFile, html);
    console.log("HTML replaced.");
} else {
    console.log("Could not find HTML boundaries.");
}
