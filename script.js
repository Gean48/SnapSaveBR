const API_BASE = window.location.origin;
const btn = document.getElementById('btn');
const urlInput = document.getElementById('url');
const msg = document.getElementById('msg');

btn.addEventListener('click', async () => {
  const url = urlInput.value.trim();
  if (!url) { alert('Cole o link do Instagram ou TikTok'); return; }
  msg.innerText = 'Processando...';

  try {
    const res = await fetch(API_BASE + '/api/download', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url })
    });

    if (!res.ok) {
      const j = await res.json().catch(()=>({error: res.statusText}));
      msg.innerText = 'Erro: ' + (j.error || res.statusText);
      return;
    }

    const blob = await res.blob();
    const link = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = link;
    a.download = 'video.mp4';
    a.click();
    URL.revokeObjectURL(link);

    msg.innerText = 'Download iniciado ✅';
  } catch (err) {
    console.error(err);
    msg.innerText = 'Erro: ' + (err.message || err);
  }
});
