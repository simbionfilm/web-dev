const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf-8');
const script = `
<script>
window.onerror = function(msg, url, lineNo, columnNo, error) {
  document.body.innerHTML += '<div style="position:fixed;top:0;left:0;background:red;color:white;z-index:999999;font-size:24px;padding:20px;">' + msg + ' at ' + lineNo + ':' + columnNo + '</div>';
  return false;
};
window.addEventListener('unhandledrejection', function(event) {
  document.body.innerHTML += '<div style="position:fixed;top:50px;left:0;background:orange;color:white;z-index:999999;font-size:24px;padding:20px;">Promise Rejection: ' + event.reason + '</div>';
});
</script>
`;
if (!html.includes('window.onerror')) {
  html = html.replace('</head>', script + '</head>');
  fs.writeFileSync('index.html', html);
}
