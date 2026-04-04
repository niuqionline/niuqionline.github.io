/**
 * 冬季拨水成冰效果
 * 模拟水泼出后瞬间结冰的视觉效果
 */

class IceSplashEffect {
  constructor() {
    this.iceDrops = [];
    this.maxDrops = 50;
    this.isRunning = false;
    this.mouseX = 0;
    this.mouseY = 0;
    this.lastMouseX = 0;
    this.lastMouseY = 0;
    this.isMouseDown = false;
  }

  /**
   * 创建冰晶元素
   * @param {Object} config - 冰晶配置
   * @returns {HTMLElement} 冰晶元素
   */
  createIceDrop(config = {}) {
    const iceDrop = document.createElement('div');
    
    const size = config.size || Math.random() * 15 + 5;
    const startX = config.x || this.mouseX;
    const startY = config.y || this.mouseY;
    const angle = config.angle || Math.random() * Math.PI * 2;
    const speed = config.speed || Math.random() * 8 + 4;
    const gravity = 0.3;
    
    iceDrop.style.position = 'fixed';
    iceDrop.style.left = `${startX}px`;
    iceDrop.style.top = `${startY}px`;
    iceDrop.style.width = `${size}px`;
    iceDrop.style.height = `${size}px`;
    iceDrop.style.pointerEvents = 'none';
    iceDrop.style.zIndex = '9999';
    iceDrop.style.borderRadius = '50%';
    iceDrop.style.background = `radial-gradient(circle at 30% 30%, 
      rgba(255, 255, 255, 0.9), 
      rgba(200, 230, 255, 0.7), 
      rgba(150, 200, 255, 0.5))`;
    iceDrop.style.boxShadow = `
      inset -2px -2px 4px rgba(0, 100, 200, 0.3),
      inset 2px 2px 4px rgba(255, 255, 255, 0.8),
      0 0 8px rgba(200, 230, 255, 0.6),
      0 0 15px rgba(150, 200, 255, 0.4)
    `;
    iceDrop.style.opacity = '0.9';
    
    const velocityX = Math.cos(angle) * speed;
    const velocityY = Math.sin(angle) * speed - 5;
    
    iceDrop.dataset.vx = velocityX;
    iceDrop.dataset.vy = velocityY;
    iceDrop.dataset.gravity = gravity;
    iceDrop.dataset.life = '0';
    iceDrop.dataset.maxLife = '60';
    iceDrop.dataset.size = size;
    
    document.body.appendChild(iceDrop);
    this.iceDrops.push(iceDrop);
    
    return iceDrop;
  }

  /**
   * 创建冰晶结晶效果
   * @param {HTMLElement} iceDrop - 冰晶元素
   */
  createCrystallization(iceDrop) {
    const size = parseFloat(iceDrop.dataset.size);
    const crystallization = document.createElement('div');
    
    crystallization.style.position = 'absolute';
    crystallization.style.left = '50%';
    crystallization.style.top = '50%';
    crystallization.style.transform = 'translate(-50%, -50%)';
    crystallization.style.width = `${size * 2}px`;
    crystallization.style.height = `${size * 2}px`;
    crystallization.style.pointerEvents = 'none';
    crystallization.style.opacity = '0';
    crystallization.style.animation = 'crystallize 0.5s ease-out forwards';
    
    const branches = 6;
    for (let i = 0; i < branches; i++) {
      const branch = document.createElement('div');
      const rotation = (360 / branches) * i;
      
      branch.style.position = 'absolute';
      branch.style.left = '50%';
      branch.style.top = '50%';
      branch.style.width = `${size * 0.8}px`;
      branch.style.height = '1px';
      branch.style.background = 'linear-gradient(90deg, rgba(255, 255, 255, 0.9), rgba(200, 230, 255, 0.5), transparent)';
      branch.style.transformOrigin = 'left center';
      branch.style.transform = `translateY(-50%) rotate(${rotation}deg)`;
      branch.style.boxShadow = '0 0 4px rgba(200, 230, 255, 0.6)';
      
      crystallization.appendChild(branch);
    }
    
    iceDrop.appendChild(crystallization);
  }

