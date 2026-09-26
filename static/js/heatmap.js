(function () {
  const container = document.getElementById('heatmap');
  if (!container) return;

  const data = window.__HEATMAP_DATA__ || {};
  const today = window.__HEATMAP_TODAY__
    ? new Date(window.__HEATMAP_TODAY__)
    : new Date();

  // ---------- 日期工具 ----------
  function fmt(d) {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${dd}`;
  }

  // ---------- 计算起始日期 ----------
  // 结束于"今天所在的周六"，开始于"53周前的周日"
  const end = new Date(today);
  // 对齐到本周六（GitHub 一排是周日到周六）
  const dayOfWeek = end.getDay();  // 0=周日
  end.setDate(end.getDate() + (6 - dayOfWeek));

  const start = new Date(end);
  start.setDate(start.getDate() - 7 * 52 + 1); // 52 周多一格
  // 对齐到周日
  start.setDate(start.getDate() - start.getDay());

  // ---------- 渲染格子 ----------
  const frag = document.createDocumentFragment();
  const cur = new Date(start);
  const totalDays = 371; // 53 周 * 7

  for (let i = 0; i < totalDays; i++) {
    const key = fmt(cur);
    const count = data[key] || 0;
    const level = countToLevel(count);

    const cell = document.createElement('div');
    cell.className = 'cell lv' + level;
    cell.dataset.date = key;
    cell.dataset.count = count;
    cell.title = `${key}：${count} 篇`;

    frag.appendChild(cell);
    cur.setDate(cur.getDate() + 1);
  }
  container.appendChild(frag);

  // ---------- 统计 ----------
  const total = Object.values(data).reduce((a, b) => a + b, 0);
  const days = Object.keys(data).length;

  document.getElementById('hm-total').textContent = total;
  document.getElementById('hm-days').textContent = days;
  document.getElementById('hm-streak').textContent = calcStreak(data, today, false);
  document.getElementById('hm-max-streak').textContent = calcStreak(data, today, true);

  // ---------- 数量 → 等级 ----------
  function countToLevel(n) {
    if (n === 0) return 0;
    if (n === 1) return 1;
    if (n === 2) return 2;
    if (n <= 4) return 3;
    return 4;
  }

  // ---------- 连续天数 ----------
  function calcStreak(data, today, isMax) {
    const dates = Object.keys(data).sort();
    if (!dates.length) return 0;

    if (isMax) {
      let max = 1, cur = 1;
      for (let i = 1; i < dates.length; i++) {
        const prev = new Date(dates[i - 1]);
        const next = new Date(dates[i]);
        const diff = (next - prev) / 86400000;
        if (diff === 1) cur++;
        else cur = 1;
        max = Math.max(max, cur);
      }
      return max;
    }

    // 当前连续：从今天往前推
    let streak = 0;
    const d = new Date(today);
    while (true) {
      const k = fmt(d);
      if (data[k]) {
        streak++;
        d.setDate(d.getDate() - 1);
      } else {
        // 如果今天没写，允许从昨天开始算
        if (streak === 0) {
          d.setDate(d.getDate() - 1);
          const k2 = fmt(d);
          if (data[k2]) {
            d.setDate(d.getDate() - 1);
            continue;
          }
        }
        break;
      }
    }
    return streak;
  }
})();
