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
  // ---------- 时段问候 ----------
function getGreeting() {
  const h = new Date().getHours(); // 0~23

  if (h >= 23 || h < 2) {
    // 深夜 23:00 ~ 02:00
    const lines = [
      '这么晚还不睡呀…',
      '深夜了哦，早点休息 🌙',
      '陪我熬夜吗？我会心疼的',
      '困了就睡吧，我帮你守着网站',
    ];
    return {
      text: lines[Math.floor(Math.random() * lines.length)],
      mood: 'sleepy',   // 用于换表情
    };
  }

  if (h >= 2 && h < 5) {
    // 凌晨 02:00 ~ 05:00
    const lines = [
      '你还不睡？！',
      '现在是凌晨哦，真的该睡了…',
      '再熬夜我要生气了 😾',
    ];
    return {
      text: lines[Math.floor(Math.random() * lines.length)],
      mood: 'angry',
    };
  }

  if (h >= 5 && h < 11) {
    return { text: '早安～今天也要加油哦 ☀️', mood: 'happy' };
  }

  if (h >= 11 && h < 14) {
    return { text: '中午啦，吃饭了吗？🍚', mood: 'happy' };
  }

  if (h >= 14 && h < 18) {
    return { text: '下午好呀，摸鱼中…', mood: 'normal' };
  }

  // 18:00 ~ 23:00
  return { text: '晚上好 🌆', mood: 'normal' };
}

// ---------- 应用问候 ----------
const greeting = getGreeting();
setTimeout(() => say(greeting.text, 4000), 1000);

// 根据 mood 换表情（可选，看下面第四步）
if (greeting.mood === 'sleepy') {
  body.textContent = '😴';
} else if (greeting.mood === 'angry') {
  body.textContent = '😾';
} else if (greeting.mood === 'happy') {
  body.textContent = '😺';
}

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



