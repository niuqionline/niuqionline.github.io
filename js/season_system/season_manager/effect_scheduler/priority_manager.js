/**
 * 效果比重管理器
 * 用于管理四季系统中各种效果的比重
 */
class WeightManager {
  constructor() {
    this.effects = new Map();
    this.seasonEffects = new Map();
    this.timePeriodEffects = new Map();
    this.seasonTimePeriodEffects = new Map();
    this.originalWeights = new Map(); // 记录每个效果的原始比重
    this.lastResetDate = null; // 上次重置日期
    this.defaultWeight = 30;
  }

  /**
   * 添加效果
   * @param {string} effectId - 效果ID
   * @param {Object} effectConfig - 效果配置
   * @param {number} weight - 比重 (0-100，数字越大比重越高)
   * @param {string} season - 季节
   * @param {string} timePeriod - 时段
   */
  addEffect(effectId, effectConfig, weight = this.defaultWeight, season = null, timePeriod = null) {
    if (typeof weight !== 'number' || weight < 0 || weight > 100) {
      throw new Error('比重必须是0-100之间的数字');
    }

    const effect = {
      id: effectId,
      config: effectConfig,
      weight: weight,
      season: season,
      timePeriod: timePeriod
    };

    this.effects.set(effectId, effect);
    this.originalWeights.set(effectId, weight); // 存储原始比重

    // 按季节分组
    if (season) {
      if (!this.seasonEffects.has(season)) {
        this.seasonEffects.set(season, new Map());
      }
      this.seasonEffects.get(season).set(effectId, effect);
    }

    // 按时段分组
    if (timePeriod) {
      if (!this.timePeriodEffects.has(timePeriod)) {
        this.timePeriodEffects.set(timePeriod, new Map());
      }
      this.timePeriodEffects.get(timePeriod).set(effectId, effect);
    }

    // 按季节+时段分组
    if (season && timePeriod) {
      const key = `${season}_${timePeriod}`;
      if (!this.seasonTimePeriodEffects.has(key)) {
        this.seasonTimePeriodEffects.set(key, new Map());
      }
      this.seasonTimePeriodEffects.get(key).set(effectId, effect);
    }

    return this;
  }

  /**
   * 移除效果
   * @param {string} effectId - 效果ID
   */
  removeEffect(effectId) {
    if (this.effects.has(effectId)) {
      const effect = this.effects.get(effectId);
      // 从季节分组中移除
      if (effect.season && this.seasonEffects.has(effect.season)) {
        this.seasonEffects.get(effect.season).delete(effectId);
        if (this.seasonEffects.get(effect.season).size === 0) {
          this.seasonEffects.delete(effect.season);
        }
      }
      // 从时段分组中移除
      if (effect.timePeriod && this.timePeriodEffects.has(effect.timePeriod)) {
        this.timePeriodEffects.get(effect.timePeriod).delete(effectId);
        if (this.timePeriodEffects.get(effect.timePeriod).size === 0) {
          this.timePeriodEffects.delete(effect.timePeriod);
        }
      }
      // 从季节+时段分组中移除
      if (effect.season && effect.timePeriod) {
        const key = `${effect.season}_${effect.timePeriod}`;
        if (this.seasonTimePeriodEffects.has(key)) {
          this.seasonTimePeriodEffects.get(key).delete(effectId);
          if (this.seasonTimePeriodEffects.get(key).size === 0) {
            this.seasonTimePeriodEffects.delete(key);
          }
        }
      }
      this.effects.delete(effectId);
      this.originalWeights.delete(effectId); // 从原始比重映射中移除
    }
    return this;
  }

  /**
   * 重置所有效果的比重到原始值
   */
  resetWeightsToOriginal() {
    for (const [effectId, originalWeight] of this.originalWeights.entries()) {
      const effect = this.effects.get(effectId);
      if (effect) {
        this.updateWeight(effectId, originalWeight);
      }
    }
    this.lastResetDate = new Date().toDateString();
    console.log('效果比重已重置到原始值');
    return this;
  }

  /**
   * 检查并执行每日重置
   */
  checkAndResetDaily() {
    const today = new Date().toDateString();
    if (this.lastResetDate !== today) {
      this.resetWeightsToOriginal();
    }
    return this;
  }

  /**
   * 获取效果的原始比重
   * @param {string} effectId - 效果ID
   */
  getOriginalWeight(effectId) {
    return this.originalWeights.get(effectId);
  }

  /**
   * 更新效果比重
   * @param {string} effectId - 效果ID
   * @param {number} weight - 新的比重
   */
  
