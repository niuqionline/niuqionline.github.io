/**
 * 四季系统主入口文件
 * 提供系统核心功能的统一访问接口
 */

// 引入时间管理器
import timeManager from './season_manager/time_manager';

// 引入时间检测模块
import timeDetection from './season_manager/time_detection';

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

/**
 * 测试函数
 * 用于验证系统功能
 */
export function test() {
  console.log('=== 四季系统测试 ===\n');
  
  // 测试获取当前时间信息
  console.log('1. 获取当前时间信息:');
  const timeInfo = seasonSystem.getCurrentTimeInfo();
  console.log('当前时间:', timeInfo.formattedTime);
  console.log('当前季节:', timeInfo.season.chineseName, '(', timeInfo.season.name, ')');
  console.log('当前时段:', timeInfo.timePeriod.chineseName, '(', timeInfo.timePeriod.name, ')');
  
  // 测试添加监听器
  console.log('\n2. 测试监听器功能:');
  const listenerId = seasonSystem.addTimeListener('minuteChange', (eventData) => {
    console.log('分钟变化:', eventData.timeInfo.formattedTime);
  });
  console.log('已添加分钟变化监听器，ID:', listenerId);
  
  // 测试启动监控
  console.log('\n3. 启动时间监控:');
  seasonSystem.startTimeMonitoring();
  
  // 测试定时任务
  console.log('\n4. 测试定时任务:');
  seasonSystem.setTimeout('testTask', () => {
    console.log('定时任务执行成功！');
  }, 2000);
  
  console.log('\n=== 测试完成 ===');
  console.log('系统将持续监控时间变化，按 Ctrl+C 停止');
  
  // 5秒后停止测试
  setTimeout(() => {
    console.log('\n=== 停止测试 ===');
    seasonSystem.stopTimeMonitoring();
    seasonSystem.clearAllTimers();
    console.log('时间监控已停止');
    console.log('所有定时任务已清除');
  }, 5000);
}
test();
// 如果直接运行此文件，则执行测试
// if (require.main === module) {
//   module.exports.test();
// }