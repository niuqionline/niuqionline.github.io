// 智能樱花效果管理器
class SakuraManager {
  constructor() {
    this.isEnabled = true;
    this.petalCount = 60;
    this.autoAdapt();
    this.init();
  }
  
  // 自动适应设备性能
  autoAdapt() {
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    if (isMobile) {
      this.petalCount = 30; // 移动端减少数量
      console.log('🌸 移动端模式：30片樱花');
    } else {
      this.petalCount = 80; // PC端更多
      console.log('🌸 桌面端模式：80片樱花');
    }
    
    // 检查用户偏好
    if (localStorage.getItem('sakura-effect') === 'off') {
      this.isEnabled = false;
    }
  }
  
  // 初始化
  init() {
    if (!this.isEnabled) return;
    
    // 等待DOM完全加载
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.start());
    } else {
      this.start();
    }
  }
  
  // 开始效果
  start() {
    console.log('🌸 开始樱花飘落效果');
    
    // 创建樱花容器
    const container = document.createElement('div');
    container.id = 'sakura-container';
    container.className = 'sakura-container';
    document.body.appendChild(container);
    
    // 生成樱花
    this.createPetals();
    
    // 添加交互功能
    this.addInteractions();
    
    // 监听页面可见性变化
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.pause();
      } else {
        this.resume();
      }
    });
  }
  
  // 创建花瓣
  createPetals() {
    const container = document.getElementById('sakura-container');
    if (!container) return;
    
    // 清空已有花瓣（防止重复）
    container.innerHTML = '';
    
    for (let i = 0; i < this.petalCount; i++) {
      const petal = this.createPetal(i);
      container.appendChild(petal);
    }
  }
  
  // 创建单个花瓣
  createPetal(index) {
    const petal = document.createElement('div');
    petal.className = 'sakura-petal';
    
    // 随机属性
    const size = 10 + Math.random() * 20;
    const left = Math.random() * 100;
    const duration = 10 + Math.random() * 20;
    const delay = Math.random() * 20;
    const hue = 320 + Math.random() * 30;
    const rotate = Math.random() * 360;
    
    // 设置样式
    petal.style.cssText = `
      --rotate: ${rotate}deg;
      width: ${size}px;
      height: ${size}px;
      left: ${left}vw;
      animation: 
        sakura-fall ${duration}s linear ${delay}s infinite,
        sakura-sway ${duration/2}s ease-in-out ${delay}s infinite alternate;
      background: linear-gradient(135deg,
        hsla(${hue}, 100%, 85%, 0.9) 0%,
        hsla(${hue}, 100%, 75%, 0.7) 100%);
      filter: drop-shadow(0 0 8px hsla(${hue}, 100%, 75%, 0.5));
      animation-play-state: running;
      will-change: transform, opacity;
    `;
    
    // 添加鼠标交互
    petal.addEventListener('mouseenter', () => {
      petal.style.animationPlayState = 'paused';
      petal.style.transform = 'scale(1.5) rotate(180deg)';
      petal.style.filter = 'brightness(1.5) drop-shadow(0 0 15px pink)';
    });
    
    petal.addEventListener('mouseleave', () => {
      petal.style.animationPlayState = 'running';
      petal.style.transform = '';
      petal.style.filter = '';
    });
    
    return petal;
  }
  
  // 添加交互功能
  addInteractions() {
    // 添加控制按钮
    const button = document.createElement('button');
    button.id = 'sakura-toggle';
    button.innerHTML = '🌸';
    button.title = '切换樱花效果';
    button.style.cssText = `
      position: fixed;
      bottom: 80px;
      right: 20px;
      z-index: 10001;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.9);
      border: 2px solid pink;
      color: #ff6b9d;
      font-size: 20px;
      cursor: pointer;
      box-shadow: 0 2px 10px rgba(0,0,0,0.2);
      transition: all 0.3s;
    `;
    
    button.addEventListener('mouseenter', () => {
      button.style.transform = 'scale(1.1)';
      button.style.boxShadow = '0 4px 15px rgba(0,0,0,0.3)';
    });
    
    button.addEventListener('mouseleave', () => {
      button.style.transform = '';
      button.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';
    });
    
    button.addEventListener('click', () => this.toggle());
    document.body.appendChild(button);
  }
  
  // 切换开关
  toggle() {
    const container = document.getElementById('sakura-container');
    const button = document.getElementById('sakura-toggle');
    
    if (container.style.display === 'none') {
      // 开启
      container.style.display = 'block';
      this.resume();
      button.style.background = 'rgba(255, 255, 255, 0.9)';
      button.style.color = '#ff6b9d';
      localStorage.setItem('sakura-effect', 'on');
    } else {
      // 关闭
      container.style.display = 'none';
      this.pause();
      button.style.background = 'rgba(200, 200, 200, 0.5)';
      button.style.color = '#999';
      localStorage.setItem('sakura-effect', 'off');
    }
  }
  
  // 暂停动画
  pause() {
    const petals = document.querySelectorAll('.sakura-petal');
    petals.forEach(petal => {
      petal.style.animationPlayState = 'paused';
    });
  }
  
  // 恢复动画
  resume() {
    const petals = document.querySelectorAll('.sakura-petal');
    petals.forEach(petal => {
      petal.style.animationPlayState = 'running';
    });
  }
  
  // 重新生成花瓣
  refresh() {
    this.createPetals();
  }
}

// 页面加载后实例化
let sakuraManager;

// 确保在DOM完全加载后执行
function initSakura() {
  sakuraManager = new SakuraManager();
  
  // 全局暴露，方便调试
  window.sakura = sakuraManager;
  
  // 添加热键控制（按 S 键切换）
  document.addEventListener('keydown', (e) => {
    if (e.key === 's' || e.key === 'S') {
      sakuraManager.toggle();
    }
    if (e.key === 'r' || e.key === 'R') {
      sakuraManager.refresh();
    }
  });
  
  console.log('🌸 樱花效果管理器已加载');
}

// 确保页面完全加载
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initSakura);
} else {
  initSakura();
}