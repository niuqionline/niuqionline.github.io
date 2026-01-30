// 高级Canvas雾气效果
function createCanvasFog() {
  if (document.querySelector('#fog-canvas')) return;
  
  const canvas = document.createElement('canvas');
  canvas.id = 'fog-canvas';
  canvas.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 9998;
    opacity: 0.7;
  `;
  document.body.appendChild(canvas);
  
  const ctx = canvas.getContext('2d');
  let particles = [];
  const particleCount = 150;
  
  // 调整canvas大小
  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  
  // 粒子类
  class FogParticle {
    constructor() {
      this.reset();
    }
    
    reset() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 100 + 50;
      this.speedX = Math.random() * 0.5 - 0.25;
      this.speedY = Math.random() * 0.2 - 0.1;
      this.opacity = Math.random() * 0.3 + 0.1;
      this.drift = Math.random() * 0.02 - 0.01;
    }
    
    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      
      // 轻微飘动
      this.speedX += this.drift;
      if (Math.abs(this.speedX) > 0.5) this.drift *= -1;
      
      // 边界检查
      if (this.x < -this.size) this.x = canvas.width + this.size;
      if (this.x > canvas.width + this.size) this.x = -this.size;
      if (this.y < -this.size) this.y = canvas.height + this.size;
      if (this.y > canvas.height + this.size) this.y = -this.size;
    }
    
    draw() {
      const gradient = ctx.createRadialGradient(
        this.x, this.y, 0,
        this.x, this.y, this.size
      );
      gradient.addColorStop(0, `rgba(255, 255, 255, ${this.opacity})`);
      gradient.addColorStop(0.5, `rgba(255, 255, 255, ${this.opacity * 0.5})`);
      gradient.addColorStop(1, `rgba(255, 255, 255, 0)`);
      
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();
    }
  }
  
  // 初始化粒子
  function initParticles() {
    particles = [];
    for (let i = 0; i < particleCount; i++) {
      particles.push(new FogParticle());
    }
  }
  
  // 动画循环
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // 绘制背景渐变
    const bgGradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    bgGradient.addColorStop(0, 'rgba(240, 248, 255, 0.1)');
    bgGradient.addColorStop(1, 'rgba(230, 240, 250, 0.05)');
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // 更新和绘制粒子
    particles.forEach(particle => {
      particle.update();
      particle.draw();
    });
    
    requestAnimationFrame(animate);
  }
  
  // 初始化
  resizeCanvas();
  initParticles();
  animate();
  
  // 窗口大小变化时重置
  window.addEventListener('resize', () => {
    resizeCanvas();
    initParticles();
  });
}

// 加载Canvas雾气
document.addEventListener('DOMContentLoaded', createCanvasFog);