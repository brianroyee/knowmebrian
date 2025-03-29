// Topographic Animation
const canvas = document.getElementById('topographyCanvas');
const ctx = canvas.getContext('2d');
let time = 0;

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

// Time Update
function updateTime() {
  const now = new Date();
  document.getElementById('current-time').textContent = 
    `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
}

// Theme Toggle
document.getElementById('theme-toggle').addEventListener('change', function() {
  document.body.classList.toggle('dark-mode', this.checked);
});

// Navigation
document.querySelectorAll('.nav-item').forEach(item => {
  item.addEventListener('click', function(e) {
    e.preventDefault();
    document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active'));
    this.classList.add('active');
    document.querySelector(this.getAttribute('href')).scrollIntoView({
      behavior: 'smooth'
    });
  });
});

// Initialization
resizeCanvas();
window.addEventListener('resize', resizeCanvas);
updateTime();
setInterval(updateTime, 1000);
drawTopography();