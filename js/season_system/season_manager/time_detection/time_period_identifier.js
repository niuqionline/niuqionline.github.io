/**
 * 时段识别模块
 * 负责识别一天中的时段（晨/午/晚/夜）
 */

import { getTimeComponents } from '../local_time_parser';

class TimePeriodIdentifier {
  /**
   * 时段常量
   */
  static TIME_PERIODS = {
    MORNING: 'morning',      // 早晨
    AFTERNOON: 'afternoon',  // 下午
    EVENING: 'evening',      // 晚上
    NIGHT: 'night'           // 夜晚
  };

  /**
   * 获取当前时段
   * @param {Date} date - 可选的日期对象，默认使用当前时间
   * @returns {string} 当前时段的英文名称
   */
  getCurrentTimePeriod(date = new Date()) {
    const components = getTimeComponents(date);
    const hour = components.hour;

    // 根据小时判断时段
    // 早晨：6:00 - 12:00
    // 下午：12:00 - 18:00
    // 晚上：18:00 - 22:00
    // 夜晚：22:00 - 6:00
    
    if (hour >= 6 && hour < 12) {
      return TimePeriodIdentifier.TIME_PERIODS.MORNING;
    } else if (hour >= 12 && hour < 18) {
      return TimePeriodIdentifier.TIME_PERIODS.AFTERNOON;
    } else if (hour >= 18 && hour < 22) {
      return TimePeriodIdentifier.TIME_PERIODS.EVENING;
    } else {
      return TimePeriodIdentifier.TIME_PERIODS.NIGHT;
    }
  }

  /**
   * 获取时段的中文名称
   * @param {string} timePeriod - 时段的英文名称
   * @returns {string} 时段的中文名称
   */
  getTimePeriodChineseName(timePeriod) {
    const periodMap = {
      [TimePeriodIdentifier.TIME_PERIODS.MORNING]: '早晨',
      [TimePeriodIdentifier.TIME_PERIODS.AFTERNOON]: '下午',
      [TimePeriodIdentifier.TIME_PERIODS.EVENING]: '晚上',
      [TimePeriodIdentifier.TIME_PERIODS.NIGHT]: '夜晚'
    };

    return periodMap[timePeriod] || timePeriod;
  }

  /**
   * 获取时段的开始和结束时间
   * @param {string} timePeriod - 时段的英文名称
   * @returns {Object} 包含开始和结束小时的对象
   */
  getTimePeriodRange(timePeriod) {
    const ranges = {
      [TimePeriodIdentifier.TIME_PERIODS.MORNING]: {
        start: 6,
        end: 12
      },
      [TimePeriodIdentifier.TIME_PERIODS.AFTERNOON]: {
        start: 12,
        end: 18
      },
      [TimePeriodIdentifier.TIME_PERIODS.EVENING]: {
        start: 18,
        end: 22
      },
      [TimePeriodIdentifier.TIME_PERIODS.NIGHT]: {
        start: 22,
        end: 6
      }
    };

    return ranges[timePeriod] || null;
  }

  /**
   * 检查给定时间是否在指定时段内
   * @param {Date} date - 日期对象
   * @param {string} timePeriod - 时段的英文名称
   * @returns {boolean} 是否在指定时段内
   */
  isTimeInPeriod(date, timePeriod) {
    const targetPeriod = this.getCurrentTimePeriod(date);
    return targetPeriod === timePeriod;
  }

  /**
   * 获取下一个时段
   * @param {string} currentPeriod - 当前时段的英文名称
   * @returns {string} 下一个时段的英文名称
   */
  getNextTimePeriod(currentPeriod) {
    const periodOrder = [
      TimePeriodIdentifier.TIME_PERIODS.MORNING,
      TimePeriodIdentifier.TIME_PERIODS.AFTERNOON,
      TimePeriodIdentifier.TIME_PERIODS.EVENING,
      TimePeriodIdentifier.TIME_PERIODS.NIGHT
    ];

    const currentIndex = periodOrder.indexOf(currentPeriod);
    if (currentIndex === -1) {
      return null;
    }

    const nextIndex = (currentIndex + 1) % periodOrder.length;
    return periodOrder[nextIndex];
  }
}

export default new TimePeriodIdentifier();