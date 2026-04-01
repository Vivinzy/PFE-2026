// ===== SIDEBAR MENU =====
const menuToggle = document.getElementById('menuToggle');
const closeSidebar = document.getElementById('closeSidebar');
const sidebar = document.getElementById('sidebar');
const sidebarOverlay = document.getElementById('sidebarOverlay');

function toggleMenu() {
  const isSmallScreen = window.innerWidth <= 800;
  if (isSmallScreen) {
    sidebar.classList.add('visible');
    sidebarOverlay.classList.add('visible');
  }
}

function closeSidebarMenu() {
  sidebar.classList.remove('visible');
  sidebarOverlay.classList.remove('visible');
}

menuToggle.addEventListener('click', toggleMenu);
closeSidebar.addEventListener('click', closeSidebarMenu);
sidebarOverlay.addEventListener('click', closeSidebarMenu);

// Fechar menu ao clicar em um item (mobile)
const sidebarItems = sidebar.querySelectorAll('.sidebar-item');
sidebarItems.forEach(item => {
  item.addEventListener('click', () => {
    if (window.innerWidth <= 800) {
      closeSidebarMenu();
    }
    // Remover active de todos
    sidebarItems.forEach(i => i.classList.remove('active'));
    // Adicionar active ao clicado
    item.classList.add('active');
  });
});

// ===== VIDEO DATABASE =====
const VIDEOS = [
  {
    id: 1,
    title: "Como a IA está mudando tudo",
    channel: "Meu Canal",
    channelInitial: "M",
    channelColor: "#ff4444",
    views: "—",
    date: "recente",
    duration: "—:--",
    subscribers: "—",
    likes: "—",
    youtubeId: "uAQnpJ0mBwA",
    description: "Vídeo do canal.",
    comments: []
  },
  {
    id: 2,
    title: "Vídeo 2",
    channel: "Meu Canal",
    channelInitial: "M",
    channelColor: "#ff6b35",
    views: "—",
    date: "recente",
    duration: "—:--",
    subscribers: "—",
    likes: "—",
    youtubeId: "CY2BZv1IozU",
    description: "Vídeo do canal.",
    comments: []
  },
  {
    id: 3,
    title: "Vídeo 3",
    channel: "Meu Canal",
    channelInitial: "M",
    channelColor: "#ee0979",
    views: "—",
    date: "recente",
    duration: "—:--",
    subscribers: "—",
    likes: "—",
    youtubeId: "s5DjLT841eU",
    description: "Vídeo do canal.",
    comments: []
  },
  {
    id: 4,
    title: "Vídeo 4",
    channel: "Meu Canal",
    channelInitial: "M",
    channelColor: "#4776E6",
    views: "—",
    date: "recente",
    duration: "—:--",
    subscribers: "—",
    likes: "—",
    youtubeId: "DQHMhEG29KA",
    description: "Vídeo do canal.",
    comments: []
  }
];

// Fetch YouTube titles via oEmbed
async function fetchYouTubeMeta(video) {
  try {
    const res = await fetch(`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${video.youtubeId}&format=json`);
    if (res.ok) {
      const data = await res.json();
      video.title = data.title || video.title;
      video.channel = data.author_name || video.channel;
      video.channelInitial = (data.author_name || video.channel)[0].toUpperCase();
    }
  } catch(e) {}
}

let likedVideos = new Set();
let subscribedChannels = new Set();

const homePage = document.getElementById('homePage');
const watchPage = document.getElementById('watchPage');
const videoGrid = document.getElementById('videoGrid');

function renderGrid() {
  videoGrid.innerHTML = '';
  VIDEOS.forEach((v, i) => {
    const card = document.createElement('div');
    card.className = 'video-card';
    card.style.animationDelay = `${i * 0.08}s`;
    card.innerHTML = `
      <div class="thumb-wrap">
        <img src="https://img.youtube.com/vi/${v.youtubeId}/mqdefault.jpg" alt="${v.title}" loading="lazy">
        <span class="duration-badge">${v.duration}</span>
        <div class="play-overlay"><div class="play-icon">▶</div></div>
      </div>
      <div class="card-body">
        <div class="card-avatar" style="background:${v.channelColor}">${v.channelInitial}</div>
        <div class="card-info">
          <p class="card-title">${v.title}</p>
          <p class="card-channel">${v.channel}</p>
          <p class="card-meta">${v.views} · ${v.date}</p>
        </div>
      </div>
    `;
    card.addEventListener('click', () => openWatch(v));
    videoGrid.appendChild(card);
  });
}

