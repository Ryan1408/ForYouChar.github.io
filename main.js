// Tabs handling (only the header tabs inside `.tabs`)
const tabs = document.querySelectorAll('.tabs .tab');
const sections = document.querySelectorAll('.section');

tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    tabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    const target = tab.dataset.target;
    sections.forEach(s => s.classList.toggle('active', s.id === target));
  });
});

// counter
const startDate = new Date('2024-11-21'); 
const today = new Date();
const daysTogether = Math.floor((today - startDate) / (1000 * 60 * 60 * 24));
document.getElementById('love-counter').textContent = `We've been together for ${daysTogether} days 💕`;


// Audio play
const songList = document.getElementById('song-list');
let currentAudio = null;
let currentItem = null;

function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60).toString().padStart(2, '0');
  return `${mins}:${secs}`;
}

function createAudioUI(src, li) {
  const audio = new Audio(src);
  audio.controls = true;
  audio.preload = 'metadata';

  const info = document.createElement('div');
  info.className = 'audio-info';

  const playBtn = document.createElement('button');
  playBtn.textContent = '▶';
  playBtn.className = 'play-btn';

  const time = document.createElement('span');
  time.className = 'duration';
  time.textContent = '...';

  const progress = document.createElement('input');
  progress.type = 'range';
  progress.min = 0;
  progress.max = 100;
  progress.value = 0;
  progress.className = 'progress';

  info.append(playBtn, time, progress);
  li.appendChild(info);

  audio.addEventListener('loadedmetadata', () => {
    time.textContent = formatTime(audio.duration);
  });

  audio.addEventListener('timeupdate', () => {
    progress.value = (audio.currentTime / audio.duration) * 100;
  });

  progress.addEventListener('input', () => {
    audio.currentTime = (progress.value / 100) * audio.duration;
  });

  playBtn.addEventListener('click', () => {
    if (audio.paused) {
      if (currentAudio && currentAudio !== audio) {
        currentAudio.pause();
        currentItem.classList.remove('playing');
        currentItem.querySelector('.play-btn').textContent = '▶';
      }
      audio.play();
      playBtn.textContent = '⏸';
      li.classList.add('playing');
      currentAudio = audio;
      currentItem = li;
    } else {
      audio.pause();
      playBtn.textContent = '▶';
      li.classList.remove('playing');
    }
  });

  audio.addEventListener('ended', () => {
    playBtn.textContent = '▶';
    li.classList.remove('playing');
  });
}

songList.querySelectorAll('li').forEach(li => {
  const src = li.dataset.src;
  createAudioUI(src, li);
});




// Gallery grid element
const galleryGrid = document.getElementById('gallery-grid');

// images array must be declared before we try to load defaults
let images = []; // {src, name}
let currentIndex = -1;

// Try to load default images from the local `images/` folder so they persist
// without upload. We probe each path and only add if the fetch succeeds.
const defaultImagePaths = [
  'images/char/7B7FE6E0-B32A-41CB-9C0C-C66225ECBEB5.jpg',
  'images/char/21BC9F3F-C55C-472E-B74C-FA4DF10CDD3F.jpg',
  'images/char/787D203D-306C-400E-8BA9-B3BCE6537C7C.jpg',
  'images/char/94817AB3-4C19-4E87-B302-770845D01A33.jpg',
  'images/char/C5AB95B3-3456-4247-A214-8A2F63BA7640.jpg',
  'images/char/cachedImage.png',
  'images/char/cachedImage(1).png',
  'images/char/FCC4F3F6-DC9F-4760-A262-51C46C2F2738.jpg',
  'images/char/IMG_2055.jpg',
  'images/char/IMG_2175.jpg',
  'images/char/IMG_2176.jpg',
  'images/char/IMG_2589.PNG',
  'images/char/IMG_2727.jpg',
  'images/char/IMG_2825.jpg',
  'images/char/IMG_2992.jpg',
  'images/char/IMG_2993.jpg',
  'images/char/IMG_3012.jpg',
  'images/char/IMG_3018.jpg',
  'images/char/IMG_3022.jpg',
  'images/char/IMG_3028.jpg',
  'images/char/IMG_3029.jpg',
  'images/char/IMG_3662.jpg',
  'images/char/IMG_3701.jpg',
  'images/char/IMG_3901.jpg',
  'images/char/IMG_4179.jpg',
  'images/char/IMG_6977.jpg',
  'images/char/IMG_6986.jpg',
  'images/char/IMG_6987.jpg', 
  'images/char/IMG_6988.jpg', 
  'images/char/IMG_6989.jpg', 
  'images/char/IMG_6992.jpg', 
  'images/char/IMG_6993.jpg', 
  'images/char/IMG_6995.jpg', 
  'images/char/IMG_6996.jpg',
  'images/char/lp_image.jpg'
];

