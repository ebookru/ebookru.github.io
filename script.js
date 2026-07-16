const toggle = document.getElementById('themeToggle');
const html = document.documentElement;
toggle.addEventListener('click', () => {
  const current = html.getAttribute('data-theme');
  const next = current === 'light' ? 'dark' : 'light';
  html.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
});

// --- Живой граф знаний ---
(function () {
  const svg = document.getElementById('graphSvg');
  if (!svg) return;
  const W = 500, H = 420;
  const styles = getComputedStyle(document.documentElement);
  const colors = ['--accent', '--accent2', '--text', '--bg-alt'];

  const N = 22;
  const nodes = Array.from({ length: N }, (_, i) => ({
    x: Math.random() * W,
    y: Math.random() * H,
    vx: (Math.random() - 0.5) * 0.25,
    vy: (Math.random() - 0.5) * 0.25,
    r: 3 + Math.random() * 5,
    color: colors[i % colors.length]
  }));

  const edgesEl = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  const nodesEl = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  svg.appendChild(edgesEl);
  svg.appendChild(nodesEl);

  const nodeCircles = nodes.map(n => {
    const c = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    c.setAttribute('r', n.r);
    c.setAttribute('class', 'graph-node');
    c.style.fill = `var(${n.color})`;
    c.style.opacity = 0.85;
    nodesEl.appendChild(c);
    return c;
  });

  function maxDist(a, b) {
    return Math.hypot(a.x - b.x, a.y - b.y);
  }

  function tick() {
    nodes.forEach(n => {
      n.x += n.vx;
      n.y += n.vy;
      if (n.x < 0 || n.x > W) n.vx *= -1;
      if (n.y < 0 || n.y > H) n.vy *= -1;
      n.x = Math.max(0, Math.min(W, n.x));
      n.y = Math.max(0, Math.min(H, n.y));
    });

    nodeCircles.forEach((c, i) => {
      c.setAttribute('cx', nodes[i].x);
      c.setAttribute('cy', nodes[i].y);
    });

    let edgeHTML = '';
    for (let i = 0; i < N; i++) {
      for (let j = i + 1; j < N; j++) {
        const d = maxDist(nodes[i], nodes[j]);
        if (d < 95) {
          const op = (1 - d / 95) * 0.5;
          edgeHTML += `<line x1="${nodes[i].x}" y1="${nodes[i].y}" x2="${nodes[j].x}" y2="${nodes[j].y}" class="graph-edge" style="opacity:${op}"></line>`;
        }
      }
    }
    edgesEl.innerHTML = edgeHTML;

    requestAnimationFrame(tick);
  }
  tick();
})();
