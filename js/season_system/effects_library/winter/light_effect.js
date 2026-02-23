/**
 * 冬季夜晚孔明灯效果
 * 为冬季夜晚添加向上飘动的孔明灯效果
 */

class LightEffect {
  constructor() {
    this.lights = [];
    this.maxLights = 30;
    this.isRunning = false;
  }

  /**
   * 创建孔明灯元素
   * @param {Object} config - 孔明灯配置
   * @returns {HTMLElement} 孔明灯元素
   */
  /**
   * 获取随机祝福文字
   * @returns {string} 两字祝福
   */
  getRandomBlessing() {
    const blessings = [
      '平安', '幸福', '健康', '快乐',
      '吉祥', '如意', '发财', '顺利',
      '成功', '美满', '和谐', '安康',
      '幸运', '繁荣', 
    ];
    return blessings[Math.floor(Math.random() * blessings.length)];
  }

  createLight(config = {}) {
    // 创建孔明灯容器
    const lightContainer = document.createElement('div');
    
    // 设置孔明灯容器样式
    const size = Math.random() * 40 + 20;
    const left = Math.random() * 100;
    const top = '100%'; // 从屏幕底部开始
    const opacity = Math.random() * 0.5 + 0.3; // 透明度范围 0.3-0.8
    const floatDuration = Math.random() * 20 + 15;
    const delay = Math.random() * 5;
    
    lightContainer.style.position = 'fixed';
    lightContainer.style.top = top;
    lightContainer.style.left = `${left}%`;
    lightContainer.style.width = `${size}px`;
    lightContainer.style.height = `${size}px`;
    lightContainer.style.opacity = opacity;
    lightContainer.style.pointerEvents = 'none';
    lightContainer.style.zIndex = '9997';
    lightContainer.style.backgroundColor = 'transparent';
    lightContainer.style.border = 'none';
    lightContainer.style.animation = `float ${floatDuration}s linear infinite`;
    lightContainer.style.animationDelay = `${delay}s`;
    
    // 使用img元素直接作为孔明灯
    const img = document.createElement('img');
    img.src = '/img/kmd.png';
    img.style.width = '100%';
    img.style.height = '100%';
    img.style.display = 'block';
    img.style.backgroundColor = '';
    img.style.border = 'none';
    img.style.outline = 'none';
    img.style.padding = '0';
    img.style.margin = '0';
    img.style.filter = 'drop-shadow(0 0 6px rgba(255, 255, 200, 0.7))';
    img.style.animation = `flicker ${Math.random() * 4 + 3}s ease-in-out infinite alternate`;
    lightContainer.appendChild(img);
    
    // 创建祝福文字
    const blessing = document.createElement('div');
    const blessingText = this.getRandomBlessing();
    blessing.textContent = blessingText;
    blessing.style.position = 'absolute';
    blessing.style.top = '50%';
    blessing.style.left = '50%';
    blessing.style.transform = 'translate(-50%, -50%)';
    blessing.style.fontSize = `${size * 0.2}px`;
    blessing.style.color = '#ffd700';
    blessing.style.fontWeight = 'bold';
    blessing.style.textShadow = '1px 1px 2px rgba(0, 0, 0, 0.8)';
    blessing.style.textAlign = 'center';
    blessing.style.pointerEvents = 'none';
    lightContainer.appendChild(blessing);
    
    // 创建下方灯光
    const bottomLight = document.createElement('div');
    const lightSize = size * 0.25;
    bottomLight.style.position = 'absolute';
    bottomLight.style.bottom = `-${lightSize * 0.6}px`;
    bottomLight.style.left = '50%';
    bottomLight.style.transform = 'translateX(-50%)';
    bottomLight.style.width = `${lightSize}px`;
    bottomLight.style.height = `${lightSize}px`;
    bottomLight.style.backgroundColor = 'rgba(255, 215, 0, 0.7)';
    bottomLight.style.borderRadius = '50%';
    bottomLight.style.boxShadow = '0 0 8px rgba(255, 215, 0, 0.8), 0 0 15px rgba(255, 215, 0, 0.5)';
    bottomLight.style.animation = `lightFlicker ${Math.random() * 3 + 2}s ease-in-out infinite alternate`;
    bottomLight.style.pointerEvents = 'none';
    lightContainer.appendChild(bottomLight);
    
    // 添加到DOM
    document.body.appendChild(lightContainer);
    this.lights.push(lightContainer);
    
    return lightContainer;
  }