  /**
   * 更新冰晶位置
   */
  updateIceDrops() {
    this.iceDrops = this.iceDrops.filter(iceDrop => {
      if (!iceDrop.parentNode) return false;
      
      let vx = parseFloat(iceDrop.dataset.vx);
      let vy = parseFloat(iceDrop.dataset.vy);
      let gravity = parseFloat(iceDrop.dataset.gravity);
      let life = parseInt(iceDrop.dataset.life);
      let maxLife = parseInt(iceDrop.dataset.maxLife);
      
      vy += gravity;
      
      const currentLeft = parseFloat(iceDrop.style.left);
      const currentTop = parseFloat(iceDrop.style.top);
      
      iceDrop.style.left = `${currentLeft + vx}px`;
      iceDrop.style.top = `${currentTop + vy}px`;
      
      iceDrop.dataset.vx = vx;
      iceDrop.dataset.vy = vy;
      iceDrop.dataset.life = life + 1;
      
      const progress = life / maxLife;
      
      if (progress > 0.3 && !iceDrop.querySelector('div')) {
        this.createCrystallization(iceDrop);
      }
      
      if (progress > 0.5) {
        iceDrop.style.opacity = 1 - progress;
      }
      
      if (life >= maxLife) {
        iceDrop.remove();
        return false;
      }
      
      return true;
    });
  }

  /**
   * 创建动画样式
   */
  createAnimation() {
    if (!document.getElementById('ice-splash-animation')) {
      const style = document.createElement('style');
      style.id = 'ice-splash-animation';
      style.textContent = `
        @keyframes crystallize {
          0% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0);
          }
          50% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1.2);
          }
          100% {
            opacity: 0.8;
            transform: translate(-50%, -50%) scale(1);
          }
        }
        
        @keyframes sparkle {
          0%, 100% {
            opacity: 0.3;
            transform: scale(0.8);
          }
          50% {
            opacity: 1;
            transform: scale(1.2);
          }
        }
      `;
      document.head.appendChild(style);
    }
  }

  /**
   * 处理鼠标移动事件
   */
  handleMouseMove(e) {
    this.mouseX = e.clientX;
    this.mouseY = e.clientY;
    
    if (this.isRunning && this.isMouseDown) {
      const dx = this.mouseX - this.lastMouseX;
      const dy = this.mouseY - this.lastMouseY;
      const speed = Math.sqrt(dx * dx + dy * dy);
      
      if (speed > 5) {
        const dropCount = Math.min(Math.floor(speed / 5), 5);
        for (let i = 0; i < dropCount; i++) {
          setTimeout(() => {
            if (this.isRunning) {
              this.createIceDrop({
                x: this.mouseX + (Math.random() - 0.5) * 20,
                y: this.mouseY + (Math.random() - 0.5) * 20,
                angle: Math.atan2(dy, dx) + (Math.random() - 0.5) * 1.5,
                speed: speed * 0.3 + Math.random() * 3
              });
            }
          }, i * 20);
        }
      }
    }
    
    this.lastMouseX = this.mouseX;
    this.lastMouseY = this.mouseY;
  }

  /**
   * 处理鼠标按下事件
   */
  handleMouseDown(e) {
    this.isMouseDown = true;
    this.mouseX = e.clientX;
    this.mouseY = e.clientY;
    this.lastMouseX = this.mouseX;
    this.lastMouseY = this.mouseY;
  }

  /**
   * 处理鼠标抬起事件
   */
  handleMouseUp() {
    this.isMouseDown = false;
  }

  /**
   * 添加事件监听器
   */
  addEventListeners() {
    this.mouseMoveHandler = this.handleMouseMove.bind(this);
    this.mouseDownHandler = this.handleMouseDown.bind(this);
    this.mouseUpHandler = this.handleMouseUp.bind(this);
    
    document.addEventListener('mousemove', this.mouseMoveHandler);
    document.addEventListener('mousedown', this.mouseDownHandler);
    document.addEventListener('mouseup', this.mouseUpHandler);
  }