  updateWeight(effectId, weight) {
    if (!this.effects.has(effectId)) {
      throw new Error(`效果 ${effectId} 不存在`);
    }

    if (typeof weight !== 'number' || weight < 0 || weight > 100) {
      throw new Error('比重必须是0-100之间的数字');
    }

    const oldEffect = this.effects.get(effectId);
    const updatedEffect = {
      ...oldEffect,
      weight: weight
    };

    this.effects.set(effectId, updatedEffect);

    // 更新季节分组中的效果
    if (oldEffect.season && this.seasonEffects.has(oldEffect.season)) {
      this.seasonEffects.get(oldEffect.season).set(effectId, updatedEffect);
    }

    // 更新时段分组中的效果
    if (oldEffect.timePeriod && this.timePeriodEffects.has(oldEffect.timePeriod)) {
      this.timePeriodEffects.get(oldEffect.timePeriod).set(effectId, updatedEffect);
    }

    // 更新季节+时段分组中的效果
    if (oldEffect.season && oldEffect.timePeriod) {
      const key = `${oldEffect.season}_${oldEffect.timePeriod}`;
      if (this.seasonTimePeriodEffects.has(key)) {
        this.seasonTimePeriodEffects.get(key).set(effectId, updatedEffect);
      }
    }

    return this;
  }

  /**
   * 获取效果
   * @param {string} effectId - 效果ID
   */
  getEffect(effectId) {
    return this.effects.get(effectId);
  }

  /**
   * 获取所有效果
   */
  getAllEffects() {
    return Array.from(this.effects.values());
  }

  /**
   * 根据时间解析结果获取效果
   * @param {Object} timeInfo - 时间解析结果
   */
  getEffectsByTimeInfo(timeInfo) {
    const season = timeInfo.season ? timeInfo.season.name : null;
    const timePeriod = timeInfo.timePeriod ? timeInfo.timePeriod.name : null;

    // 如果没有季节或时段信息，返回空数组
    if (!season || !timePeriod) {
      return [];
    }

    // 尝试获取同时匹配季节和时段的效果
    const key = `${season}_${timePeriod}`;
    if (this.seasonTimePeriodEffects.has(key)) {
      return Array.from(this.seasonTimePeriodEffects.get(key).values());
    }

    return [];
  }

  /**
   * 获取指定季节的效果
   * @param {string} season - 季节
   */
  getEffectsBySeason(season) {
    if (!this.seasonEffects.has(season)) {
      return [];
    }
    return Array.from(this.seasonEffects.get(season).values());
  }

  /**
   * 获取指定时段的效果
   * @param {string} timePeriod - 时段
   */
  getEffectsByTimePeriod(timePeriod) {
    if (!this.timePeriodEffects.has(timePeriod)) {
      return [];
    }
    return Array.from(this.timePeriodEffects.get(timePeriod).values());
  }

  /**
   * 根据比重随机选择一个效果
   * @param {Array} effects - 效果列表，如果不提供则使用所有效果
   * @param {boolean} considerOccurrences - 是否考虑出现次数来调整权重
   */
  getRandomEffectByWeight(effects = null, considerOccurrences = true) {
    const effectList = effects || this.getAllEffects();
    if (effectList.length === 0) {
      return null;
    }

    // 过滤掉权重为0的效果
    const validEffects = effectList.filter(effect => effect.weight > 0);
    if (validEffects.length === 0) {
      return null;
    }

    // 计算总比重
    const totalWeight = validEffects.reduce((sum, effect) => sum + effect.weight, 0);
    if (totalWeight === 0) {
      // 如果总比重为0，随机选择
      return validEffects[Math.floor(Math.random() * validEffects.length)];
    }

    // 生成随机数
    let random = Math.random() * totalWeight;

    // 根据比重选择效果
    for (const effect of validEffects) {
      random -= effect.weight;
      if (random <= 0) {
        return effect;
      }
    }

    // 以防万一，返回最后一个效果
    return validEffects[validEffects.length - 1];
  }

  /**
   * 根据时间解析结果和比重随机选择一个效果
   * @param {Object} timeInfo - 时间解析结果
   */
  getRandomEffectByTimeInfo(timeInfo) {
    const seasonTimePeriodEffects = this.getEffectsByTimeInfo(timeInfo);
    return this.getRandomEffectByWeight(seasonTimePeriodEffects, true);
  }

  /**
   * 检查是否存在指定效果
   * @param {string} effectId - 效果ID
   */
  hasEffect(effectId) {
    return this.effects.has(effectId);
  }

  /**
   * 清空所有效果
   */
  clearAllEffects() {
    this.effects.clear();
    this.seasonEffects.clear();
    this.timePeriodEffects.clear();
    this.seasonTimePeriodEffects.clear();
    this.originalWeights.clear();
    this.lastResetDate = null;
    return this;
  }

  /**
   * 获取比重统计信息
   */
  getWeightStats() {
    const stats = {
      totalEffects: this.effects.size,
      seasonDistribution: {},
      totalWeight: 0
    };

    if (this.effects.size > 0) {
      stats.totalWeight = Array.from(this.effects.values()).reduce((sum, effect) => sum + effect.weight, 0);

      // 按季节统计
      for (const [season, effects] of this.seasonEffects.entries()) {
        stats.seasonDistribution[season] = {
          count: effects.size,
          totalWeight: Array.from(effects.values()).reduce((sum, effect) => sum + effect.weight, 0)
        };
      }
    }

    return stats;
  }
}

// 导出单例实例
const weightManager = new WeightManager();
export default weightManager;
export { WeightManager };