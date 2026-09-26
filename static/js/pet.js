(function () {
  const pet = document.getElementById('desk-pet');
  const body = document.getElementById('pet-body');
  const bubble = document.getElementById('pet-bubble');
  if (!pet) return;

  let bubbleTimer;
  function say(text, ms = 2000) {
    bubble.textContent = text;
    bubble.classList.add('show');
    clearTimeout(bubbleTimer);
    bubbleTimer = setTimeout(() => bubble.classList.remove('show'), ms);
  }

  // 点击互动（可选）
  pet.addEventListener('click', () => {
    say('喵~');
  });

  // 拖动（可选，不想要就删）
  let dragging = false, offsetX = 0, offsetY = 0;
  pet.addEventListener('mousedown', (e) => {
    dragging = true;
    const rect = pet.getBoundingClientRect();
    offsetX = e.clientX - rect.left;
    offsetY = e.clientY - rect.top;
    pet.style.animation = 'none';
  });
  window.addEventListener('mousemove', (e) => {
    if (!dragging) return;
    pet.style.left = (e.clientX - offsetX) + 'px';
    pet.style.top  = (e.clientY - offsetY) + 'px';
  });
  window.addEventListener('mouseup', () => {
    dragging = false;
    pet.style.animation = '';
  });
  // ==================== 问候系统 ====================
// 生日：10月15日
const BIRTHDAY = { month: 10, day: 15 };

// 节日表（月-日）
const FESTIVALS = {
  '1-1':   '新年快乐！🎉 新的一年也要加油哦',
  '2-14':  '情…情人节快乐 💕',
  '3-8':   '女神节快乐 🌷',
  '5-1':   '劳动节快乐，今天也要好好休息 🛋️',
  '6-1':   '儿童节快乐！我也要过节 🍭',
  '10-1':  '国庆快乐！🎆',
  '10-31': '不给糖就捣蛋 🎃',
  '12-24': '平安夜快乐 🎄',
  '12-25': '圣诞快乐！🎄🎁',
  '12-31': '今年最后一天啦，明年见 👋',
};

function getTodayKey() {
  const d = new Date();
  return (d.getMonth() + 1) + '-' + d.getDate();
}

function isBirthday() {
  const d = new Date();
  return d.getMonth() + 1 === BIRTHDAY.month && d.getDate() === BIRTHDAY.day;
}

// ---------- 生成问候 ----------
function getGreeting() {
  const h = new Date().getHours();
  const todayKey = getTodayKey();

  // 1) 生日最高优先级
  if (isBirthday()) {
    const lines = [
      '🎂 今天是我的生日！谢谢你陪我',
      '生日快乐！今天许了个愿 🎂',
      '🎉 生日啦！要不要一起切蛋糕',
    ];
    return {
      text: lines[Math.floor(Math.random() * lines.length)],
      mood: 'party',
    };
  }

  // 2) 节日
  if (FESTIVALS[todayKey]) {
    return { text: FESTIVALS[todayKey], mood: 'party' };
  }

  // 3) 深夜 / 凌晨
  if (h >= 23 || h < 2) {
    const lines = [
      '这么晚还不睡呀…',
      '深夜了哦，早点休息 🌙',
      '陪我熬夜吗？我会心疼的',
      '困了就睡吧，我帮你守着网站',
    ];
    return {
      text: lines[Math.floor(Math.random() * lines.length)],
      mood: 'sleepy',
    };
  }
  if (h >= 2 && h < 5) {
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

  // 4) 普通时段
  if (h >= 5 && h < 11)  return { text: '早安～今天也要加油哦 ☀️', mood: 'happy' };
  if (h >= 11 && h < 14) return { text: '中午啦，吃饭了吗？🍚', mood: 'happy' };
  if (h >= 14 && h < 18) return { text: '下午好呀，摸鱼中…', mood: 'normal' };
  return { text: '晚上好 🌆', mood: 'normal' };
}

// ---------- 应用问候 ----------
const moodEmoji = {
  sleepy: '😴',
  angry: '😾',
  happy: '😺',
  normal: '🐱',
  party: '😻',
};

const greeting = getGreeting();

setTimeout(() => {
  body.textContent = moodEmoji[greeting.mood] || '🐱';
  say(greeting.text, 4000);
}, 1000);
})();
