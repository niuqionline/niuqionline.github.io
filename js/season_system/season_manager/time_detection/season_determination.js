/**
 * 季节判定逻辑模块
 * 负责根据日期判定当前季节
 */

import { getTimeComponents } from './local_time_parser';

class SeasonDetermination {
  /**
   * 季节常量
   */
  static SEASONS = {
    SPRING: 'spring',
    SUMMER: 'summer',
    AUTUMN: 'autumn',
    WINTER: 'winter'
  };

  /**
   * 获取当前季节
   * @param {Date} date - 可选的日期对象，默认使用当前时间
   * @returns {string} 当前季节的英文名称
   */
  getCurrentSeason(date = new Date()) {
    const components = getTimeComponents(date);
    const month = components.month;
    const day = components.day;

    // 根据月份和日期判断季节
    // 春季：3月21日 - 6月20日
    // 夏季：6月21日 - 9月22日
    // 秋季：9月23日 - 12月20日
    // 冬季：12月21日 - 3月20日
    
    if ((month === 3 && day >= 21) || (month === 4) || (month === 5) || (month === 6 && day <= 20)) {
      return SeasonDetermination.SEASONS.SPRING;
    } else if ((month === 6 && day >= 21) || (month === 7) || (month === 8) || (month === 9 && day <= 22)) {
      return SeasonDetermination.SEASONS.SUMMER;
    } else if ((month === 9 && day >= 23) || (month === 10) || (month === 11) || (month === 12 && day <= 20)) {
      return SeasonDetermination.SEASONS.AUTUMN;
    } else {
      return SeasonDetermination.SEASONS.WINTER;
    }
  }

  /**
   * 获取季节的中文名称
   * @param {string} season - 季节的英文名称
   * @returns {string} 季节的中文名称
   */
  getSeasonChineseName(season) {
    const seasonMap = {
      [SeasonDetermination.SEASONS.SPRING]: '春季',
      [SeasonDetermination.SEASONS.SUMMER]: '夏季',
      [SeasonDetermination.SEASONS.AUTUMN]: '秋季',
      [SeasonDetermination.SEASONS.WINTER]: '冬季'
    };

    return seasonMap[season] || season;
  }

  /**
   * 获取季节的开始和结束日期
   * @param {string} season - 季节的英文名称
   * @param {number} year - 年份，默认使用当前年份
   * @returns {Object} 包含开始和结束日期的对象
   */
  getSeasonDateRange(season, year = new Date().getFullYear()) {
    const ranges = {
      [SeasonDetermination.SEASONS.SPRING]: {
        start: new Date(year, 2, 21), // 3月21日
        end: new Date(year, 5, 20)    // 6月20日
      },
      [SeasonDetermination.SEASONS.SUMMER]: {
        start: new Date(year, 5, 21), // 6月21日
        end: new Date(year, 8, 22)    // 9月22日
      },
      [SeasonDetermination.SEASONS.AUTUMN]: {
        start: new Date(year, 8, 23), // 9月23日
        end: new Date(year, 11, 20)   // 12月20日
      },
      [SeasonDetermination.SEASONS.WINTER]: {
        start: new Date(year, 11, 21), // 12月21日
        end: new Date(year + 1, 2, 20) // 次年3月20日
      }
    };

    return ranges[season] || null;
  }

  /**
   * 检查给定日期是否在指定季节内
   * @param {Date} date - 日期对象
   * @param {string} season - 季节的英文名称
   * @returns {boolean} 是否在指定季节内
   */
  isDateInSeason(date, season) {
    const targetSeason = this.getCurrentSeason(date);
    return targetSeason === season;
  }
}

export default new SeasonDetermination();