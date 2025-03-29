const canvas = document.getElementById('topographyCanvas');
const ctx = canvas.getContext('2d');
let time = 0;
let activeSection = 'home'; // Track active section

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

// Check for saved theme preference
if (localStorage.getItem('darkMode') === 'true') {
  document.getElementById('theme-toggle').checked = true;
  document.body.classList.add('dark-mode');
}

// Navigation handling
function setActiveNavItem(sectionId) {
  document.querySelectorAll('.nav-item').forEach(nav => {
    nav.classList.remove('active');
    if (nav.getAttribute('href') === `#${sectionId}`) {
      nav.classList.add('active');
    }
  });
  activeSection = sectionId;
}

// Scroll spy to detect active section
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

// Smooth scroll for navigation
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

// Handle browser back/forward navigation
window.addEventListener('popstate', () => {
  if (location.hash) {
    document.querySelector(location.hash).scrollIntoView();
    setActiveNavItem(location.hash.substring(1));
  }
});

// Initialize everything
function init() {
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);
  updateTime();
  setInterval(updateTime, 1000);
  drawTopography();
  setupScrollSpy();
  
  // Set initial active section based on URL hash
  if (location.hash) {
    setActiveNavItem(location.hash.substring(1));
  }
}

init();