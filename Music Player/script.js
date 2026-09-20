const songs = [
    { title: 'Bloom', artist: 'The Paper Kites', duration: '3:42', color: 'linear-gradient(145deg,#9d765e,#d6b38e 50%,#42605b)', src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' },
    { title: 'Sweet Disposition', artist: 'The Temper Trap', duration: '3:52', color: 'linear-gradient(145deg,#455d70,#d77e59 55%,#efd09d)', src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3' },
    { title: 'Holocene', artist: 'Bon Iver', duration: '5:36', color: 'linear-gradient(145deg,#b9c9c6,#6b8494 55%,#223945)', src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3' },
    { title: 'Cherry Wine', artist: 'Hozier', duration: '4:01', color: 'linear-gradient(145deg,#935d48,#dba76d 50%,#313f3c)', src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3' },
    { title: 'Youth', artist: 'Daughter', duration: '4:13', color: 'linear-gradient(145deg,#333544,#a18598 60%,#e0bcc0)', src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3' },
    { title: 'Rivers and Roads', artist: 'The Head and the Heart', duration: '4:44', color: 'linear-gradient(145deg,#d8ac70,#9f5f45 55%,#314a50)', src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3' }
];
const $ = id => document.getElementById(id); const audio = $('audio');
let index = 0, shuffled = false, repeating = false, liked = false;
const format = seconds => { if (!Number.isFinite(seconds)) return songs[index].duration; return `${Math.floor(seconds / 60)}:${String(Math.floor(seconds % 60)).padStart(2, '0')}`; };
function renderTracks() { $('trackGrid').innerHTML = songs.map((song, i) => `<article class="track-card" data-index="${i}"><div class="cover" style="--cover:${song.color}"><b>${song.title}</b></div><h3>${song.title}</h3><p>${song.artist}</p></article>`).join(''); }
function renderQueue() { $('queueList').innerHTML = songs.filter((_, i) => i !== index).slice(0, 3).map(song => `<div class="queue-item"><div class="queue-thumb" style="--cover:${song.color}"></div><div><strong>${song.title}</strong><span>${song.artist}</span></div><time>${song.duration}</time></div>`).join(''); }
function loadSong(i, shouldPlay = false) { index = (i + songs.length) % songs.length; const song = songs[index]; audio.src = song.src; $('nowTitle').textContent = song.title; $('nowArtist').textContent = song.artist; $('duration').textContent = song.duration; $('currentTime').textContent = '0:00'; $('progress').value = 0; updateProgressFill(); renderQueue(); if (shouldPlay) audio.play().catch(() => { }); }
function setPlaying(playing) { $('playPause').textContent = playing ? 'Ⅱ' : '▶'; $('playPause').setAttribute('aria-label', playing ? 'Pause' : 'Play'); $('record').style.animation = playing ? 'spin 8s linear infinite' : 'none'; }
function togglePlay() { if (audio.paused) { audio.play().catch(() => { }); } else { audio.pause(); } }
function updateProgressFill() { const pct = $('progress').value; $('progress').style.background = `linear-gradient(to right,var(--accent) ${pct}%,#e9e4de ${pct}%)`; }
audio.addEventListener('play', () => setPlaying(true)); audio.addEventListener('pause', () => setPlaying(false));
audio.addEventListener('loadedmetadata', () => { $('duration').textContent = format(audio.duration); });
audio.addEventListener('timeupdate', () => { if (audio.duration) { $('progress').value = audio.currentTime / audio.duration * 100; $('currentTime').textContent = format(audio.currentTime); updateProgressFill(); } });
audio.addEventListener('ended', () => repeating ? (audio.currentTime = 0, audio.play()) : nextSong());
function nextSong() { loadSong(shuffled ? Math.floor(Math.random() * songs.length) : index + 1, true); } function previousSong() { loadSong(index - 1, true); }
$('playPause').onclick = togglePlay; $('next').onclick = nextSong; $('previous').onclick = previousSong;
$('featuredPlay').onclick = () => { index = 0; loadSong(0, true); };
$('progress').oninput = e => { if (audio.duration) audio.currentTime = e.target.value / 100 * audio.duration; updateProgressFill(); };
$('volume').oninput = e => audio.volume = e.target.value; audio.volume = .7;
$('shuffle').onclick = e => { shuffled = !shuffled; e.currentTarget.classList.toggle('active', shuffled) };
$('repeat').onclick = e => { repeating = !repeating; e.currentTarget.classList.toggle('active', repeating) };
$('likeButton').onclick = e => { liked = !liked; e.currentTarget.textContent = liked ? '♥' : '♡'; e.currentTarget.classList.toggle('liked', liked) };
$('clearQueue').onclick = () => { $('queueList').innerHTML = '<p style="font-size:11px;color:#999">Your queue is clear.</p>'; };
document.addEventListener('click', e => { const card = e.target.closest('.track-card'); if (card) loadSong(Number(card.dataset.index), true); });
const style = document.createElement('style'); style.textContent = '@keyframes spin{to{transform:rotate(360deg)}}'; document.head.append(style);
renderTracks(); loadSong(0);