function loadDefaultImages(){
  const probes = defaultImagePaths.map(p => {
    // First try fetch (works when served over HTTP). If that fails (e.g. file://),
    // fall back to creating an Image() and waiting for onload/onerror.
    return fetch(p)
      .then(r => r.ok ? {src: p, name: p.split('/').pop()} : null)
      .catch(() => {
        return new Promise(resolve => {
          const img = new Image();
          img.onload = () => resolve({src: p, name: p.split('/').pop()});
          img.onerror = () => resolve(null);
          img.src = p;
        });
      });
  });

  Promise.all(probes).then(results => {
    results.forEach(r => { if (r) images.push(r); });
    console.log('default images loaded:', images);
    renderGallery();
  });
}

// load defaults (if present)
loadDefaultImages();

// --- Gallery upload and lightbox ---
const lightbox = document.getElementById('lightbox');
const lbImage = document.getElementById('lb-image');
const lbClose = document.getElementById('lb-close');
const lbPrev = document.getElementById('lb-prev');
const lbNext = document.getElementById('lb-next');

function renderGallery(){
  galleryGrid.innerHTML = '';
  images.forEach((it, i) => {
    const div = document.createElement('div');
    div.className = 'thumb';
    const img = document.createElement('img');
    img.src = it.src;
    img.alt = it.name || `Image ${i+1}`;
    img.dataset.index = i;
    div.appendChild(img);
    galleryGrid.appendChild(div);
  });
}

galleryGrid.addEventListener('click', (e) => {
  const img = e.target.closest('img');
  if (!img) return;
  currentIndex = Number(img.dataset.index);
  openLightbox(currentIndex);
});

function openLightbox(index){
  const it = images[index];
  if (!it) return;
  lbImage.src = it.src;
  lightbox.classList.remove('hidden');
}

function closeLightbox(){
  lightbox.classList.add('hidden');
  lbImage.src = '';
}

function showPrev(){
  if (images.length === 0) return;
  currentIndex = (currentIndex - 1 + images.length) % images.length;
  openLightbox(currentIndex);
}

function showNext(){
  if (images.length === 0) return;
  currentIndex = (currentIndex + 1) % images.length;
  openLightbox(currentIndex);
}

lbClose.addEventListener('click', closeLightbox);
lbPrev.addEventListener('click', showPrev);
lbNext.addEventListener('click', showNext);
lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
window.addEventListener('keydown', (e) => {
  if (lightbox.classList.contains('hidden')) return;
  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowLeft') showPrev();
  if (e.key === 'ArrowRight') showNext();
});

// --- Default song detection & autoplay ---
const playDefaultBtn = document.getElementById('play-default');
const autoplayCheckbox = document.getElementById('autoplay-default');

let defaultAvailable = false;
// Attempt to detect song.mp3 by creating an audio element and listening for loadedmetadata
const probe = new Audio('song.mp3');
probe.addEventListener('loadedmetadata', () => {
  defaultAvailable = true;
  playDefaultBtn.style.display = 'inline-block';
});
probe.addEventListener('error', () => {
  // no default found; leave button hidden
});

playDefaultBtn.addEventListener('click', () => {
  if (!defaultAvailable) return;
  player.src = 'song.mp3';
  player.play().catch(()=>{});
});

// When switching tabs, autoplay default if requested and available
tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    const target = tab.dataset.target;
    if (target === 'music' && autoplayCheckbox.checked && defaultAvailable){
      player.src = 'song.mp3';
      player.play().catch(()=>{});
    }
  });
});