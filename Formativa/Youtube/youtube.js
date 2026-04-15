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
    title: "🧁지치고 힘들 땐 음료 ASMR로 힐링해요/주중의 여유로움/3시간 모음🍨3 Hours Vlog/Cafe Vlog/ASMR",
    channel: " Café Mood e Tasty coffee",
    channelInitial: "C",
    channelColor: "#ff4444",
    views: "147 mil visualizações",
    date: "há 3 meses",
    duration: "3:11:12",
    subscribers: "3,11 mil inscritos",
    likes: "8,2 mil",
    youtubeId: "uAQnpJ0mBwA",
    description: "▽ 🧁지치고 힘들 땐 음료 ASMR로 힐링해요/주중의 여유로움/3시간 모음🍨3 Hours Vlog/Cafe Vlog/ASMR ▽ 바쁜 일상 속에서 지치고 힘들 때, 잠시 멈춰서 마음을 쉬게 해주는 건 생각보다 가까이에 있습니다. 바로 잔잔한 음료 ASMR과 함께하는 작은 여유의 순간들이죠. 얼음이 컵 안에서 부딪히는 소리, 우유가 부드럽게 스며드는 소리, 과일이 믹서기에 갈리는 청량한 리듬까지—all of these create a calming soundscape that 힐링을 선물합니다. ▽ 이 3시간 모음 영상은 주중의 숨 가쁜 흐름 속에서 잠시 숨을 고를 수 있도록 구성했습니다. 카페의 아늑한 분위기, 정성스럽게 만들어지는 라떼와 스무디, 그리고 차분한 작업 소리들이 자연스럽게 이어지며 편안한 휴식을 제공합니다. 집중하고 싶을 때, 가벼운 배경음이 필요할 때, 혹은 단순히 마음을 다독이고 싶을 때 틀어두면 좋습니다. ▽ 지친 하루를 보내고 돌아온 저녁에도, 일하면서 조용히 흘려보내는 시간에도, 이 영상이 여러분의 마음을 조금이나마 가볍게 해주길 바랍니다. 음료 ASMR로 전해지는 포근한 위로와 함께 주중의 작은 여유를 느껴보세요. ✨▽ 더 맛있는 음료를 보려면 여기를 클릭하세요 :    • 🍓지치고 힘들 땐 음료 ASMR로 힐링해요/주중의 여유로움/3시간 모음🍊3 ...",
    comments: []
  },
  {
    id: 2,
    title: "Backrooms | Trailer Oficial Legendado",
    channel: "ingresso.com",
    channelInitial: "I",
    channelColor: "#ff6b35",
    views: "241.554 visualizações ",
    date: "1 dia",
    duration: "2:10",
    subscribers: "2,67 mi de inscritos",
    likes: "23 mil",
    youtubeId: "CY2BZv1IozU",
    description: "Backrooms | Trailer Oficial Legendado Assista ao novo trailer de #Backrooms, terror estrelado por #ChiwetelEjiofor - 28 de maio nos cinemas!  Somos o melhor destino para quem busca trailers assim que eles são lançados. Se você é fã de cinema como a gente, INSCREVA-SE e receba todas as novidades dos seus filmes favoritos!► Baixe nossos apps: Android: https://goo.gl/ZOknfm iOS: https://goo.gl/hFbnMY ► Compre ingressos para as melhores estreias: https://www.ingresso.com ► Assine UOL e Ganhe R$ 20 Por Mês Para Usar com cinema na Ingresso.com: https://bit.ly/3yX0hyd ► Siga a Ingresso no INSTAGRAM:   / ingressocom  ► Curta a Ingresso no FACEBOOK:   / ingressocom  ► Fique por dentro das novidades do universo do cinema no nosso canal no WHATSAPP: https://whatsapp.com/channel/0029Va58...",
    comments: []
  },
  {
    id: 3,
    title: "Funniest CATS of the Year",
    channel: "CaD Animails",
    channelInitial: "C",
    channelColor: "#ee0979",
    views: "4.342.169 visualizações",
    date: "3 de jan. de 2026",
    duration: "20:08",
    subscribers: "37,1 mil inscritos",
    likes: "28 mil",
    youtubeId: "s5DjLT841eU",
    description: "Funniest video compilation - Funniest CATS of the Year, funny cat videos, cat videos, funny cat, cat funny, cats funny videos, cat funny videos, funny cats videos, cat video, funnt cat videos 2025 
    #funnycats #cats #cat",
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