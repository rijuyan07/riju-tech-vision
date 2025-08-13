/* ====== GLOBAL UI + ANIMATIONS & PARTICLES & SLIDER ====== */

/* ---- typed intro ---- */
const typedEl = document.getElementById('typed');
const texts = ["Hi, I'm Rijuyanur Shekh.", "Future Tech Explorer.", "AI • Quantum • Coding • Space"];
let tI = 0, tChar = 0, forward = true;
function typeLoop(){
  if(!typedEl) return;
  const cur = texts[tI];
  if(forward){
    tChar++;
    typedEl.textContent = cur.slice(0,tChar);
    if(tChar >= cur.length){ forward=false; setTimeout(typeLoop,900); return; }
  } else {
    tChar--;
    typedEl.textContent = cur.slice(0,tChar);
    if(tChar <= 0){ forward=true; tI = (tI+1)%texts.length; setTimeout(typeLoop,300); return; }
  }
  setTimeout(typeLoop, 60);
}
typeLoop();

/* ---- particle background (canvas) ---- */
const canvas = document.getElementById('bg');
const ctx = canvas.getContext('2d');
let W = canvas.width = innerWidth;
let H = canvas.height = innerHeight;
window.addEventListener('resize', ()=>{ W=canvas.width=innerWidth; H=canvas.height=innerHeight; initParticles(); });

let particles = [];
const PCOUNT = Math.floor((W*H)/90000) + 60;
function initParticles(){
  particles = [];
  for(let i=0;i<PCOUNT;i++){
    particles.push({
      x: Math.random()*W,
      y: Math.random()*H,
      r: 0.6 + Math.random()*2.2,
      dx: (Math.random()-0.5)*0.6,
      dy: (Math.random()-0.5)*0.6,
      hue: 180 + Math.random()*120
    });
  }
}
function drawParticles(){
  ctx.clearRect(0,0,W,H);
  // subtle gradient overlay
  for(const p of particles){
    p.x += p.dx; p.y += p.dy;
    if(p.x< -10) p.x = W+10; if(p.x>W+10) p.x = -10;
    if(p.y< -10) p.y = H+10; if(p.y>H+10) p.y = -10;
    ctx.beginPath();
    const g = ctx.createRadialGradient(p.x,p.y,0,p.x,p.y,p.r*8);
    g.addColorStop(0, `hsla(${p.hue},90%,65%,0.085)`);
    g.addColorStop(1, `hsla(${p.hue},90%,50%,0)`);
    ctx.fillStyle = g;
    ctx.arc(p.x,p.y,p.r*6,0,Math.PI*2);
    ctx.fill();
  }
  // connect nearby points
  for(let i=0;i<particles.length;i++){
    for(let j=i+1;j<particles.length;j++){
      const a = particles[i], b = particles[j];
      const dx = a.x-b.x, dy = a.y-b.y;
      const d = Math.sqrt(dx*dx+dy*dy);
      if(d < 120){
        ctx.beginPath();
        ctx.strokeStyle = `rgba(255,255,255,${0.02*(120-d)})`;
        ctx.lineWidth = 1;
        ctx.moveTo(a.x,a.y); ctx.lineTo(b.x,b.y); ctx.stroke();
      }
    }
  }
  requestAnimationFrame(drawParticles);
}
initParticles();
drawParticles();

/* ---- topic card entry animations (data-ani attribute) ---- */
document.addEventListener('DOMContentLoaded', ()=>{
  const nodes = document.querySelectorAll('[data-ani]');
  nodes.forEach((n, idx)=>{
    n.style.opacity = 0;
    setTimeout(()=>{ n.style.transition = 'all .9s cubic-bezier(.2,.9,.2,1)'; n.style.opacity = 1; n.style.transform = 'translateY(0)'; }, 150+idx*120);
  });
});

/* ---- IMAGE SLIDER (10 images) ---- */
let current = 1;
const total = 10;
const slideImg = document.getElementById('slideImg');
const imgButtonsContainer = document.getElementById('imgButtons');

function makeButtons(){
  if(!imgButtonsContainer) return;
  imgButtonsContainer.innerHTML = '';
  for(let i=1;i<=total;i++){
    const b = document.createElement('button');
    b.textContent = `Image ${i}`;
    b.onclick = ()=>{ goTo(i); };
    imgButtonsContainer.appendChild(b);
  }
}
function goTo(n){
  if(n<1) n=total; if(n>total) n=1;
  current = n;
  // fade effect
  slideImg.style.opacity = 0;
  setTimeout(()=>{ slideImg.src = `images/img${current}.jpg`; slideImg.style.transform = 'scale(1.02)'; }, 200);
  setTimeout(()=>{ slideImg.style.opacity = 1; slideImg.style.transform = 'scale(1)'; }, 360);
}
function next(){ goTo(current+1); }
function prev(){ goTo(current-1); }

document.getElementById('nextBtn')?.addEventListener('click', next);
document.getElementById('prevBtn')?.addEventListener('click', prev);

makeButtons();
goTo(1);

/* auto slide */
let auto = setInterval(next, 3500);
const sliderWrap = document.querySelector('.slider-wrap');
sliderWrap && sliderWrap.addEventListener('mouseenter', ()=> clearInterval(auto));
sliderWrap && sliderWrap.addEventListener('mouseleave', ()=> auto = setInterval(next, 3500));

/* ---- small nav active link highlight ---- */
const navLinks = document.querySelectorAll('.nav-link');
navLinks.forEach(l=> l.addEventListener('click', ()=> navLinks.forEach(x=>x.classList.remove('active')) ));

/* ---- simple page transition on link clicks (prevent flash) ---- */
document.querySelectorAll('a[href]').forEach(a=>{
  const href = a.getAttribute('href');
  if(!href || href.startsWith('http') || href.startsWith('#') || href.endsWith('.jpg') ) return;
  a.addEventListener('click', (e)=>{
    // allow default for back links handled normally
    // quick fade-out
    e.preventDefault();
    document.body.style.transition = 'opacity .45s ease';
    document.body.style.opacity = 0;
    setTimeout(()=> location.href = href, 450);
  });
});
/* fade-in on load */
window.addEventListener('pageshow', ()=>{ document.body.style.opacity = 1 });