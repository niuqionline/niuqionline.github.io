/**
 * 冬季白天效果
 * 为冬季白天添加太阳、阳光、雪花、雪人和观雪小人效果
 */

class WinterDayEffect {
  constructor() {
    this.elements = [];
    this.isRunning = false;
  }

  /**
   * 创建太阳元素
   * @returns {HTMLElement} 太阳元素
   */
  createSun() {
    const sun = document.createElement('div');
    
    // 设置太阳样式
    sun.style.position = 'fixed';
    sun.style.top = '60px';
    sun.style.right = '40px';
    sun.style.width = '40px';
    sun.style.height = '40px';
    sun.style.backgroundColor = '#fffacd';
    sun.style.borderRadius = '50%';
    sun.style.boxShadow = '0 0 40px rgba(255, 255, 255, 0.9), 0 0 80px rgba(255, 250, 205, 0.7), 0 0 120px rgba(255, 248, 220, 0.5), 0 0 160px rgba(255, 245, 238, 0.3)';
    sun.style.zIndex = '9995';
    sun.style.animation = 'sunGlow 4s ease-in-out infinite alternate';
    
    document.body.appendChild(sun);
    this.elements.push(sun);
    
    return sun;
  }


  /**
   * 创建雪花元素
   * @param {Object} config - 雪花配置
   * @returns {HTMLElement} 雪花元素
   */
  createSnowflake(config = {}) {
    const snowflake = document.createElement('div');
    snowflake.className = 'snowflake';
    
    // 设置雪花样式
    const size = config.size || Math.random() * 12 + 8;
    const left = Math.random() * 100;
    const duration = config.duration || Math.random() * 10 + 8;
    const delay = Math.random() * 5;
    const opacity = Math.random() * 0.7 + 0.3;
    
    snowflake.style.position = 'fixed';
    snowflake.style.top = '-20px';
    snowflake.style.left = `${left}%`;
    snowflake.style.width = `${size}px`;
    snowflake.style.height = `${size}px`;
    snowflake.style.opacity = opacity;
    snowflake.style.pointerEvents = 'none';
    snowflake.style.zIndex = '9996';
    snowflake.style.animation = `daySnowfall ${duration}s linear infinite`;
    snowflake.style.animationDelay = `${delay}s`;
    
    // 创建雪花形状
    const snowflakeInner = document.createElement('div');
    snowflakeInner.style.width = '100%';
    snowflakeInner.style.height = '100%';
    snowflakeInner.style.position = 'relative';
    snowflakeInner.style.animation = 'snowflakeRotate 3s linear infinite';
    
    // 创建六个花瓣
    for (let i = 0; i < 6; i++) {
      const petal = document.createElement('div');
      petal.style.position = 'absolute';
      petal.style.width = '40%';
      petal.style.height = '40%';
      petal.style.backgroundColor = '#ffffff';
      petal.style.borderRadius = '50%';
      petal.style.left = '50%';
      petal.style.top = '50%';
      petal.style.transform = `translate(-50%, -50%) rotate(${i * 60}deg)`;
      petal.style.boxShadow = '0 0 3px rgba(255, 255, 255, 0.8)';
      snowflakeInner.appendChild(petal);
      
      // 创建花瓣尖端
      const petalTip = document.createElement('div');
      petalTip.style.position = 'absolute';
      petalTip.style.width = '60%';
      petalTip.style.height = '60%';
      petalTip.style.backgroundColor = '#ffffff';
      petalTip.style.borderRadius = '50%';
      petalTip.style.left = '50%';
      petalTip.style.top = '-20%';
      petalTip.style.transform = 'translate(-50%, -50%)';
      petal.appendChild(petalTip);
    }
    
    snowflake.appendChild(snowflakeInner);
    document.body.appendChild(snowflake);
    this.elements.push(snowflake);
    
    return snowflake;
  }




