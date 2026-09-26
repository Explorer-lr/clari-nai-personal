(function () {
  const pet = document.getElementById('desk-pet');
  const body = document.getElementById('pet-body');
  const bubble = document.getElementById('pet-bubble');
  if (!pet) return;

  let x = window.innerWidth - 120;
  let y = window.innerHeight - 140;
  pet.style.transform = `translate(${x}px, ${y}px)`;

  let bubbleTimer;
  function say(text, ms = 2000) {
    bubble.textContent = text;
    bubble.classList.add('show');
    clearTimeout(bubbleTimer);
    bubbleTimer = setTimeout(() => bubble.classList.remove('show'), ms);
  }

  let dragging = false, offsetX = 0, offsetY = 0;
  pet.addEventListener('mousedown', (e) => {
    dragging = true;
    offsetX = e.clientX - x;
    offsetY = e.clientY - y;
    say('别拽我啦～');
  });
  window.addEventListener('mousemove', (e) => {
    if (!dragging) return;
    x = Math.min(Math.max(0, e.clientX - offsetX), window.innerWidth - 80);
    y = Math.min(Math.max(0, e.clientY - offsetY), window.innerHeight - 80);
    pet.style.transform = `translate(${x}px, ${y}px)`;
  });
  window.addEventListener('mouseup', () => (dragging = false));

  const clickLines = ['喵~', '在呢在呢', '今天也要加油哦', '别摸头，会秃的', '嘿嘿'];
  pet.addEventListener('click', () => {
    say(clickLines[Math.floor(Math.random() * clickLines.length)]);
    body.style.transform = 'scale(1.2)';
    setTimeout(() => (body.style.transform = ''), 150);
  });

  function wander() {
    if (dragging) return;
    const nx = Math.random() * (window.innerWidth - 80);
    const ny = Math.random() * (window.innerHeight - 80);
    pet.style.transition = 'transform 3s ease-in-out';
    x = nx; y = ny;
    pet.style.transform = `translate(${x}px, ${y}px)`;
    setTimeout(() => (pet.style.transition = ''), 3000);
  }
  setInterval(wander, 8000);

  setTimeout(() => say('你好呀，我是站长的小宠物 🐾', 3000), 1000);

  pet.addEventListener('touchstart', (e) => {
    const t = e.touches[0];
    dragging = true;
    offsetX = t.clientX - x;
    offsetY = t.clientY - y;
  }, { passive: true });
  pet.addEventListener('touchmove', (e) => {
    if (!dragging) return;
    const t = e.touches[0];
    x = t.clientX - offsetX;
    y = t.clientY - offsetY;
    pet.style.transform = `translate(${x}px, ${y}px)`;
  }, { passive: true });
  pet.addEventListener('touchend', () => (dragging = false));
})();
(function () {
  const pet = document.getElementById('desk-pet');
  const body = document.getElementById('pet-body');
  const bubble = document.getElementById('pet-bubble');
  if (!pet) return;

  // ---------- 存档 ----------
  const KEY = 'desk-pet-save';
  const defaultSave = {
    affection: 20,
    food: 3,
    toys: 1,
    lastVisit: Date.now(),
    lastArticleCount: null,
  };
  let save = Object.assign({}, defaultSave, JSON.parse(localStorage.getItem(KEY) || '{}'));

  function persist() {
    localStorage.setItem(KEY, JSON.stringify(save));
  }

  // ---------- UI 更新 ----------
  function render() {
    document.getElementById('num-affection').textContent = save.affection;
    document.getElementById('num-food').textContent = save.food;
    document.getElementById('num-toys').textContent = save.toys;
    document.getElementById('bar-affection').style.width = save.affection + '%';
    document.getElementById('btn-feed').disabled = save.food <= 0;
    document.getElementById('btn-play').disabled = save.toys <= 0;
  }

  // ---------- 气泡 ----------
  let bubbleTimer;
  function say(text, ms = 2000) {
    bubble.textContent = text;
    bubble.classList.add('show');
    clearTimeout(bubbleTimer);
    bubbleTimer = setTimeout(() => bubble.classList.remove('show'), ms);
  }

  // ---------- 好感变化 ----------
  function addAffection(n) {
    save.affection = Math.max(0, Math.min(100, save.affection + n));
    persist();
    render();
  }

  // ---------- 喂食 ----------
  document.getElementById('btn-feed').addEventListener('click', (e) => {
    e.stopPropagation();
    if (save.food <= 0) return say('没有猫粮啦…');
    save.food--;
    addAffection(5);
    say('好好吃！+5 好感 🍖');
    body.style.transform = 'scale(1.2)';
    setTimeout(() => (body.style.transform = ''), 150);
  });

  // ---------- 玩耍 ----------
  document.getElementById('btn-play').addEventListener('click', (e) => {
    e.stopPropagation();
    if (save.toys <= 0) return say('没有玩具…');
    save.toys--;
    addAffection(8);
    say('好开心！+8 好感 🧸');
    // 玩完会累，随机跑到别处
    wander();
  });

  // ---------- 文章更新奖励 ----------
  // 由 Hugo 注入当前文章数（见下面第七步）
  const currentArticleCount = window.__ARTICLE_COUNT__ || 0;
  if (save.lastArticleCount === null) {
    save.lastArticleCount = currentArticleCount;
  } else if (currentArticleCount > save.lastArticleCount) {
    const diff = currentArticleCount - save.lastArticleCount;
    save.food += diff * 2;      // 每篇新文章 +2 猫粮
    save.toys += diff;          // 每篇新文章 +1 玩具
    save.lastArticleCount = currentArticleCount;
    say(`主人更新了 ${diff} 篇文章！奖励 ${diff*2}🍖 ${diff}🧸`, 4000);
  }
  persist();

  // ---------- 每日签到 ----------
  const oneDay = 24 * 60 * 60 * 1000;
  if (Date.now() - save.lastVisit > oneDay) {
    save.food += 1;
    addAffection(2);
    say('欢迎回来～送你 1 份猫粮 🍖');
  }
  save.lastVisit = Date.now();
  persist();

  // ---------- 原有的拖动 / 点击 / 走动逻辑 ----------
  // ...（把之前的代码粘回这里，注意别覆盖上面的函数）

  render();
})();
