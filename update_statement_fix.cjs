const fs = require('fs');
const file = 'src/simbionApp.js';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(/if \(statementCanvas\) drawStatement\(totalFrames \- 1, 0\);/g, 'if (statementCanvas) drawStatement(0, 0);');

fs.writeFileSync(file, content);
