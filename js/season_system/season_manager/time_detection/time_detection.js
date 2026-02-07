/**
 * 时间检测模块主入口
 * 整合本地时间解析、季节判定和时段识别功能
 */

import localTimeParser, { getTimeComponents, formatTime } from './local_time_parser';
import seasonDetermination, { getCurrentSeason, getSeasonChineseName, getSeasonDateRange, isDateInSeason, constructor } from './season_determination';
import timePeriodIdentifier, { getCurrentTimePeriod, getTimePeriodChineseName, getTimePeriodRange, isTimeInPeriod, constructor as _constructor } from './time_period_identifier';

class TimeDetection {
  /**
   * 获取本地时间解析器
   * @returns {Object} 本地时间解析器实例
   */
  getLocalTimeParser() {
    return localTimeParser;
  }

  /**
   * 获取季节判定器
   * @returns {Object} 季节判定器实例
   */
  getSeasonDetermination() {
    return seasonDetermination;
  }

  /**
   * 获取时段识别器
   * @returns {Object} 时段识别器实例
   */
  getTimePeriodIdentifier() {
    return timePeriodIdentifier;
  }

  /**
   * 获取当前时间信息
   * @param {Date} date - 可选的日期对象，默认使用当前时间
   * @returns {Object} 包含时间、季节和时段信息的对象
   */
  getCurrentTimeInfo(date = new Date()) {
    const timeComponents = getTimeComponents(date);
    const season = getCurrentSeason(date);
    const timePeriod = getCurrentTimePeriod(date);

    return {
      time: date,
      components: timeComponents,
      season: {
        name: season,
        chineseName: getSeasonChineseName(season),
        range: getSeasonDateRange(season, timeComponents.year)
      },
      timePeriod: {
        name: timePeriod,
        chineseName: getTimePeriodChineseName(timePeriod),
        range: getTimePeriodRange(timePeriod)
      },
      formattedTime: formatTime(date)
    };
  }

  /**
   * 检查是否为特定季节
   * @param {string} season - 季节的英文名称
   * @param {Date} date - 可选的日期对象，默认使用当前时间
   * @returns {boolean} 是否为特定季节
   */
  isSeason(season, date = new Date()) {
    return isDateInSeason(date, season);
  }

  /**
   * 检查是否为特定时段
   * @param {string} timePeriod - 时段的英文名称
   * @param {Date} date - 可选的日期对象，默认使用当前时间
   * @returns {boolean} 是否为特定时段
   */
  isTimePeriod(timePeriod, date = new Date()) {
    return isTimeInPeriod(date, timePeriod);
  }

  /**
   * 获取时间检测的所有常量
   * @returns {Object} 包含所有常量的对象
   */
  getConstants() {
    return {
      seasons: seasonDetermination.constructor.SEASONS,
      timePeriods: timePeriodIdentifier.constructor.TIME_PERIODS
    };
  }
}

export default new TimeDetection();