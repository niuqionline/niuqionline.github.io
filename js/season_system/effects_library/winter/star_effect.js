/**
 * 冬季夜晚星光闪烁效果
 * 为冬季夜晚添加安静的星光闪烁效果
 */

class StarEffect {
  constructor() {
    this.stars = [];
    this.maxStars = 50;
    this.isRunning = false;
  }

  /**
   * 创建星星元素
   * @param {Object} config - 星星配置
   * @returns {HTMLElement} 星星元素
   */
  createStar(config = {}) {
    const star = document.createElement('div');
    
    // 设置星星样式
    const size = config.size || Math.random() * 3 + 1;
    const left = Math.random() * 100;
    const top = Math.random() * 100;
    const opacity = Math.random() * 0.8 + 0.2;
    const duration = Math.random() * 3 + 2;
    
    star.style.position = 'fixed';
    star.style.top = `${top}%`;
    star.style.left = `${left}%`;
    star.style.width = `${size}px`;
    star.style.height = `${size}px`;
    star.style.opacity = opacity;
    star.style.pointerEvents = 'none';
    star.style.zIndex = '9998';
    star.style.borderRadius = '50%';
    star.style.backgroundColor = config.color || '#ffffff';
    star.style.boxShadow = '0 0 6px rgba(255, 255, 255, 0.8)';
    star.style.animation = `twinkle ${duration}s ease-in-out infinite alternate`;
    
    // 添加到DOM
    document.body.appendChild(star);
    this.stars.push(star);
    
    return star;
  }

  /**
   * 创建闪烁动画
   */
  createAnimation() {
    // 检查是否已经存在动画
    if (!document.getElementById('star-twinkle-animation')) {
      const style = document.createElement('style');
      style.id = 'star-twinkle-animation';
      style.textContent = `
        @keyframes twinkle {
          0% {
            opacity: 0.2;
            transform: scale(0.8);
          }
          100% {
            opacity: 1;
            transform: scale(1.2);
          }
        }
      `;
      document.head.appendChild(style);
    }
  }

  /**
   * 启动星光闪烁效果
   * @param {Object} config - 效果配置
   */
  start(config = {}) {
    if (this.isRunning) {
      console.log('星光闪烁效果已经在运行中');
      return;
    }
    
    console.log('开始执行星光闪烁效果...');
    console.log('效果配置:', config);
    
    this.isRunning = true;
    this.createAnimation();
    
    // 创建星星
    const maxStars = config.maxStars || this.maxStars;
    console.log('生成星星数量:', maxStars);
    
    for (let i = 0; i < maxStars; i++) {
      setTimeout(() => {
        if (this.isRunning) {
          this.createStar(config);
        }
      }, i * 50);
    }
    
    console.log('星光闪烁效果执行成功！星星正在闪烁...');
  }

  /**
   * 停止星光闪烁效果
   */
  stop() {
    this.isRunning = false;
    
    // 移除所有星星
    this.stars.forEach(star => {
      if (star.parentNode) {
        star.parentNode.removeChild(star);
      }
    });
    
    this.stars = [];
    
    console.log('星光闪烁效果已停止');
  }

  /**
   * 重置星光闪烁效果
   * @param {Object} config - 效果配置
   */
  reset(config = {}) {
    this.stop();
    this.start(config);
  }

  /**
   * 调整星星数量
   * @param {number} count - 星星数量
   */
  setStarCount(count) {
    this.maxStars = count;
    if (this.isRunning) {
      this.reset();
    }
  }
}

// 导出单例实例
const starEffect = new StarEffect();
export default starEffect;
export { StarEffect };

// 在浏览器环境中挂载到 window 对象
if (typeof window !== 'undefined') {
  // 挂载 starEffect 到 window 对象
  window.starEffect = starEffect;
  console.log('星光闪烁效果已挂载到 window 对象');
  
  // 在浏览器环境中注册
  window.addEventListener('DOMContentLoaded', () => {
    if (window.Bundle && window.Bundle.effectScheduler) {
      const effectScheduler = window.Bundle.effectScheduler;
      
      // 注册星光闪烁效果处理器
      effectScheduler.registerEffectHandler('star_twinkle', (config) => {
        return new Promise((resolve) => {
          starEffect.start(config);
          setTimeout(resolve, 500); // 延迟0.5秒后 resolve，让效果有时间启动
        });
      });
      
      // 添加星光闪烁效果到冬季效果库
      effectScheduler.addEffect(
        'winter_star_effect',
        { type: 'star_twinkle' },
        10, // 比重
        'winter', // 季节
        'night' // 时段
      );
      
      console.log('星光闪烁效果已注册到效果库');
    }
  });
}