  /**
   * 创建闪烁和飘动动画
   */
  createAnimation() {
    // 检查是否已经存在动画
    if (!document.getElementById('light-flicker-animation')) {
      const style = document.createElement('style');
      style.id = 'light-flicker-animation';
      style.textContent = `
        @keyframes flicker {
          0% {
            opacity: 0.6;
            transform: scale(0.95);
          }
          100% {
            opacity: 1;
            transform: scale(1.05);
          }
        }
        
        @keyframes lightFlicker {
          0% {
            opacity: 0.6;
            transform: scale(0.9);
            box-shadow: 0 0 8px rgba(255, 215, 0, 0.8), 0 0 15px rgba(255, 215, 0, 0.5);
          }
          100% {
            opacity: 1;
            transform: scale(1.1);
            box-shadow: 0 0 12px rgba(255, 215, 0, 1), 0 0 25px rgba(255, 215, 0, 0.8);
          }
        }
        
        @keyframes float {
          0% {
            transform: translateY(0) translateX(0) rotate(0deg);
            opacity: 0.5;
          }
          25% {
            transform: translateY(-25vh) translateX(8px) rotate(1deg);
            opacity: 0.7;
          }
          50% {
            transform: translateY(-50vh) translateX(-8px) rotate(-1deg);
            opacity: 0.8;
          }
          75% {
            transform: translateY(-75vh) translateX(4px) rotate(0.5deg);
            opacity: 0.7;
          }
          100% {
            transform: translateY(-100vh) translateX(-4px) rotate(0deg);
            opacity: 0.4;
          }
        }
      `;
      document.head.appendChild(style);
    }
  }

  /**
   * 启动孔明灯效果
   * @param {Object} config - 效果配置
   */
  start(config = {}) {
    if (this.isRunning) {
      console.log('孔明灯效果已经在运行中');
      return;
    }
    
    console.log('开始执行孔明灯效果...');
    console.log('效果配置:', config);
    
    this.isRunning = true;
    this.createAnimation();
    
    // 创建孔明灯
    const maxLights = config.maxLights || this.maxLights;
    console.log('生成孔明灯数量:', maxLights);
    
    for (let i = 0; i < maxLights; i++) {
      setTimeout(() => {
        if (this.isRunning) {
          this.createLight(config);
        }
      }, i * 100);
    }
    
    console.log('孔明灯效果执行成功！孔明灯正在飘动...');
  }

  /**
   * 停止孔明灯效果
   */
  stop() {
    this.isRunning = false;
    
    // 移除所有孔明灯
    this.lights.forEach(light => {
      if (light.parentNode) {
        light.parentNode.removeChild(light);
      }
    });
    
    this.lights = [];
    
    console.log('孔明灯效果已停止');
  }

  /**
   * 重置孔明灯效果
   * @param {Object} config - 效果配置
   */
  reset(config = {}) {
    this.stop();
    this.start(config);
  }

  /**
   * 调整孔明灯数量
   * @param {number} count - 孔明灯数量
   */
  setLightCount(count) {
    this.maxLights = count;
    if (this.isRunning) {
      this.reset();
    }
  }
}

// 导出单例实例
const lightEffect = new LightEffect();
export default lightEffect;
export { LightEffect };

// 在浏览器环境中挂载到 window 对象
if (typeof window !== 'undefined') {
  // 挂载 lightEffect 到 window 对象
  window.lightEffect = lightEffect;
  console.log('孔明灯效果已挂载到 window 对象');
  
  // 在浏览器环境中注册
  window.addEventListener('DOMContentLoaded', () => {
    if (window.Bundle && window.Bundle.effectScheduler) {
      const effectScheduler = window.Bundle.effectScheduler;
      
      // 注册孔明灯效果处理器
      effectScheduler.registerEffectHandler('flying_lights', (config) => {
        return new Promise((resolve) => {
          lightEffect.start(config);
          setTimeout(resolve, 500); // 延迟0.5秒后 resolve，让效果有时间启动
        });
      });
      
      // 添加孔明灯效果到冬季效果库
      effectScheduler.addEffect(
        'winter_flying_light_effect',
        { type: 'flying_lights' },
        60, // 比重
        'winter', // 季节
        'evening' // 时段
      );
      
      console.log('孔明灯效果已注册到效果库');
    }
  });
}
