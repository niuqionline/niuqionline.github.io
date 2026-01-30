/**
 * 时间管理器
 * 作为上层模块调用时间检测模块中的功能，并提供定时任务和时间监听等高级功能
 */

import timeDetection from './time_detection';

class TimeManager {
  constructor() {
    this.timeDetection = timeDetection;
    this.timers = new Map(); // 存储定时任务
    this.listeners = new Map(); // 存储时间监听器
    this.lastTimeInfo = null; // 上次的时间信息
  }

  /**
   * 获取当前时间信息
   * @returns {Object} 包含时间、季节和时段信息的对象
   */
  getCurrentTimeInfo() {
    const timeInfo = this.timeDetection.getCurrentTimeInfo();
    this.lastTimeInfo = timeInfo;
    return timeInfo;
  }

  /**
   * 获取时间检测模块
   * @returns {Object} 时间检测模块实例
   */
  getTimeDetection() {
    return this.timeDetection;
  }

  /**
   * 执行定时任务
   * @param {string} taskName - 任务名称
   * @param {Function} callback - 回调函数
   * @param {number} delay - 延迟时间（毫秒）
   * @returns {string} 任务ID
   */
  setTimeout(taskName, callback, delay) {
    const timerId = setTimeout(() => {
      callback();
      this.timers.delete(taskName);
    }, delay);

    this.timers.set(taskName, timerId);
    return taskName;
  }

  /**
   * 执行重复定时任务
   * @param {string} taskName - 任务名称
   * @param {Function} callback - 回调函数
   * @param {number} interval - 间隔时间（毫秒）
   * @returns {string} 任务ID
   */
  setInterval(taskName, callback, interval) {
    const timerId = setInterval(callback, interval);
    this.timers.set(taskName, timerId);
    return taskName;
  }

  /**
   * 清除定时任务
   * @param {string} taskName - 任务名称
   * @returns {boolean} 是否成功清除
   */
  clearTimer(taskName) {
    const timerId = this.timers.get(taskName);
    if (timerId) {
      clearTimeout(timerId);
      clearInterval(timerId);
      this.timers.delete(taskName);
      return true;
    }
    return false;
  }

  /**
   * 清除所有定时任务
   */
  clearAllTimers() {
    for (const [taskName, timerId] of this.timers) {
      clearTimeout(timerId);
      clearInterval(timerId);
    }
    this.timers.clear();
  }

  /**
   * 添加时间监听器
   * @param {string} eventType - 事件类型（seasonChange, timePeriodChange, minuteChange等）
   * @param {Function} callback - 回调函数
   * @returns {string} 监听器ID
   */
  addListener(eventType, callback) {
    if (!this.listeners.has(eventType)) {
      this.listeners.set(eventType, new Map());
    }

    const listenerId = `${eventType}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    this.listeners.get(eventType).set(listenerId, callback);

    return listenerId;
  }

  /**
   * 移除时间监听器
   * @param {string} eventType - 事件类型
   * @param {string} listenerId - 监听器ID
   * @returns {boolean} 是否成功移除
   */
  removeListener(eventType, listenerId) {
    if (this.listeners.has(eventType)) {
      const eventListeners = this.listeners.get(eventType);
      if (eventListeners.has(listenerId)) {
        eventListeners.delete(listenerId);
        return true;
      }
    }
    return false;
  }

  /**
   * 移除所有指定类型的监听器
   * @param {string} eventType - 事件类型
   */
  removeAllListeners(eventType) {
    if (this.listeners.has(eventType)) {
      this.listeners.get(eventType).clear();
    }
  }

  /**
   * 触发时间事件
   * @param {string} eventType - 事件类型
   * @param {Object} eventData - 事件数据
   */
  emit(eventType, eventData) {
    if (this.listeners.has(eventType)) {
      const eventListeners = this.listeners.get(eventType);
      for (const callback of eventListeners.values()) {
        callback(eventData);
      }
    }
  }

  /**
   * 启动时间监控
   * @param {number} interval - 监控间隔（毫秒），默认1000ms
   */
  startMonitoring(interval = 1000) {
    this.setInterval('timeMonitoring', () => {
      const currentTimeInfo = this.getCurrentTimeInfo();

      // 检查季节变化
      if (this.lastTimeInfo && this.lastTimeInfo.season.name !== currentTimeInfo.season.name) {
        this.emit('seasonChange', {
          oldSeason: this.lastTimeInfo.season,
          newSeason: currentTimeInfo.season,
          time: currentTimeInfo.time
        });
      }

      // 检查时段变化
      if (this.lastTimeInfo && this.lastTimeInfo.timePeriod.name !== currentTimeInfo.timePeriod.name) {
        this.emit('timePeriodChange', {
          oldTimePeriod: this.lastTimeInfo.timePeriod,
          newTimePeriod: currentTimeInfo.timePeriod,
          time: currentTimeInfo.time
        });
      }

      // 检查分钟变化
      if (!this.lastTimeInfo || this.lastTimeInfo.components.minute !== currentTimeInfo.components.minute) {
        this.emit('minuteChange', {
          timeInfo: currentTimeInfo
        });
      }

      // 检查小时变化
      if (!this.lastTimeInfo || this.lastTimeInfo.components.hour !== currentTimeInfo.components.hour) {
        this.emit('hourChange', {
          timeInfo: currentTimeInfo
        });
      }

      // 检查日期变化
      if (!this.lastTimeInfo || this.lastTimeInfo.components.day !== currentTimeInfo.components.day) {
        this.emit('dayChange', {
          timeInfo: currentTimeInfo
        });
      }

    }, interval);
  }

  /**
   * 停止时间监控
   */
  stopMonitoring() {
    this.clearTimer('timeMonitoring');
  }

  /**
   * 获取所有定时任务
   * @returns {Array} 定时任务列表
   */
  getAllTimers() {
    return Array.from(this.timers.keys());
  }

  /**
   * 获取所有监听器
   * @returns {Object} 监听器列表
   */
  getAllListeners() {
    const result = {};
    for (const [eventType, eventListeners] of this.listeners) {
      result[eventType] = Array.from(eventListeners.keys());
    }
    return result;
  }

  /**
   * 销毁时间管理器
   */
  destroy() {
    this.clearAllTimers();
    this.listeners.clear();
    this.lastTimeInfo = null;
  }
}

export default new TimeManager();