function openWatch(v) {
  homePage.classList.add('hidden');
  watchPage.classList.remove('hidden');
  window.scrollTo(0, 0);

  document.getElementById('playerIframe').src = `https://www.youtube.com/embed/${v.youtubeId}?autoplay=1&rel=0`;
  document.getElementById('watchTitle').textContent = v.title;
  document.getElementById('watchViews').textContent = v.views === '—' ? '' : `${v.views} visualizações`;
  document.getElementById('watchDate').textContent = v.date;
  document.getElementById('watchChannel').textContent = v.channel;
  document.getElementById('watchSubs').textContent = v.subscribers === '—' ? '' : `${v.subscribers} inscritos`;
  document.getElementById('watchAvatar').textContent = v.channelInitial;
  document.getElementById('watchAvatar').style.background = v.channelColor;
  document.getElementById('watchDesc').textContent = v.description;
  document.getElementById('likeCount').textContent = v.likes;

  const likeBtn = document.getElementById('likeBtn');
  likeBtn.classList.toggle('liked', likedVideos.has(v.id));
  likeBtn.onclick = () => {
    likedVideos.has(v.id) ? likedVideos.delete(v.id) : likedVideos.add(v.id);
    likeBtn.classList.toggle('liked', likedVideos.has(v.id));
  };

  const subBtn = document.getElementById('subscribeBtn');
  const updateSub = () => {
    const s = subscribedChannels.has(v.channel);
    subBtn.textContent = s ? '✓ Inscrito' : 'Inscrever-se';
    subBtn.classList.toggle('subscribed', s);
  };
  updateSub();
  subBtn.onclick = () => {
    subscribedChannels.has(v.channel) ? subscribedChannels.delete(v.channel) : subscribedChannels.add(v.channel);
    updateSub();
  };

  // Comments
  const list = document.getElementById('commentsList');
  list.innerHTML = '';
  v.comments.forEach(c => list.appendChild(makeComment(c)));

  const input = document.getElementById('commentInput');
  input.value = '';
  const sendBtn = document.getElementById('sendComment');
  const newSend = sendBtn.cloneNode(true);
  sendBtn.parentNode.replaceChild(newSend, sendBtn);
  newSend.addEventListener('click', () => {
    const text = input.value.trim();
    if (!text) return;
    list.insertBefore(makeComment({ author: 'Você', text, time: 'agora mesmo', likes: 0 }), list.firstChild);
    input.value = '';
  });

  // Recommendations
  const recContainer = document.getElementById('recommendations');
  recContainer.innerHTML = '';
  VIDEOS.filter(x => x.id !== v.id).forEach(x => {
    const card = document.createElement('div');
    card.className = 'rec-card';
    card.innerHTML = `
      <div class="rec-thumb">
        <img src="https://img.youtube.com/vi/${x.youtubeId}/mqdefault.jpg" alt="${x.title}" loading="lazy">
        <span class="duration-badge">${x.duration}</span>
      </div>
      <div class="rec-info">
        <p class="rec-title-text">${x.title}</p>
        <p class="rec-channel">${x.channel}</p>
        <p class="rec-meta">${x.views} · ${x.date}</p>
      </div>
    `;
    card.addEventListener('click', () => openWatch(x));
    recContainer.appendChild(card);
  });
}

function makeComment(c) {
  const el = document.createElement('div');
  el.className = 'comment';
  el.innerHTML = `
    <div class="avatar small">${c.author[0]}</div>
    <div class="comment-body">
      <p class="comment-author">${c.author}<span>${c.time}</span></p>
      <p class="comment-text">${c.text}</p>
      <div class="comment-actions">
        <button class="comment-action-btn">👍 ${c.likes}</button>
        <button class="comment-action-btn">👎</button>
        <button class="comment-action-btn">Responder</button>
      </div>
    </div>
  `;
  return el;
}

function showHome() {
  watchPage.classList.add('hidden');
  homePage.classList.remove('hidden');
  document.getElementById('playerIframe').src = '';
}

document.getElementById('backBtn').addEventListener('click', showHome);
document.getElementById('logoBtn').addEventListener('click', showHome);

// Init: fetch titles then render
async function init() {
  await Promise.all(VIDEOS.map(fetchYouTubeMeta));
  renderGrid();
}
init();