// scripts/helpers/js-loader.js
hexo.extend.helper.register('load_game_js', function() {
  const fs = require('fs');
  const path = require('path');
  
  const jsDir = path.join(hexo.source_dir, 'source/js/season_system');
  let result = '';
  
  function loadJSFiles(dir) {
    if (!fs.existsSync(dir)) return '';
    
    const files = fs.readdirSync(dir);
    files.sort(); // 可选：按字母顺序排序
    
    files.forEach(file => {
      const fullPath = path.join(dir, file);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        result += loadJSFiles(fullPath);
      } else if (path.extname(file) === '.js') {
        const relativePath = path.relative(hexo.source_dir, fullPath);
        result += `<script src="${this.url_for(relativePath)}"></script>\n`;
      }
    });
    
    return result;
  }
  
  return loadJSFiles(jsDir);
});