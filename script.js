// ===== Theme Toggle =====
(function() {
  const saved = localStorage.getItem('theme') || 'light';
  document.documentElement.setAttribute('data-theme', saved);
})();

function toggleTheme() {
  const el = document.documentElement;
  const current = el.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  el.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
}

// ===== Background Pattern =====
(function() {
  const pattern = document.createElement('div');
  pattern.className = 'bg-pattern';
  document.body.prepend(pattern);
})();

// ===== Scroll Progress Bar =====
(function() {
  const bar = document.createElement('div');
  bar.className = 'scroll-progress';
  document.body.prepend(bar);
  window.addEventListener('scroll', () => {
    const h = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width = h > 0 ? Math.min((window.scrollY / h) * 100, 100) + '%' : '0%';
  }, { passive: true });
})();

// ===== Navbar scroll behavior =====
(function() {
  let lastScroll = 0;
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;
  window.addEventListener('scroll', () => {
    const current = window.scrollY;
    navbar.classList.toggle('scrolled', current > 50);
    if (current > 200) {
      navbar.classList.toggle('hidden-nav', current > lastScroll && current > 300);
    } else {
      navbar.classList.remove('hidden-nav');
    }
    lastScroll = current;
  }, { passive: true });
})();

// ===== 3D Card Tilt =====
(function() {
  document.querySelectorAll('.tool-card').forEach(card => {
    card.classList.add('tilt-enabled');
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const cx = rect.width / 2, cy = rect.height / 2;
      const rotateX = ((y - cy) / cy) * -8;
      const rotateY = ((x - cx) / cx) * 8;
      const angle = Math.atan2(y - cy, x - cx) * (180 / Math.PI);
      card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-2px)`;
      card.style.setProperty('--tilt-angle', angle + 'deg');
      card.style.boxShadow = '0 20px 40px rgba(0,0,0,0.15)';
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(800px) rotateX(0) rotateY(0) translateY(0)';
      card.style.boxShadow = '';
      card.style.setProperty('--tilt-angle', '0deg');
    });
  });
})();

// ===== Button Ripple =====
document.addEventListener('click', e => {
  const btn = e.target.closest('.btn');
  if (!btn) return;
  const ripple = document.createElement('span');
  ripple.className = 'ripple';
  const rect = btn.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height);
  ripple.style.width = ripple.style.height = size + 'px';
  ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
  ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
  btn.appendChild(ripple);
  ripple.addEventListener('animationend', () => ripple.remove());
});

// ===== Mouse Spotlight =====
(function() {
  const spotlight = document.createElement('div');
  spotlight.className = 'spotlight';
  document.body.appendChild(spotlight);
  let active = true, mouseX = 0, mouseY = 0;
  document.addEventListener('mousemove', e => { mouseX = e.clientX; mouseY = e.clientY; }, { passive: true });
  document.addEventListener('mouseleave', () => { active = false; spotlight.style.opacity = '0'; });
  document.addEventListener('mouseenter', () => { active = true; spotlight.style.opacity = '1'; });

  function animate() {
    if (active) {
      spotlight.style.left = mouseX + 'px';
      spotlight.style.top = mouseY + 'px';
    }
    requestAnimationFrame(animate);
  }
  animate();
})();

// ===== Confetti on copy/action =====
function burstConfetti(x, y, count) {
  count = count || 12;
  const colors = ['#4263eb','#a855f7','#ec4899','#f59e0b','#10b981','#06b6d4'];
  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    p.className = 'confetti-particle';
    p.style.left = x + 'px';
    p.style.top = y + 'px';
    p.style.background = colors[Math.floor(Math.random() * colors.length)];
    p.style.width = (4 + Math.random() * 8) + 'px';
    p.style.height = (4 + Math.random() * 8) + 'px';
    p.style.setProperty('--tx', (Math.random() - 0.5) * 100 + 'px');
    p.style.animation = `confetti-fall ${0.5 + Math.random() * 0.8}s ease-out forwards`;
    p.style.left = (x + (Math.random() - 0.5) * 60) + 'px';
    document.body.appendChild(p);
    p.addEventListener('animationend', () => p.remove());
  }
}

// ===== Tool Search =====
function filterTools(query) {
  const q = query.toLowerCase().trim();
  document.querySelectorAll('.tool-card').forEach(card => {
    const name = (card.dataset.name || '').toLowerCase();
    const desc = (card.dataset.desc || '').toLowerCase();
    card.classList.toggle('hidden', q && !name.includes(q) && !desc.includes(q));
  });
  document.querySelectorAll('.category-group').forEach(group => {
    const visible = group.querySelectorAll('.tool-card:not(.hidden)').length > 0;
    group.classList.toggle('hidden', !visible);
  });
}

// ===== Toast =====
function showToast(msg) {
  let toast = document.querySelector('.toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.classList.add('show');
  clearTimeout(toast._tid);
  toast._tid = setTimeout(() => toast.classList.remove('show'), 2000);
}

// ===== Copy with Confetti =====
async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
    showToast('已复制到剪贴板 ✓');
  } catch {
    showToast('复制失败，请手动选择');
  }
}

// ===== Scroll Animations (Bidirectional - enter + exit, wide margin) =====
(function() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        entry.target.classList.remove('exiting');
      } else {
        entry.target.classList.remove('visible');
        entry.target.classList.add('exiting');
      }
    });
  }, { threshold: 0.02, rootMargin: '150px 0px 150px 0px' });

  document.querySelectorAll('.animate-in').forEach(el => observer.observe(el));
})();

// ===== Animated Grid Background =====
(function() {
  const canvas = document.createElement('canvas');
  canvas.className = 'grid-canvas';
  document.body.prepend(canvas);
  const ctx = canvas.getContext('2d');

  let gridOn = localStorage.getItem('gridOn') !== 'false'; // default ON for new visitors
  let mouseX = -1000, mouseY = -1000;
  let targetMouseX = -1000, targetMouseY = -1000;
  let waves = [];
  let time = 0;

  const SPACING = 50;
  const MAX_RADIUS = 120;

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  // Track mouse
  document.addEventListener('mousemove', e => {
    targetMouseX = e.clientX;
    targetMouseY = e.clientY;
  });
  document.addEventListener('mouseleave', () => {
    targetMouseX = -1000;
    targetMouseY = -1000;
  });

  function getThemeColors() {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    return {
      line: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)',
      point: isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.08)',
      wave1: isDark ? 'rgba(92,124,250,0.15)' : 'rgba(66,99,235,0.12)',
      wave2: isDark ? 'rgba(168,85,247,0.12)' : 'rgba(168,85,247,0.1)',
      wave3: isDark ? 'rgba(236,72,153,0.1)' : 'rgba(236,72,153,0.08)',
    };
  }

  function animate() {
    resize();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (!gridOn) {
      canvas.classList.remove('active');
      requestAnimationFrame(animate);
      return;
    }
    canvas.classList.add('active');
    document.body.classList.add('grid-active');
    time += 0.016;

    // Smooth mouse
    mouseX += (targetMouseX - mouseX) * 0.12;
    mouseY += (targetMouseY - mouseY) * 0.12;

    const cols = Math.floor(canvas.width / SPACING) + 2;
    const rows = Math.floor(canvas.height / SPACING) + 2;
    const offsetX = (time * 20) % SPACING; // slowly scroll for animation
    const offsetY = (time * 20) % SPACING;

    const c = getThemeColors();

    // Draw grid lines
    ctx.strokeStyle = c.line;
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let i = -1; i <= cols; i++) {
      const x = i * SPACING;
      ctx.moveTo(x, -SPACING);
      ctx.lineTo(x, canvas.height + SPACING);
    }
    for (let j = -1; j <= rows; j++) {
      const y = j * SPACING;
      ctx.moveTo(-SPACING, y);
      ctx.lineTo(canvas.width + SPACING, y);
    }
    ctx.stroke();

    // Draw intersection points with mouse interaction
    for (let i = 0; i <= cols; i++) {
      for (let j = 0; j <= rows; j++) {
        const px = i * SPACING;
        const py = j * SPACING;
        const dx = mouseX - px;
        const dy = mouseY - py;
        const dist = Math.sqrt(dx * dx + dy * dy);

        let size = 2;
        let alpha = 1;

        if (dist < MAX_RADIUS) {
          const factor = 1 - dist / MAX_RADIUS;
          const bulge = factor * factor * 8; // quadratic falloff
          size = 2 + bulge;
          alpha = 1 + factor * 2;

          // Draw wave glow
          const gradient = ctx.createRadialGradient(px, py, 0, px, py, size + 8);
          gradient.addColorStop(0, c.wave1);
          gradient.addColorStop(0.5, c.wave2);
          gradient.addColorStop(1, 'transparent');
          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.arc(px, py, size + 10, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.fillStyle = c.point;
        ctx.globalAlpha = Math.min(alpha, 2.5);
        ctx.beginPath();
        ctx.arc(px, py, size, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
      }
    }

    // Ripple waves from click points
    waves = waves.filter(w => w.life < 1);
    waves.forEach(w => {
      w.radius += 2;
      w.life += 0.015;
      const alpha = 1 - w.life;
      ctx.strokeStyle = w.color.replace('0.3', String(0.3 * alpha));
      ctx.lineWidth = 2 * (1 - w.life);
      ctx.beginPath();
      ctx.arc(w.x, w.y, w.radius, 0, Math.PI * 2);
      ctx.stroke();
    });

    requestAnimationFrame(animate);
  }

  // Click to create ripple
  document.addEventListener('click', e => {
    if (!gridOn) return;
    waves.push({
      x: e.clientX, y: e.clientY, radius: 0, life: 0,
      color: Math.random() > 0.5 ? 'rgba(66,99,235,0.3)' : 'rgba(168,85,247,0.3)'
    });
  });

  // Toggle function
  window.toggleGrid = function() {
    gridOn = !gridOn;
    localStorage.setItem('gridOn', gridOn);
    const btn = document.getElementById('gridToggleBtn');
    if (btn) btn.classList.toggle('active', gridOn);
    if (!gridOn) {
      canvas.classList.remove('active');
      document.body.classList.remove('grid-active');
    }
  };

  // Initialize toggle button
  document.addEventListener('DOMContentLoaded', () => {
    const btn = document.getElementById('gridToggleBtn');
    if (btn) btn.classList.toggle('active', gridOn);
  });

  // Start animation
  animate();
})();

// ===== Sidebar Navigation =====
(function() {
  // Build sidebar HTML
  const cats = {};
  TOOL_REGISTRY.forEach(t => {
    if (!cats[t.cat]) cats[t.cat] = [];
    cats[t.cat].push(t);
  });

  let sidebarHTML = '<div class="sidebar-overlay" id="sidebarOverlay"></div>';
  sidebarHTML += '<button class="sidebar-toggle" id="sidebarToggle" title="展开目录">☰</button>';
  sidebarHTML += '<nav class="sidebar" id="sidebar"><div class="sidebar-inner">';
  sidebarHTML += '<div style="padding:8px 20px 12px;font-weight:700;font-size:0.95rem">📂 工具目录</div>';
  for (const [cat, tools] of Object.entries(cats)) {
    sidebarHTML += `<div class="sidebar-cat">${cat}</div>`;
    tools.forEach(t => {
      sidebarHTML += `<a href="${t.url}" class="sidebar-link" data-url="${t.url}">
        <span class="s-icon">${t.icon}</span> ${t.name}
      </a>`;
    });
  }
  sidebarHTML += '</div></nav>';

  const wrapper = document.createElement('div');
  wrapper.innerHTML = sidebarHTML;
  while (wrapper.firstChild) document.body.appendChild(wrapper.firstChild);

  const sidebar = document.getElementById('sidebar');
  const toggle = document.getElementById('sidebarToggle');
  const overlay = document.getElementById('sidebarOverlay');
  let open = localStorage.getItem('sidebarOpen') !== 'false'; // default open for new visitors

  function updateState() {
    sidebar.classList.toggle('open', open);
    toggle.classList.toggle('shifted', open);
    toggle.textContent = open ? '✕' : '☰';
    overlay.classList.toggle('active', open && window.innerWidth < 1024);
    localStorage.setItem('sidebarOpen', open);
  }

  toggle.addEventListener('click', () => { open = !open; updateState(); });

  // Global toggle function (callable from HTML onclick)
  window.toggleSidebar = function() {
    open = !open;
    updateState();
  };
  overlay.addEventListener('click', () => { open = false; updateState(); });

  // Highlight current page in sidebar
  const currentPath = window.location.pathname;
  document.querySelectorAll('.sidebar-link').forEach(link => {
    if (link.dataset.url === currentPath) link.style.background = 'var(--primary-light)';
  });

  // Close sidebar with Escape
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && open) { open = false; updateState(); }
  });

  updateState();
})();

// ===== Inject Navbar Controls (grid toggle + hint) =====
document.addEventListener('DOMContentLoaded', () => {
  const navInner = document.querySelector('.navbar-inner');
  if (!navInner) return;

  // Grid toggle
  const gridBtn = document.createElement('button');
  gridBtn.id = 'gridToggleBtn';
  gridBtn.className = 'grid-toggle';
  gridBtn.title = '切换背景网格';
  gridBtn.textContent = '▦';
  gridBtn.onclick = toggleGrid;

  // Sidebar hint
  const sidebarHint = document.createElement('span');
  sidebarHint.style.cssText = 'font-size:0.75rem;color:var(--text-secondary);margin-left:auto;margin-right:6px';
  sidebarHint.textContent = '☰ 目录';

  // Wrap controls
  const controls = document.createElement('div');
  controls.className = 'nav-controls';
  controls.appendChild(sidebarHint);
  controls.appendChild(gridBtn);

  // Insert before theme toggle
  const themeBtn = navInner.querySelector('.theme-toggle');
  if (themeBtn) navInner.insertBefore(controls, themeBtn);
  else navInner.appendChild(controls);
});

// ===== Tool Registry (for command palette) =====
const TOOL_REGISTRY = [
  {name:'JSON 格式化',icon:'📋',cat:'编码转换',url:'/tools/json-formatter',kw:'json format formatter 格式化 美化'},
  {name:'Base64 编解码',icon:'🔐',cat:'编码转换',url:'/tools/base64',kw:'base64 encode decode 编码 解码'},
  {name:'URL 编解码',icon:'🔗',cat:'编码转换',url:'/tools/url-encode',kw:'url encode decode 网址 编码'},
  {name:'Unicode 转换',icon:'🌐',cat:'编码转换',url:'/tools/unicode',kw:'unicode 中文 转换'},
  {name:'HTML 实体编解码',icon:'〽️',cat:'编码转换',url:'/tools/html-entity',kw:'html entity 实体 编码'},
  {name:'Markdown 预览',icon:'📄',cat:'文本处理',url:'/tools/markdown-preview',kw:'markdown md preview 预览'},
  {name:'正则表达式测试',icon:'🔍',cat:'文本处理',url:'/tools/regex-tester',kw:'regex regexp 正则 表达式 测试'},
  {name:'文本差异对比',icon:'🔀',cat:'文本处理',url:'/tools/text-diff',kw:'diff compare 差异 对比'},
  {name:'字数统计',icon:'🔢',cat:'文本处理',url:'/tools/word-count',kw:'count 字数 字符 统计'},
  {name:'Lorem Ipsum 生成器',icon:'📝',cat:'文本处理',url:'/tools/lorem-ipsum',kw:'lorem ipsum 占位 假文 生成'},
  {name:'CSV ⇄ JSON',icon:'📊',cat:'数据转换',url:'/tools/csv-json',kw:'csv json convert 转换'},
  {name:'JWT 解码器',icon:'🎫',cat:'数据转换',url:'/tools/jwt-decoder',kw:'jwt token decode 解码'},
  {name:'URL 解析器',icon:'🔗',cat:'数据转换',url:'/tools/url-parser',kw:'url parse 解析 网址 拆分'},
  {name:'Cron 表达式解析',icon:'⏰',cat:'数据转换',url:'/tools/cron-parser',kw:'cron 定时 表达式 parse'},
  {name:'二维码生成器',icon:'📱',cat:'生成器',url:'/tools/qrcode-gen',kw:'qr qrcode 二维码 生成'},
  {name:'UUID 生成器',icon:'🆔',cat:'生成器',url:'/tools/uuid-gen',kw:'uuid guid 生成 唯一'},
  {name:'随机密码生成',icon:'🔑',cat:'生成器',url:'/tools/password-gen',kw:'password 密码 随机 生成'},
  {name:'调色板生成器',icon:'🎨',cat:'生成器',url:'/tools/palette-gen',kw:'palette color 调色板 配色 生成'},
  {name:'图片压缩',icon:'🗜️',cat:'图片处理',url:'/tools/image-compress',kw:'image compress 图片 压缩'},
  {name:'图片转 Base64',icon:'🖼️',cat:'图片处理',url:'/tools/image-to-base64',kw:'image base64 图片 转换'},
  {name:'取色器',icon:'🎨',cat:'图片处理',url:'/tools/color-picker',kw:'color picker 取色器 颜色'},
  {name:'时间戳转换',icon:'🕐',cat:'时间数字',url:'/tools/timestamp',kw:'timestamp unix 时间戳 转换'},
  {name:'进制转换',icon:'🔢',cat:'时间数字',url:'/tools/number-base',kw:'bin hex dec 进制 转换'},
  {name:'单位换算',icon:'📐',cat:'时间数字',url:'/tools/unit-converter',kw:'unit 单位 换算 转换'},
  {name:'PDF 合并',icon:'📑',cat:'文件安全',url:'/tools/pdf-merge',kw:'pdf merge 合并 拼接'},
  {name:'文件哈希计算',icon:'🔒',cat:'文件安全',url:'/tools/file-hash',kw:'hash sha256 md5 文件 哈希'},
  {name:'表情包生成器',icon:'🤣',cat:'趣味工具',url:'/tools/meme-gen',kw:'meme 表情包 搞笑 图片 文字'},
  {name:'ASCII 艺术画',icon:'🎭',cat:'趣味工具',url:'/tools/ascii-art',kw:'ascii 字符画 图片 转换 艺术'},
  {name:'代码格式化',icon:'💻',cat:'文本处理',url:'/tools/code-formatter',kw:'code beautify format html css js sql 代码 格式化 美化'},
  {name:'SVG 编辑器',icon:'✏️',cat:'图片处理',url:'/tools/svg-editor',kw:'svg editor 矢量 编辑 预览'},
  {name:'番茄钟',icon:'🍅',cat:'趣味工具',url:'/tools/pomodoro',kw:'pomodoro timer 番茄 计时 专注'},
  {name:'视频转 GIF',icon:'🎬',cat:'文件安全',url:'/tools/video-to-gif',kw:'video gif mp4 视频 动图 转换'},
];

// ===== Command Palette (Ctrl+K) =====
(function() {
  if (document.querySelector('.palette-overlay')) return;
  const overlay = document.createElement('div');
  overlay.className = 'palette-overlay';
  overlay.innerHTML = `
    <div class="palette-box">
      <input class="palette-input" placeholder="搜索工具... (输入名称或关键词)" autofocus>
      <div class="palette-results"></div>
      <div class="palette-hint">
        <span><kbd>↑↓</kbd> 导航</span><span><kbd>Enter</kbd> 打开</span><span><kbd>Esc</kbd> 关闭</span>
      </div>
    </div>`;
  document.body.appendChild(overlay);

  const input = overlay.querySelector('.palette-input');
  const results = overlay.querySelector('.palette-results');
  let activeIdx = -1;

  function open() {
    overlay.classList.add('active');
    input.value = '';
    input.focus();
    activeIdx = -1;
    filter('');
  }

  function close() {
    overlay.classList.remove('active');
    activeIdx = -1;
  }

  function filter(q) {
    const lq = q.toLowerCase().trim();
    let filtered;
    if (!lq) {
      // Show recent + default
      const recent = getRecentTools();
      const recentSet = new Set(recent);
      filtered = [...recent.map(r => TOOL_REGISTRY.find(t => t.url === r)).filter(Boolean)];
      // Fill remaining
      TOOL_REGISTRY.forEach(t => { if (!recentSet.has(t.url) && filtered.length < 12) filtered.push(t); });
    } else {
      filtered = TOOL_REGISTRY.filter(t =>
        t.name.toLowerCase().includes(lq) || t.kw.includes(lq) || t.cat.includes(lq)
      );
    }
    if (filtered.length === 0) {
      results.innerHTML = '<div class="palette-empty">🔍 未找到匹配工具</div>';
    } else {
      activeIdx = Math.min(activeIdx, filtered.length - 1);
      results.innerHTML = filtered.map((t,i) =>
        `<button class="palette-item${i===activeIdx?' active':''}" data-url="${t.url}" data-idx="${i}">
          <span class="item-icon">${t.icon}</span>
          <span class="item-name">${t.name}</span>
          <span class="item-cat">${t.cat}</span>
        </button>`
      ).join('');
    }
  }

  input.addEventListener('input', () => { activeIdx = -1; filter(input.value); });
  input.addEventListener('keydown', e => {
    const items = results.querySelectorAll('.palette-item');
    if (e.key === 'ArrowDown') { e.preventDefault(); activeIdx = Math.min(activeIdx + 1, items.length - 1); updateActive(items); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); activeIdx = Math.max(activeIdx - 1, 0); updateActive(items); }
    else if (e.key === 'Enter') {
      e.preventDefault();
      if (activeIdx >= 0 && items[activeIdx]) {
        recordToolVisit(items[activeIdx].dataset.url);
        window.location.href = items[activeIdx].dataset.url;
      }
    }
    else if (e.key === 'Escape') close();
  });

  function updateActive(items) {
    items.forEach((item, i) => item.classList.toggle('active', i === activeIdx));
    if (activeIdx >= 0 && items[activeIdx]) items[activeIdx].scrollIntoView({ block: 'nearest' });
  }

  results.addEventListener('click', e => {
    const item = e.target.closest('.palette-item');
    if (item) { recordToolVisit(item.dataset.url); window.location.href = item.dataset.url; }
  });

  overlay.addEventListener('click', e => { if (e.target === overlay) close(); });

  document.addEventListener('keydown', e => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') { e.preventDefault(); open(); }
    if (e.key === 'Escape' && overlay.classList.contains('active')) close();
  });
})();

// ===== Recent Tools =====
function getRecentTools() {
  try { return JSON.parse(localStorage.getItem('recent_tools') || '[]'); } catch { return []; }
}
function recordToolVisit(url) {
  let recent = getRecentTools();
  recent = recent.filter(r => r !== url);
  recent.unshift(url);
  recent = recent.slice(0, 8);
  localStorage.setItem('recent_tools', JSON.stringify(recent));
}
function renderRecentTools() {
  const container = document.getElementById('recentToolsContainer');
  if (!container) return;
  const recent = getRecentTools();
  if (recent.length === 0) { container.style.display = 'none'; return; }
  container.style.display = '';
  const list = container.querySelector('.recent-list');
  list.innerHTML = recent.map(url => {
    const tool = TOOL_REGISTRY.find(t => t.url === url);
    if (!tool) return '';
    return `<a href="${tool.url}" class="recent-chip">${tool.icon} ${tool.name}</a>`;
  }).join('');
}

// Auto-record tool visit
(function() {
  if (window.location.pathname.startsWith('/tools/')) {
    recordToolVisit(window.location.pathname);
  }
  document.addEventListener('DOMContentLoaded', renderRecentTools);
})();

// ===== Daily Recommendation =====
(function() {
  const pick = document.getElementById('dailyPick');
  if (!pick) return;
  const tools = TOOL_REGISTRY.filter(t => !['隐私政策','服务条款','关于','反馈'].includes(t.cat));
  const seed = parseInt(new Date().toISOString().slice(0,10).replace(/-/g,''));
  const idx = seed % tools.length;
  const tool = tools[idx];
  pick.innerHTML = `<span class="pick-badge">✨ 今日推荐</span> <a href="${tool.url}">${tool.icon} ${tool.name}</a> — ${tool.cat}`;
  pick.style.display = 'flex';
})();

// ===== Feedback =====
function openFeedback() {
  document.getElementById('feedbackModal').classList.add('active');
}
function closeFeedback() {
  document.getElementById('feedbackModal').classList.remove('active');
  document.getElementById('fbEmail').value = '';
  document.getElementById('fbMsg').value = '';
}
function submitFeedback() {
  const msg = document.getElementById('fbMsg').value.trim();
  if (!msg) { showToast('请输入反馈内容'); return; }
  const email = document.getElementById('fbEmail').value.trim();
  const feedbacks = JSON.parse(localStorage.getItem('feedbacks') || '[]');
  feedbacks.push({ email, msg, time: new Date().toISOString() });
  localStorage.setItem('feedbacks', JSON.stringify(feedbacks));
  closeFeedback();
  showToast('感谢反馈！🙏');
}
document.getElementById('feedbackModal').addEventListener('click', e => { if(e.target === e.currentTarget) closeFeedback(); });

// ===== File Reader helpers =====
function readFileAsText(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = e => resolve(e.target.result);
    reader.onerror = reject;
    reader.readAsText(file);
  });
}

function readFileAsDataURL(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = e => resolve(e.target.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function readFileAsArrayBuffer(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = e => resolve(e.target.result);
    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });
}
