const express = require('express');
const path = require('path');
const app = express();

// 静的ファイルを提供
app.use(express.static(path.join(__dirname)));

// すべてのルートをindex.htmlにリダイレクト
app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// ポート設定
const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
