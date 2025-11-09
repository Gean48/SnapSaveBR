const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const { tmpdir } = require('os');
const yt = require('yt-dlp-exec');
const app = express();

app.use(cors());
app.use(express.json({ limit: '1mb' }));
app.use(express.static(path.join(__dirname)));

function baixarVideo(url, res) {
  const output = path.join(tmpdir(), `download_${Date.now()}.mp4`);
  yt(url, {
    output,
    format: 'mp4',
    quiet: true,
    noWarnings: true,
    noCheckCertificates: true,
  })
    .then(() => {
      res.setHeader('Content-Type', 'video/mp4');
      res.setHeader('Content-Disposition', 'attachment; filename="video.mp4"');
      const stream = fs.createReadStream(output);
      stream.pipe(res);
      stream.on('close', () => fs.unlink(output, () => {}));
    })
    .catch((err) => {
      console.error('Erro ao baixar vídeo:', err);
      res.status(500).json({ error: 'Falha ao baixar o vídeo. Verifique o link.' });
    });
}

app.post('/api/download', (req, res) => {
  const { url } = req.body || {};
  if (!url) return res.status(400).json({ error: 'URL ausente.' });
  if (!url.includes('tiktok.com') && !url.includes('instagram.com'))
    return res.status(400).json({ error: 'Apenas links do TikTok e Instagram são suportados.' });
  baixarVideo(url, res);
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Servidor rodando em http://localhost:${PORT}`));
           
