/**
 * 飘花效果
 * 春季特有的视觉效果
 */

class FlowerEffect {
  constructor() {
    this.petals = [];
    this.maxPetals = 50;
    this.isRunning = false;
  }

  /**
   * 创建花瓣元素
   * @param {Object} config - 花瓣配置
   * @returns {HTMLElement} 花瓣元素
   */
  createPetal(config = {}) {
    const petal = document.createElement('div');
    
    // 设置花瓣样式
    const size = config.size || Math.random() * 10 + 5;
    const left = Math.random() * 100;
    const duration = config.duration || Math.random() * 10 + 10;
    const delay = Math.random() * 5;
    const opacity = Math.random() * 0.8 + 0.2;
    const rotation = Math.random() * 360;
    const rotationSpeed = Math.random() * 10 - 5;
    
    petal.style.position = 'fixed';
    petal.style.top = '-20px';
    petal.style.left = `${left}%`;
    petal.style.width = `${size}px`;
    petal.style.height = `${size}px`;
    petal.style.opacity = opacity;
    petal.style.pointerEvents = 'none';
    petal.style.zIndex = '9999';
    petal.style.borderRadius = '150% 0 150% 0';
    petal.style.backgroundColor = config.color || '#ffb6c1';
    petal.style.transform = `rotate(${rotation}deg)`;
    petal.style.animation = `falling ${duration}s linear infinite`;
    petal.style.animationDelay = `${delay}s`;
    
    // 添加到DOM
    document.body.appendChild(petal);
    this.petals.push(petal);
    
    return petal;
  }

  /**
   * 创建飘落动画
   */
  createAnimation() {
    // 检查是否已经存在动画
    if (!document.getElementById('flower-animation-style')) {
      const style = document.createElement('style');
      style.id = 'flower-animation-style';
      style.textContent = `
        @keyframes falling {
          0% {
            transform: translateY(-20px) rotate(0deg);
            opacity: 0.8;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0;
          }
        }
      `;
      document.head.appendChild(style);
    }
  }

  /**
   * 启动飘花效果
   * @param {Object} config - 效果配置
   */
  start(config = {}) {
    if (this.isRunning) return;
    
    this.isRunning = true;
    this.createAnimation();
    
    // 创建花瓣
    const maxPetals = config.maxPetals || this.maxPetals;
    
    for (let i = 0; i < maxPetals; i++) {
      setTimeout(() => {
        if (this.isRunning) {
          this.createPetal(config);
        }
      }, i * 200);
    }
    
    console.log('飘花效果已启动');
  }

  /**
   * 停止飘花效果
   */
  stop() {
    this.isRunning = false;
    
    // 移除所有花瓣
    this.petals.forEach(petal => {
      if (petal.parentNode) {
        petal.parentNode.removeChild(petal);
      }
    });
    
    this.petals = [];
    
    console.log('飘花效果已停止');
  }

  /**
   * 重置飘花效果
   * @param {Object} config - 效果配置
   */
  reset(config = {}) {
    this.stop();
    this.start(config);
  }

  /**
   * 调整花瓣数量
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
const flowerEffect = new FlowerEffect();
export default flowerEffect;
export { FlowerEffect };

// 注册效果处理器到效果调度器
if (typeof window !== 'undefined') {
  // 在浏览器环境中注册
  window.addEventListener('DOMContentLoaded', () => {
    if (window.Bundle && window.Bundle.effectScheduler) {
      const effectScheduler = window.Bundle.effectScheduler;
      
      // 注册飘花效果处理器
      effectScheduler.registerEffectHandler('flower', (config) => {
        return new Promise((resolve) => {
          flowerEffect.start(config);
          setTimeout(resolve, 1000); // 延迟1秒后 resolve，让效果有时间启动
        });
      });
      
      // 添加飘花效果到春季效果库
      effectScheduler.addEffect(
        'spring_flower',
        { type: 'flower' },
        50, // 比重
        'spring' // 季节
      );
      
      console.log('飘花效果已注册到效果库');
    }
  });
}
