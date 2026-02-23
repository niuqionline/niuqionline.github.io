/**
 * 冬季晚上效果
 * 冬季特有的视觉效果
 */

class WinterNightEffect {
  constructor() {
    this.snowflakes = [];
    this.maxSnowflakes = 100;
    this.isRunning = false;
  }

  /**
   * 创建雪花元素
   * @param {Object} config - 雪花配置
   * @returns {HTMLElement} 雪花元素
   */
  createSnowflake(config = {}) {
    const snowflake = document.createElement('div');
    
    // 设置雪花样式
    const size = config.size || Math.random() * 8 + 2;
    const left = Math.random() * 100;
    const duration = config.duration || Math.random() * 15 + 10;
    const delay = Math.random() * 5;
    const opacity = Math.random() * 0.8 + 0.2;
    const rotation = Math.random() * 360;
    const rotationSpeed = Math.random() * 10 - 5;
    
    snowflake.style.position = 'fixed';
    snowflake.style.top = '-20px';
    snowflake.style.left = `${left}%`;
    snowflake.style.width = `${size}px`;
    snowflake.style.height = `${size}px`;
    snowflake.style.opacity = opacity;
    snowflake.style.pointerEvents = 'none';
    snowflake.style.zIndex = '9999';
    snowflake.style.borderRadius = '50%';
    snowflake.style.backgroundColor = config.color || '#ffffff';
    snowflake.style.boxShadow = '0 0 5px rgba(255, 255, 255, 0.8)';
    snowflake.style.transform = `rotate(${rotation}deg)`;
    snowflake.style.animation = `snowfall ${duration}s linear infinite`;
    snowflake.style.animationDelay = `${delay}s`;
    
    // 添加到DOM
    document.body.appendChild(snowflake);
    this.snowflakes.push(snowflake);
    
    return snowflake;
  }

  /**
   * 创建飘落动画
   */
  createAnimation() {
    // 检查是否已经存在动画
    if (!document.getElementById('snowfall-animation-style')) {
      const style = document.createElement('style');
      style.id = 'snowfall-animation-style';
      style.textContent = `
        @keyframes snowfall {
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
   * 启动冬季晚上效果
   * @param {Object} config - 效果配置
   */
  start(config = {}) {
    if (this.isRunning) {
      console.log('冬季晚上效果已经在运行中');
      return;
    }
    
    console.log('开始执行冬季晚上效果...');
    console.log('效果配置:', config);
    
    this.isRunning = true;
    this.createAnimation();
    
    // 创建雪花
    const maxSnowflakes = config.maxSnowflakes || this.maxSnowflakes;
    console.log('生成雪花数量:', maxSnowflakes);
    
    for (let i = 0; i < maxSnowflakes; i++) {
      setTimeout(() => {
        if (this.isRunning) {
          this.createSnowflake(config);
        }
      }, i * 100);
    }
    
    console.log('冬季晚上效果执行成功！雪花正在飘落...');
  }

  /**
   * 停止冬季晚上效果
   */
  stop() {
    this.isRunning = false;
    
    // 移除所有雪花
    this.snowflakes.forEach(snowflake => {
      if (snowflake.parentNode) {
        snowflake.parentNode.removeChild(snowflake);
      }
    });
    
    this.snowflakes = [];
    
    console.log('冬季晚上效果已停止');
  }

  /**
   * 重置冬季晚上效果
   * @param {Object} config - 效果配置
   */
  reset(config = {}) {
    this.stop();
    this.start(config);
  }

  /**
   * 调整雪花数量
   * @param {number} count - 雪花数量
   */
  setSnowflakeCount(count) {
    this.maxSnowflakes = count;
    if (this.isRunning) {
      this.reset();
    }
  }
}

// 导出单例实例
const winterNightEffect = new WinterNightEffect();
export default winterNightEffect;
export { WinterNightEffect };

// 在浏览器环境中挂载到 window 对象
if (typeof window !== 'undefined') {
  // 挂载 winterNightEffect 到 window 对象
  window.winterNightEffect = winterNightEffect;
  console.log('冬季晚上效果已挂载到 window 对象');
  
  // 在浏览器环境中注册
  window.addEventListener('DOMContentLoaded', () => {
    if (window.Bundle && window.Bundle.effectScheduler) {
      const effectScheduler = window.Bundle.effectScheduler;
      
      // 注册冬季晚上效果处理器
      effectScheduler.registerEffectHandler('winter_night', (config) => {
        return new Promise((resolve) => {
          winterNightEffect.start(config);
          setTimeout(resolve, 1000); // 延迟1秒后 resolve，让效果有时间启动
        });
      });
      
      // 添加冬季晚上效果到冬季效果库
      effectScheduler.addEffect(
        'winter_night_effect',
        { type: 'winter_night' },
        10, // 比重
        'winter', // 季节
        'night' // 时段
      );
      
      console.log('冬季晚上效果已注册到效果库');
    }
  });
}