  /**
   * 创建动画
   */
  createAnimation() {
    // 检查是否已经存在动画
    if (!document.getElementById('winter-day-animation')) {
      const style = document.createElement('style');
      style.id = 'winter-day-animation';
      style.textContent = `
        @keyframes sunGlow {
          0% {
            box-shadow: 0 0 60px rgba(255, 255, 255, 0.8), 0 0 120px rgba(255, 250, 205, 0.6), 0 0 180px rgba(255, 248, 220, 0.4), 0 0 240px rgba(255, 245, 238, 0.2);
          }
          100% {
            box-shadow: 0 0 100px rgba(255, 255, 255, 1), 0 0 200px rgba(255, 250, 205, 0.8), 0 0 300px rgba(255, 248, 220, 0.6), 0 0 400px rgba(255, 245, 238, 0.4);
          }
        }
        
        @keyframes daySnowfall {
          0% {
            transform: translateY(-20px) translateX(0) rotate(0deg);
            opacity: 0.3;
          }
          10% {
            opacity: 0.7;
          }
          25% {
            transform: translateY(25vh) translateX(30px) rotate(90deg);
            opacity: 0.7;
          }
          50% {
            transform: translateY(50vh) translateX(-20px) rotate(180deg);
            opacity: 0.7;
          }
          75% {
            transform: translateY(75vh) translateX(40px) rotate(270deg);
            opacity: 0.7;
          }
          90% {
            opacity: 0.7;
          }
          100% {
            transform: translateY(100vh) translateX(-30px) rotate(360deg);
            opacity: 0.3;
          }
        }
        
        @keyframes snowflakeRotate {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `;
      document.head.appendChild(style);
    }
  }

  /**
   * 启动冬季白天效果
   * @param {Object} config - 效果配置
   */
  start(config = {}) {
    if (this.isRunning) {
      console.log('冬季白天效果已经在运行中');
      return;
    }
    
    console.log('开始执行冬季白天效果...');
    console.log('效果配置:', config);
    
    this.isRunning = true;
    this.createAnimation();
    
    // 创建太阳
    this.createSun();
    
    // 创建雪花
    const snowflakeCount = config.snowflakeCount || 30;
    console.log('生成雪花数量:', snowflakeCount);
    
    for (let i = 0; i < snowflakeCount; i++) {
      setTimeout(() => {
        if (this.isRunning) {
          this.createSnowflake(config);
        }
      }, i * 50);
    }
    
    console.log('冬季白天效果执行成功！太阳和雪花正在显示...');
  }

  /**
   * 停止冬季白天效果
   */
  stop() {
    this.isRunning = false;
    
    // 移除所有元素
    this.elements.forEach(element => {
      if (element.parentNode) {
        element.parentNode.removeChild(element);
      }
    });
    
    this.elements = [];
    
    console.log('冬季白天效果已停止');
  }

  /**
   * 重置冬季白天效果
   * @param {Object} config - 效果配置
   */
  reset(config = {}) {
    this.stop();
    this.start(config);
  }
}

// 导出单例实例
const winterDayEffect = new WinterDayEffect();
export default winterDayEffect;
export { WinterDayEffect };

// 在浏览器环境中挂载到 window 对象
if (typeof window !== 'undefined') {
  // 挂载 winterDayEffect 到 window 对象
  window.winterDayEffect = winterDayEffect;
  console.log('冬季白天效果已挂载到 window 对象');
  
  // 在浏览器环境中注册
  window.addEventListener('DOMContentLoaded', () => {
    if (window.Bundle && window.Bundle.effectScheduler) {
      const effectScheduler = window.Bundle.effectScheduler;
      
      // 注册冬季白天效果处理器
      effectScheduler.registerEffectHandler('winter_day', (config) => {
        return new Promise((resolve) => {
          winterDayEffect.start(config);
          setTimeout(resolve, 1000); // 延迟1秒后 resolve，让效果有时间启动
        });
      });
      
      // 添加冬季白天效果到冬季效果库（对应上午、中午、下午时段）
      effectScheduler.addEffect(
        'winter_morning_effect',
        { type: 'winter_day' },
        60, // 比重
        'winter', // 季节
        'morning' // 时段
      );
      
      effectScheduler.addEffect(
        'winter_noon_effect',
        { type: 'winter_day' },
        60, // 比重
        'winter', // 季节
        'noon' // 时段
      );
      
      effectScheduler.addEffect(
        'winter_afternoon_effect',
        { type: 'winter_day' },
        60, // 比重
        'winter', // 季节
        'afternoon' // 时段
      );

      effectScheduler.addEffect(
        'winter_evening_effect',
        { type: 'winter_day' },
        60, // 比重
        'winter', // 季节
        'night' // 时段
      );
      
      console.log('冬季白天效果已注册到效果库');
    }
  });
}