  /**
   * 移除事件监听器
   */
  removeEventListeners() {
    if (this.mouseMoveHandler) {
      document.removeEventListener('mousemove', this.mouseMoveHandler);
    }
    if (this.mouseDownHandler) {
      document.removeEventListener('mousedown', this.mouseDownHandler);
    }
    if (this.mouseUpHandler) {
      document.removeEventListener('mouseup', this.mouseUpHandler);
    }
  }

  /**
   * 启动拨水成冰效果
   * @param {Object} config - 效果配置
   */
  start(config = {}) {
    if (this.isRunning) {
      console.log('拨水成冰效果已经在运行中');
      return;
    }
    
    console.log('开始执行拨水成冰效果...');
    console.log('效果配置:', config);
    
    this.isRunning = true;
    this.createAnimation();
    this.addEventListeners();
    
    const maxDrops = config.maxDrops || this.maxDrops;
    this.maxDrops = maxDrops;
    
    const updateInterval = config.updateInterval || 16;
    
    this.animationFrame = setInterval(() => {
      if (this.isRunning) {
        this.updateIceDrops();
      }
    }, updateInterval);
    
    console.log('拨水成冰效果执行成功！按住鼠标拖动即可生成冰晶...');
  }

  /**
   * 停止拨水成冰效果
   */
  stop() {
    this.isRunning = false;
    
    if (this.animationFrame) {
      clearInterval(this.animationFrame);
      this.animationFrame = null;
    }
    
    this.removeEventListeners();
    
    this.iceDrops.forEach(iceDrop => {
      if (iceDrop.parentNode) {
        iceDrop.remove();
      }
    });
    
    this.iceDrops = [];
    this.isMouseDown = false;
    
    console.log('拨水成冰效果已停止');
  }

  /**
   * 重置拨水成冰效果
   * @param {Object} config - 效果配置
   */
  reset(config = {}) {
    this.stop();
    this.start(config);
  }

  /**
   * 调整冰晶数量
   * @param {number} count - 冰晶数量
   */
  setDropCount(count) {
    this.maxDrops = count;
  }

  /**
   * 在指定位置生成冰晶
   * @param {number} x - X坐标
   * @param {number} y - Y坐标
   * @param {number} count - 冰晶数量
   */
  spawnAt(x, y, count = 10) {
    for (let i = 0; i < count; i++) {
      setTimeout(() => {
        if (this.isRunning) {
          this.createIceDrop({
            x: x + (Math.random() - 0.5) * 30,
            y: y + (Math.random() - 0.5) * 30,
            angle: Math.random() * Math.PI * 2,
            speed: Math.random() * 6 + 3
          });
        }
      }, i * 30);
    }
  }
}

const iceSplashEffect = new IceSplashEffect();
export default iceSplashEffect;
export { IceSplashEffect };

if (typeof window !== 'undefined') {
  window.iceSplashEffect = iceSplashEffect;
  console.log('拨水成冰效果已挂载到 window 对象');
  
  window.addEventListener('DOMContentLoaded', () => {
    if (window.Bundle && window.Bundle.effectScheduler) {
      const effectScheduler = window.Bundle.effectScheduler;
      
      effectScheduler.registerEffectHandler('ice_splash', (config) => {
        return new Promise((resolve) => {
          iceSplashEffect.start(config);
          setTimeout(resolve, 500);
        });
      });
      
      effectScheduler.addEffect(
        'winter_ice_splash_effect',
        { type: 'ice_splash' },
        70,
        'winter',
        'day'
      );
      
      effectScheduler.addEffect(
        'winter_ice_splash_effect_night',
        { type: 'ice_splash' },
        50,
        'winter',
        'night'
      );
      
      console.log('拨水成冰效果已注册到效果库');
    }
  });
}
