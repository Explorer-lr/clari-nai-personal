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
})();
