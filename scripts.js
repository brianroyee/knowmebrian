const canvas = document.getElementById('topographyCanvas');
const ctx = canvas.getContext('2d');
let time = 0;
let activeSection = 'home';

// Canvas functions
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

function drawTopography() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = document.body.classList.contains('dark-mode') ? 
    'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)';
  ctx.lineWidth = 1;

  const cols = 40;
  const rows = 40;
  const cellWidth = canvas.width / cols;
  const cellHeight = canvas.height / rows;

  for(let i = 0; i < cols; i++) {
    for(let j = 0; j < rows; j++) {
      const x = i * cellWidth + cellWidth/2;
      const y = j * cellHeight + cellHeight/2;
      const noise = Math.sin(x * 0.01 + time) * Math.cos(y * 0.01 + time);
      
      ctx.beginPath();
      ctx.arc(x + noise * 15, y + noise * 15, 1.5, 0, Math.PI * 2);
      ctx.stroke();
    }
  }

  time += 0.015;
  requestAnimationFrame(drawTopography);
}

// Update time
function updateTime() {
  const now = new Date();
  document.getElementById('current-time').textContent = 
    `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
}

// Theme toggle
document.getElementById('theme-toggle').addEventListener('change', function() {
  document.body.classList.toggle('dark-mode', this.checked);
  localStorage.setItem('darkMode', this.checked);
});

// Check for theme preference
if (localStorage.getItem('darkMode') === 'true') {
  document.getElementById('theme-toggle').checked = true;
  document.body.classList.add('dark-mode');
}

// Navigation
function setActiveNavItem(sectionId) {
  document.querySelectorAll('.nav-item').forEach(nav => {
    nav.classList.remove('active');
    if (nav.getAttribute('href') === `#${sectionId}`) {
      nav.classList.add('active');
    }
  });
  activeSection = sectionId;
}

//detect active section
function setupScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.5
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        setActiveNavItem(entry.target.id);
      }
    });
  }, observerOptions);

  sections.forEach(section => {
    observer.observe(section);
  });
}

// Smooth scroll
document.querySelectorAll('.nav-item').forEach(item => {
  item.addEventListener('click', function(e) {
    const href = this.getAttribute('href');
    if (href.startsWith('#')) {
      e.preventDefault();
      document.querySelector(href).scrollIntoView({
        behavior: 'smooth'
      });
      history.pushState(null, null, href);
    }
  });
});

//browser back/forward navigation
window.addEventListener('popstate', () => {
  if (location.hash) {
    document.querySelector(location.hash).scrollIntoView();
    setActiveNavItem(location.hash.substring(1));
  }
});

// Loading screen handler - modified to ensure minimum 1s display
window.addEventListener('load', function() {
  const loadingScreen = document.querySelector('.loading-screen');
  const loadTime = performance.now();
  const minDisplayTime = 1000;

  if (loadingScreen) {
    const remainingTime = minDisplayTime - (performance.now() - loadTime);
    
    if (remainingTime > 0) {
      setTimeout(() => {
        loadingScreen.classList.add('hidden');
        setTimeout(() => loadingScreen.remove(), 300); // Remove after fade completes
      }, remainingTime);
    } else {
      loadingScreen.classList.add('hidden');
      setTimeout(() => loadingScreen.remove(), 300);
    }
  }
});

//loading screen 
function init() {
  const loadingScreen = document.querySelector('.loading-screen');
  if (loadingScreen) loadingScreen.style.display = 'flex';

  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);
  updateTime();
  setInterval(updateTime, 1000);
  drawTopography();
  setupScrollSpy();

  if (location.hash) {
    setActiveNavItem(location.hash.substring(1));
  }
}
init();