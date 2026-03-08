const fs = require('fs');
const path = require('path');

const indexPath = path.join(__dirname, '../dist/index.html');
let html = fs.readFileSync(indexPath, 'utf-8');

const pwaTags = `<link rel="apple-touch-icon" href="/icon.png" />
<link rel="manifest" href="/manifest.json" />
    `;

if (!html.includes('apple-touch-icon')) {
  html = html.replace('<link rel="shortcut icon"', pwaTags + '<link rel="shortcut icon"');
  fs.writeFileSync(indexPath, html);
  console.log('✓ PWA 태그가 index.html에 추가되었습니다.');
} else {
  console.log('✓ PWA 태그가 이미 존재합니다.');
}
