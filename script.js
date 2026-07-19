  const canvas = document.getElementById('bg-canvas');
  const ctx = canvas.getContext('2d');
  let W, H, particles = [];
  function resize(){ W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; }
  resize();
  window.addEventListener('resize', resize);
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!reduceMotion){
    for (let i = 0; i < 55; i++){
      particles.push({
        x: Math.random()*window.innerWidth, y: Math.random()*window.innerHeight,
        vx: (Math.random()-0.5)*0.3, vy: (Math.random()-0.5)*0.3,
        size: Math.random()*1.5+0.5, alpha: Math.random()*0.5+0.1
      });
    }
    function draw(){
      ctx.clearRect(0,0,W,H);
      particles.forEach(p=>{
        p.x+=p.vx; p.y+=p.vy;
        if(p.x<0)p.x=W; if(p.x>W)p.x=0; if(p.y<0)p.y=H; if(p.y>H)p.y=0;
        ctx.beginPath(); ctx.arc(p.x,p.y,p.size,0,Math.PI*2);
        ctx.fillStyle=`rgba(0,200,255,${p.alpha})`; ctx.fill();
      });
      for(let i=0;i<particles.length;i++){
        for(let j=i+1;j<particles.length;j++){
          const dx=particles[i].x-particles[j].x, dy=particles[i].y-particles[j].y;
          const dist=Math.sqrt(dx*dx+dy*dy);
          if(dist<120){
            ctx.beginPath(); ctx.moveTo(particles[i].x,particles[i].y); ctx.lineTo(particles[j].x,particles[j].y);
            ctx.strokeStyle=`rgba(0,200,255,${0.08*(1-dist/120)})`; ctx.lineWidth=0.5; ctx.stroke();
          }
        }
      }
      requestAnimationFrame(draw);
    }
    draw();
  }

  const links = Array.from(document.querySelectorAll('#filetree a'));
  const sections = links.map(a => document.querySelector(a.getAttribute('href')));
  const setActive = (id) => links.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + id));
  if ('IntersectionObserver' in window){
    const navIo = new IntersectionObserver((entries) => {
      entries.forEach(entry => { if (entry.isIntersecting) setActive(entry.target.id); });
    }, { rootMargin: '-40% 0px -55% 0px', threshold: 0 });
    sections.forEach(s => s && navIo.observe(s));
 
    const reveals = document.querySelectorAll('.reveal');
    const revealIo = new IntersectionObserver((entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting){
          setTimeout(() => entry.target.classList.add('visible'), i * 60);
          revealIo.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    reveals.forEach(r => revealIo.observe(r));
  }
