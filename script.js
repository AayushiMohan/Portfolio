const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');
let W, H, particles = [], gridLines = [];
 
function resize() {
  W = canvas.width = window.innerWidth;
  H = canvas.height = window.innerHeight;
}
resize();
window.addEventListener('resize', resize);
 
function buildGrid() {
  gridLines = [];
  const spacing = 80;
  for(let x = 0; x < W; x += spacing) gridLines.push({x, type:'v'});
  for(let y = 0; y < H; y += spacing) gridLines.push({y, type:'h'});
}
buildGrid();
window.addEventListener('resize', buildGrid);
 
for(let i = 0; i < 60; i++) {
  particles.push({
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    vx: (Math.random() - 0.5) * 0.3,
    vy: (Math.random() - 0.5) * 0.3,
    size: Math.random() * 1.5 + 0.5,
    alpha: Math.random() * 0.5 + 0.1
  });
}
 
function draw() {
  ctx.clearRect(0, 0, W, H);
 
  ctx.strokeStyle = 'rgba(0,200,255,0.04)';
  ctx.lineWidth = 1;
  gridLines.forEach(l => {
    ctx.beginPath();
    if(l.type === 'v') { ctx.moveTo(l.x, 0); ctx.lineTo(l.x, H); }
    else { ctx.moveTo(0, l.y); ctx.lineTo(W, l.y); }
    ctx.stroke();
  });
 
  particles.forEach(p => {
    p.x += p.vx; p.y += p.vy;
    if(p.x < 0) p.x = W; if(p.x > W) p.x = 0;
    if(p.y < 0) p.y = H; if(p.y > H) p.y = 0;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(0,200,255,${p.alpha})`;
    ctx.fill();
  });

  for(let i = 0; i < particles.length; i++) {
    for(let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx*dx + dy*dy);
      if(dist < 120) {
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.strokeStyle = `rgba(0,200,255,${0.08 * (1 - dist/120)})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
    }
  }
  requestAnimationFrame(draw);
}
draw();

const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
});

document.getElementById('hamburger').addEventListener('click', () => {
  document.getElementById('navLinks').classList.toggle('open');
});

const reveals = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if(entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 60);
    }
  });
}, { threshold: 0.1 });
reveals.forEach(r => observer.observe(r));
