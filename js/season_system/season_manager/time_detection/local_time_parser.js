/**
 * 本地时间解析模块
 * 负责解析本地时间，提供时间相关的基础功能
 */

class LocalTimeParser {
  /**
   * 获取当前本地时间
   * @returns {Date} 当前本地时间对象
   */
  getCurrentTime() {
    return new Date();
  }

  /**
   * 获取时间的各个部分
   * @param {Date} date - 可选的日期对象，默认使用当前时间
   * @returns {Object} 包含时间各个部分的对象
   */
  getTimeComponents(date = new Date()) {
    return {
      year: date.getFullYear(),
      month: date.getMonth() + 1, // 月份从0开始，所以+1
      day: date.getDate(),
      hour: date.getHours(),
      minute: date.getMinutes(),
      second: date.getSeconds(),
      millisecond: date.getMilliseconds(),
      dayOfWeek: date.getDay() // 0-6，0表示星期日
    };
  }

  /**
   * 格式化时间
   * @param {Date} date - 可选的日期对象，默认使用当前时间
   * @param {string} format - 格式化字符串，默认 'YYYY-MM-DD HH:mm:ss'
   * @returns {string} 格式化后的时间字符串
   */
  formatTime(date = new Date(), format = 'YYYY-MM-DD HH:mm:ss') {
    const components = this.getTimeComponents(date);
    
    return format
      .replace('YYYY', components.year)
      .replace('MM', String(components.month).padStart(2, '0'))
      .replace('DD', String(components.day).padStart(2, '0'))
      .replace('HH', String(components.hour).padStart(2, '0'))
      .replace('mm', String(components.minute).padStart(2, '0'))
      .replace('ss', String(components.second).padStart(2, '0'));
  }

  /**
   * 获取时间戳
   * @param {Date} date - 可选的日期对象，默认使用当前时间
   * @returns {number} 时间戳（毫秒）
   */
  getTimestamp(date = new Date()) {
    return date.getTime();
  }

  /**
   * 从时间戳创建日期对象
   * @param {number} timestamp - 时间戳（毫秒）
   * @returns {Date} 日期对象
   */
  fromTimestamp(timestamp) {
    return new Date(timestamp);
  }
}

module.exports = new LocalTimeParser();