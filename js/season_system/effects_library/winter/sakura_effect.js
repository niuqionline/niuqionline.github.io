/**
 * 冬季樱花飘落效果
 * 冬季特有的樱花视觉效果
 */

class WinterSakuraEffect {
  constructor() {
    this.petals = [];
    this.maxPetals = 40;
    this.isRunning = false;
  }

  /**
   * 创建樱花花瓣元素
   * @param {Object} config - 花瓣配置
   * @returns {HTMLElement} 花瓣元素
   */
  createPetal(config = {}) {
    const petal = document.createElement('div');
    
    // 设置樱花花瓣样式
    const size = config.size || Math.random() * 12 + 6;
    const left = Math.random() * 100;
    const duration = config.duration || Math.random() * 12 + 8;
    const delay = Math.random() * 5;
    const opacity = Math.random() * 0.7 + 0.3;
    const rotation = Math.random() * 360;
    const rotationSpeed = Math.random() * 10 - 5;
    
    // 冬季樱花颜色：浅粉色到白色的渐变
    const sakuraColors = [
      'rgba(255, 192, 203, 0.9)',
      'rgba(255, 182, 193, 0.85)',
      'rgba(255, 228, 225, 0.9)',
      'rgba(255, 240, 245, 0.85)',
      'rgba(255, 250, 250, 0.9)'
    ];
    const color = config.color || sakuraColors[Math.floor(Math.random() * sakuraColors.length)];
    
    petal.style.position = 'fixed';
    petal.style.top = '-20px';
    petal.style.left = `${left}%`;
    petal.style.width = `${size}px`;
    petal.style.height = `${size}px`;
    petal.style.opacity = opacity;
    petal.style.pointerEvents = 'none';
    petal.style.zIndex = '9999';
    petal.style.borderRadius = '150% 0 150% 0';
    petal.style.backgroundColor = color;
    petal.style.transform = `rotate(${rotation}deg)`;
    petal.style.animation = `sakuraFall ${duration}s linear infinite`;
    petal.style.animationDelay = `${delay}s`;
    
    // 添加柔光效果
    petal.style.boxShadow = `0 0 ${size/2}px ${color}`;
    
    // 添加到DOM
    document.body.appendChild(petal);
    this.petals.push(petal);
    
    return petal;
  }

  /**
   * 创建樱花飘落动画
   */
  createAnimation() {
    // 检查是否已经存在动画
    if (!document.getElementById('sakura-animation-style')) {
      const style = document.createElement('style');
      style.id = 'sakura-animation-style';
      style.textContent = `
        @keyframes sakuraFall {
          0% {
            transform: translateY(-20px) rotate(0deg) translateX(0);
            opacity: 0.9;
          }
          10% {
            opacity: 1;
          }
          25% {
            transform: translateY(25vh) rotate(90deg) translateX(20px);
          }
          50% {
            transform: translateY(50vh) rotate(180deg) translateX(-20px);
          }
          75% {
            transform: translateY(75vh) rotate(270deg) translateX(20px);
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(360deg) translateX(0);
            opacity: 0;
          }
        }
      `;
      document.head.appendChild(style);
    }
  }

  /**
   * 启动冬季樱花效果
   * @param {Object} config - 效果配置
   */
  start(config = {}) {
    if (this.isRunning) {
      console.log('冬季樱花效果已经在运行中');
      return;
    }
    
    console.log('开始执行冬季樱花效果...');
    console.log('效果配置:', config);
    
    this.isRunning = true;
    this.createAnimation();
    
    // 创建樱花花瓣
    const maxPetals = config.maxPetals || this.maxPetals;
    console.log('生成樱花花瓣数量:', maxPetals);
    
    for (let i = 0; i < maxPetals; i++) {
      setTimeout(() => {
        if (this.isRunning) {
          this.createPetal(config);
        }
      }, i * 250);
    }
    
    console.log('冬季樱花效果执行成功！樱花正在飘落...');
  }

  /**
   * 停止冬季樱花效果
   */
  stop() {
    this.isRunning = false;
    
    // 移除所有樱花花瓣
    this.petals.forEach(petal => {
      if (petal.parentNode) {
        petal.parentNode.removeChild(petal);
      }
    });
    
    this.petals = [];
    
    console.log('冬季樱花效果已停止');
  }

  /**
   * 重置冬季樱花效果
   * @param {Object} config - 效果配置
   */
  reset(config = {}) {
    this.stop();
    this.start(config);
  }

  /**
   * 调整樱花花瓣数量
   * @param {number} count - 花瓣数量
   */
  setPetalCount(count) {
    this.maxPetals = count;
    if (this.isRunning) {
      this.reset();
    }
  }
}

// 导出单例实例
const winterSakuraEffect = new WinterSakuraEffect();
export default winterSakuraEffect;
export { WinterSakuraEffect };

// 在浏览器环境中挂载到 window 对象
if (typeof window !== 'undefined') {
  // 挂载 winterSakuraEffect 到 window 对象
  window.winterSakuraEffect = winterSakuraEffect;
  console.log('冬季樱花效果已挂载到 window 对象');
  
  // 在浏览器环境中注册
  window.addEventListener('DOMContentLoaded', () => {
    if (window.Bundle && window.Bundle.effectScheduler) {
      const effectScheduler = window.Bundle.effectScheduler;
      
      // 注册冬季樱花效果处理器
      effectScheduler.registerEffectHandler('winter_sakura', (config) => {
        return new Promise((resolve) => {
          winterSakuraEffect.start(config);
          setTimeout(resolve, 1000);
        });
      });
      
      // 添加冬季樱花效果到冬季效果库
      effectScheduler.addEffect(
        'winter_sakura_effect',
        { type: 'winter_sakura' },
        30,
        'winter',
        'morning'
      );
      
      // 添加冬季樱花效果到下午时段
      effectScheduler.addEffect(
        'winter_sakura_afternoon',
        { type: 'winter_sakura' },
        25,
        'winter',
        'afternoon'
      );
      
      console.log('冬季樱花效果已注册到效果库');
    }
  });
}
