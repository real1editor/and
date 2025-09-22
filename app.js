// app.js - UI logic (ES module) with Three.js hero
const PORTFOLIO = [
  { title: "YouTube - Hair Oil Edit", url: "https://youtube.com/watch?v=xxx", category: "youtube", image: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&w=800&q=80" },
  { title: "TikTok Viral Edit", url: "https://vm.tiktok.com/xxx", category: "tiktok", image: "https://images.unsplash.com/photo-1616469829476-8953c5655574?auto=format&fit=crop&w=800&q=80" },
  { title: "Reels - Before/After", url: "https://instagram.com/p/xxx", category: "tiktok", image: "https://images.unsplash.com/photo-1611746869696-4c17d1c11836?auto=format&fit=crop&w=800&q=80" },
  { title: "Commercial Ad - Tech Company", url: "https://vimeo.com/xxx", category: "commercial", image: "https://images.unsplash.com/photo-1579033386963-c9c471d8c444?auto=format&fit=crop&w=800&q=80" },
  { title: "Documentary Short Film", url: "https://youtube.com/watch?v=xxx", category: "youtube", image: "https://images.unsplash.com/photo-1591261730799-049e2bab5c7b?auto=format&fit=crop&w=800&q=80" },
  { title: "Product Launch Video", url: "https://youtube.com/watch?v=xxx", category: "commercial", image: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=800&q=80" }
];

// DOM refs
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');
const themeToggle = document.getElementById('theme-toggle');
const themeIcon = themeToggle.querySelector('i');
const backToTopButton = document.getElementById('backToTop');
const navbar = document.querySelector('.navbar');

// Mobile menu
if (hamburger) {
  hamburger.addEventListener('click', () => {
    const expanded = hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
    hamburger.setAttribute('aria-expanded', expanded ? 'true' : 'false');
  });
}
document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
  hamburger?.classList.remove('active');
  navMenu?.classList.remove('active');
}));

// Theme toggle persist
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'light') document.body.classList.add('light-mode');
if (document.body.classList.contains('light-mode')) { themeIcon.classList.remove('fa-moon'); themeIcon.classList.add('fa-sun'); }

themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('light-mode');
  if (document.body.classList.contains('light-mode')) {
    themeIcon.classList.remove('fa-moon'); themeIcon.classList.add('fa-sun'); localStorage.setItem('theme','light');
  } else {
    themeIcon.classList.remove('fa-sun'); themeIcon.classList.add('fa-moon'); localStorage.setItem('theme','dark');
  }
});

// Sticky shadow
window.addEventListener('scroll', () => {
  if (window.scrollY > 60) navbar.style.boxShadow = '0 8px 30px rgba(2,6,23,0.4)';
  else navbar.style.boxShadow = 'none';
});

// Back to top
window.addEventListener('scroll', () => {
  if (window.pageYOffset > 300) backToTopButton.classList.add('visible');
  else backToTopButton.classList.remove('visible');
});
backToTopButton.addEventListener('click', () => window.scrollTo({ top:0, behavior:'smooth' }));

// Smooth internal links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e){
    const targetId = this.getAttribute('href');
    if (!targetId || targetId === '#') return;
    const targetElement = document.querySelector(targetId);
    if (targetElement) { e.preventDefault(); targetElement.scrollIntoView({behavior:'smooth', block:'start'}); }
  });
});

// Populate portfolio
const portfolioGrid = document.getElementById('portfolioGrid');
function renderPortfolio(items){
  if (!portfolioGrid) return;
  portfolioGrid.innerHTML = '';
  items.forEach((item, index) => {
    const wrapper = document.createElement('div');
    wrapper.className = 'portfolio-item';
    wrapper.setAttribute('data-category', item.category);
    wrapper.style.animationDelay = `${0.2 + index * 0.06}s`;
    wrapper.innerHTML = `
      <div class="portfolio-image"><img src="${item.image}" alt="${item.title}" loading="lazy"></div>
      <div class="portfolio-info">
        <h3>${item.title}</h3>
        <p>Click to view this project on the respective platform.</p>
        <span class="portfolio-category">${item.category.charAt(0).toUpperCase() + item.category.slice(1)}</span>
      </div>
    `;
    wrapper.addEventListener('click', () => window.open(item.url, '_blank'));
    portfolioGrid.appendChild(wrapper);
  });
  // re-init tilt on newly added nodes
  if (window.VanillaTilt) VanillaTilt.init(document.querySelectorAll('[data-tilt]'), { max: 12, speed: 400, glare:true, 'max-glare':0.12 });
}
renderPortfolio(PORTFOLIO);

// Portfolio filter
const filterButtons = document.querySelectorAll('.filter-btn');
filterButtons.forEach(button => button.addEventListener('click', () => {
  filterButtons.forEach(b => b.classList.remove('active'));
  button.classList.add('active');
  const filter = button.getAttribute('data-filter');
  const nodes = document.querySelectorAll('.portfolio-item');
  nodes.forEach(n => {
    if (filter === 'all' || n.getAttribute('data-category') === filter) n.style.display = 'block';
    else n.style.display = 'none';
  });
}));

// Intersection animations
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.feature-card, .service-card, .testimonial-card, .portfolio-item').forEach(el => {
  el.style.opacity = '0'; el.style.transform = 'translateY(18px)'; observer.observe(el);
});

