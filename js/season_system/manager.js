/**
 * 四季系统主入口文件
 * 提供系统核心功能的统一访问接口
 */

// 引入时间管理器
import timeManager from './season_manager/time_manager';

// 引入时间检测模块
import timeDetection from './season_manager/time_detection/time_detection';

/**
 * 效果调度器模块入口
 * 导出效果比重管理相关的组件
 */
import weightManager from './season_manager/effect_scheduler/priority_manager.js';
import effectScheduler from './season_manager/effect_scheduler/effect_scheduler.js';

/**
 * 效果库模块
 */
import flowerEffect from './effects_library/spring/floawer.js';
import winterNightEffect from './effects_library/winter/night_effect.js';

/**
 * 四季系统主类
 */
class SeasonSystem {
  /**
   * 构造函数
   */
  constructor() {
    this.timeManager = timeManager;
    this.timeDetection = timeDetection;
    this.weightManager = weightManager;
    this.effectScheduler = effectScheduler;
    this.effects = {
      flower: flowerEffect,
      winterNight: winterNightEffect
    };
    this.isMonitoringStarted = false;
   }

  /**
   * 获取时间管理器
   * @returns {Object} 时间管理器实例
   */
  getTimeManager() {
    return this.timeManager;
  }

  /**
   * 获取时间检测模块
   * @returns {Object} 时间检测模块实例
   */
  getTimeDetection() {
    return this.timeDetection;
  }

  /**
   * 获取当前时间信息
   * @returns {Object} 包含时间、季节和时段信息的对象
   */
  getCurrentTimeInfo() {
    return this.timeManager.getCurrentTimeInfo();
  }

  /**
   * 启动时间监控
   * @param {number} interval - 监控间隔（毫秒），默认1000ms
   */
  startTimeMonitoring(interval = 1000) {
    if (!this.isMonitoringStarted) {
      this.timeManager.startMonitoring(interval);
      this.isMonitoringStarted = true;
      console.log('四季系统：时间监控已启动');
    }
  }

  /**
   * 停止时间监控
   */
  stopTimeMonitoring() {
    if (this.isMonitoringStarted) {
      this.timeManager.stopMonitoring();
      this.isMonitoringStarted = false;
      console.log('四季系统：时间监控已停止');
    }
  }

  /**
   * 添加时间监听器
   * @param {string} eventType - 事件类型
   * @param {Function} callback - 回调函数
   * @returns {string} 监听器ID
   */
  addTimeListener(eventType, callback) {
    return this.timeManager.addListener(eventType, callback);
  }

  /**
   * 移除时间监听器
   * @param {string} eventType - 事件类型
   * @param {string} listenerId - 监听器ID
   * @returns {boolean} 是否成功移除
   */
  removeTimeListener(eventType, listenerId) {
    return this.timeManager.removeListener(eventType, listenerId);
  }

  /**
   * 执行定时任务
   * @param {string} taskName - 任务名称
   * @param {Function} callback - 回调函数
   * @param {number} delay - 延迟时间（毫秒）
   * @returns {string} 任务ID
   */
  setTimeout(taskName, callback, delay) {
    return this.timeManager.setTimeout(taskName, callback, delay);
  }

  /**
   * 执行重复定时任务
   * @param {string} taskName - 任务名称
   * @param {Function} callback - 回调函数
   * @param {number} interval - 间隔时间（毫秒）
   * @returns {string} 任务ID
   */
  setInterval(taskName, callback, interval) {
    return this.timeManager.setInterval(taskName, callback, interval);
  }

  /**
   * 清除定时任务
   * @param {string} taskName - 任务名称
   * @returns {boolean} 是否成功清除
   */
  clearTimer(taskName) {
    return this.timeManager.clearTimer(taskName);
  }

  /**
   * 清除所有定时任务
   */
  clearAllTimers() {
    this.timeManager.clearAllTimers();
  }

  /**
   * 获取系统状态
   * @returns {Object} 系统状态信息
   */
  getStatus() {
    return {
      isMonitoringStarted: this.isMonitoringStarted,
      currentTimeInfo: this.getCurrentTimeInfo(),
      timers: this.timeManager.getAllTimers(),
      listeners: this.timeManager.getAllListeners()
    };
  }

  /**
   * 销毁系统实例
   */
  destroy() {
    this.stopTimeMonitoring();
    this.clearAllTimers();
    console.log('四季系统：实例已销毁');
  }

  /**
   * 获取效果库
   * @returns {Object} 效果库对象
   */
  getEffects() {
    return this.effects;
  }

  /**
   * 获取指定效果
   * @param {string} effectName - 效果名称
   * @returns {Object} 效果实例
   */
  getEffect(effectName) {
    return this.effects[effectName];
  }
}

// 创建系统实例
const seasonSystem = new SeasonSystem();

// 导出系统实例
export default seasonSystem;

// 导出系统类（用于创建新实例）
const _SeasonSystem = SeasonSystem;
export { _SeasonSystem as SeasonSystem };

// 导出时间相关模块（方便直接访问）
const _timeManager = timeManager;
export { _timeManager as timeManager };
const _timeDetection = timeDetection;
export { _timeDetection as timeDetection };

// 导出效果相关模块（方便直接访问）
const _weightManager = weightManager;
export { _weightManager as weightManager };
const _effectScheduler = effectScheduler;
export { _effectScheduler as effectScheduler };

// 导出效果库（方便直接访问）
const _flowerEffect = flowerEffect;
export { _flowerEffect as flowerEffect };
const _winterNightEffect = winterNightEffect;
export { _winterNightEffect as winterNightEffect };

// 导出效果库集合
export const effectsLibrary = {
  flower: flowerEffect,
  winterNight: winterNightEffect
};