// Forms
async function postJSON(url, data){
  try{
    const res = await fetch(url, { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(data) });
    return await res.json();
  }catch(err){ console.error(err); return { ok:false }; }
}

document.getElementById('contactForm')?.addEventListener('submit', async (e)=>{
  e.preventDefault();
  const form = e.target; const fd = new FormData(form); const data = Object.fromEntries(fd.entries());
  const res = await postJSON('/api/register', data);
  if (res.ok) { alert('✅ Message sent! I\\'ll get back to you soon.'); form.reset(); }
  else alert('⚠️ There was an error sending your message. Please try again.');
});

document.getElementById('feedbackForm')?.addEventListener('submit', async (e)=>{
  e.preventDefault();
  const form = e.target; const fd = new FormData(form); const data = Object.fromEntries(fd.entries());
  const res = await postJSON('/api/feedback', data);
  if (res.ok) { alert('✅ Feedback sent! Thank you for your input.'); form.reset(); }
  else alert('⚠️ There was an error sending your feedback. Please try again.');
});

// Newsletter (demo)
document.getElementById('newsletterForm')?.addEventListener('submit',(e)=>{
  e.preventDefault(); alert('✅ Thank you for subscribing!'); e.target.reset();
});

// Initialize vanilla-tilt for UI depth (if loaded)
if (window.VanillaTilt) VanillaTilt.init(document.querySelectorAll('[data-tilt]'), { max: 12, speed: 400, glare:true, 'max-glare':0.12 });

// Small parallax to hero layers based on mouse
const hero = document.querySelector('.hero');
if (hero) {
  hero.addEventListener('mousemove', (e)=>{
    const x = (e.clientX / window.innerWidth) - 0.5;
    const y = (e.clientY / window.innerHeight) - 0.5;
    document.querySelectorAll('.hero-layer').forEach((layer, i)=>{
      const depth = (i+1) * 8;
      layer.style.transform = `translate3d(${x * depth}px, ${y * depth}px, 0)`;
    });
  });
}

// --- THREE.JS HERO SCENE --------------------------------------------------
// Creates a subtle floating particle field with gentle motion for a premium 3D feel.
// If Three.js isn't available or WebGL is blocked, this gracefully no-ops.
function initThreeHero() {
  if (!window.THREE) return; // three not loaded
  const canvas = document.getElementById('hero3d');
  if (!canvas) return;

  // Renderer
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);

  // Scene & Camera
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 2000);
  camera.position.set(0, 0, 400);

  // Light
  const ambient = new THREE.AmbientLight(0xffffff, 0.8);
  scene.add(ambient);

  // Particle geometry
  const particleCount = Math.min(1400, Math.floor(window.innerWidth / 1.5));
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);
  const sizes = new Float32Array(particleCount);

  for (let i = 0; i < particleCount; i++) {
    const i3 = i * 3;
    positions[i3 + 0] = (Math.random() - 0.5) * 1400; // x
    positions[i3 + 1] = (Math.random() - 0.5) * 600;  // y
    positions[i3 + 2] = (Math.random() - 0.5) * 800;  // z

    const c = new THREE.Color().setHSL(0.55 + Math.random() * 0.15, 0.8, 0.5);
    colors[i3 + 0] = c.r;
    colors[i3 + 1] = c.g;
    colors[i3 + 2] = c.b;

    sizes[i] = 6 + Math.random() * 10;
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('customColor', new THREE.BufferAttribute(colors, 3));
  geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

  // Material
  const material = new THREE.ShaderMaterial({
    transparent: true,
    depthTest: true,
    uniforms: {
      color: { value: new THREE.Color(0xffffff) },
      pointTexture: { value: null },
      uTime: { value: 0.0 },
      uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) }
    },
    vertexShader: `
      attribute float size;
      attribute vec3 customColor;
      uniform float uTime;
      varying vec3 vColor;
      void main() {
        vColor = customColor;
        vec3 pos = position;
        float t = uTime * 0.2;
        pos.z += sin((position.x + t) * 0.0025) * 20.0;
        vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
        gl_PointSize = size * (300.0 / -mvPosition.z);
        gl_Position = projectionMatrix * mvPosition;
      }
    `,
    fragmentShader: `
      varying vec3 vColor;
      void main() {
        float dist = length(gl_PointCoord - vec2(0.5));
        float alpha = 1.0 - smoothstep(0.45, 0.5, dist);
        gl_FragColor = vec4(vColor, alpha * 0.85);
      }
    `
  });

  const points = new THREE.Points(geometry, material);
  scene.add(points);

  // gentle camera motion
  let mouseX = 0, mouseY = 0;
  window.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX - window.innerWidth / 2) * 0.02;
    mouseY = (e.clientY - window.innerHeight / 2) * 0.02;
  });

  // resize handling
  function onResize() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  }
  window.addEventListener('resize', onResize, { passive: true });

  // animation loop
  const clock = new THREE.Clock();
  function animate() {
    const t = clock.getElapsedTime();
    material.uniforms.uTime.value = t;
    // move camera slightly based on mouse
    camera.position.x += (mouseX - camera.position.x) * 0.05;
    camera.position.y += (-mouseY - camera.position.y) * 0.05;
    camera.lookAt(0, 0, 0);
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }
  animate();
}

// Delay three initialization until scripts loaded
window.addEventListener('load', () => {
  try { initThreeHero(); } catch (err) { console.warn('Three.js hero failed to init:', err); }
});
