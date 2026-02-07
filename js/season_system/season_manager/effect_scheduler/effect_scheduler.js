/**
 * 效果调度器
 * 用于根据比重调度和执行四季系统的效果
 */
import weightManager from './priority_manager.js';

class EffectScheduler {
  constructor() {
    this.runningEffects = new Set();
    this.effectHandlers = new Map();
    this.maxConcurrentEffects = 10;
  }

  /**
   * 注册效果处理器
   * @param {string} effectType - 效果类型
   * @param {Function} handler - 效果处理函数
   */
  registerEffectHandler(effectType, handler) {
    if (typeof handler !== 'function') {
      throw new Error('效果处理器必须是函数');
    }
    this.effectHandlers.set(effectType, handler);
    return this;
  }

  /**
   * 移除效果处理器
   * @param {string} effectType - 效果类型
   */
  removeEffectHandler(effectType) {
    this.effectHandlers.delete(effectType);
    return this;
  }

  /**
   * 获取效果处理器
   * @param {string} effectType - 效果类型
   */
  getEffectHandler(effectType) {
    return this.effectHandlers.get(effectType);
  }

  /**
   * 添加效果
   * @param {string} effectId - 效果ID
   * @param {Object} effectConfig - 效果配置
   * @param {number} weight - 比重
   * @param {string} season - 季节
   * @param {string} timePeriod - 时段
   */
  addEffect(effectId, effectConfig, weight, season = null, timePeriod = null) {
    weightManager.addEffect(effectId, effectConfig, weight, season, timePeriod);
    return this;
  }

  /**
   * 移除效果
   * @param {string} effectId - 效果ID
   */
  removeEffect(effectId) {
    if (this.runningEffects.has(effectId)) {
      this.stopEffect(effectId);
    }
    weightManager.removeEffect(effectId);
    return this;
  }

  /**
   * 更新效果比重
   * @param {string} effectId - 效果ID
   * @param {number} weight - 新的比重
   */
  updateEffectWeight(effectId, weight) {
    weightManager.updateWeight(effectId, weight);
    return this;
  }

  /**
   * 执行效果
   * @param {string} effectId - 效果ID
   */
  async executeEffect(effectId) {
    // 检查并执行每日重置
    weightManager.checkAndResetDaily();

    const effect = weightManager.getEffect(effectId);
    if (!effect) {
      throw new Error(`效果 ${effectId} 不存在`);
    }

    const { type } = effect.config;
    const handler = this.getEffectHandler(type);
    if (!handler) {
      throw new Error(`未注册效果类型 ${type} 的处理器`);
    }

    if (this.runningEffects.has(effectId)) {
      console.warn(`效果 ${effectId} 已经在运行中`);
      return;
    }

    if (this.runningEffects.size >= this.maxConcurrentEffects) {
      console.warn('达到最大并发效果数量，等待执行');
      // 可以实现队列机制，这里简化处理
      return;
    }

    this.runningEffects.add(effectId);

    try {
      console.log(`开始执行效果: ${effectId} (比重: ${effect.weight})`);
      await handler(effect.config);
      console.log(`效果执行完成: ${effectId}`);

      // 执行完成后，将该效果的比重下降5%
      const newWeight = Math.max(0, effect.weight * 0.95);
      weightManager.updateWeight(effectId, newWeight);
      console.log(`效果 ${effectId} 比重已调整为: ${newWeight.toFixed(1)}`);
    } catch (error) {
      console.error(`效果执行出错: ${effectId}`, error);
    } finally {
      this.runningEffects.delete(effectId);
    }
  }

  /**
   * 停止效果
   * @param {string} effectId - 效果ID
   */
  stopEffect(effectId) {
    // 这里可以添加具体的效果停止逻辑
    // 例如取消动画、清除定时器等
    this.runningEffects.delete(effectId);
    console.log(`效果已停止: ${effectId}`);
    return this;
  }

  /**
   * 执行所有效果
   */
  async executeAllEffects() {
    const effects = weightManager.getAllEffects();
    for (const effect of effects) {
      await this.executeEffect(effect.id);
    }
  }

  /**
   * 执行指定季节的效果
   * @param {string} season - 季节
   */
  async executeEffectsBySeason(season) {
    const effects = weightManager.getEffectsBySeason(season);
    for (const effect of effects) {
      await this.executeEffect(effect.id);
    }
  }

  /**
   * 根据时间解析结果执行效果
   * @param {Object} timeInfo - 时间解析结果
   */
  async executeEffectsByTimeInfo(timeInfo) {
    const effects = weightManager.getEffectsByTimeInfo(timeInfo);
    for (const effect of effects) {
      await this.executeEffect(effect.id);
    }
  }

  /**
   * 随机执行一个效果（根据比重）
   * @param {Object} timeInfo - 时间解析结果，如果提供则只从对应季节的效果中选择
   */
  async executeRandomEffect(timeInfo = null) {
    let effect;
    if (timeInfo) {
      effect = weightManager.getRandomEffectByTimeInfo(timeInfo);
    } else {
      effect = weightManager.getRandomEffectByWeight();
    }

    if (effect) {
      await this.executeEffect(effect.id);
    }
    return effect;
  }

  /**
   * 获取运行中的效果
   */
  getRunningEffects() {
    return Array.from(this.runningEffects);
  }

  /**
   * 获取效果统计信息
   */
  getStats() {
    const weightStats = weightManager.getWeightStats();
    return {
      ...weightStats,
      runningEffects: this.runningEffects.size,
      registeredHandlers: this.effectHandlers.size,
      maxConcurrentEffects: this.maxConcurrentEffects
    };
  }

  /**
   * 设置最大并发效果数量
   * @param {number} max - 最大并发数量
   */
  setMaxConcurrentEffects(max) {
    if (typeof max !== 'number' || max <= 0) {
      throw new Error('最大并发数量必须是正整数');
    }
    this.maxConcurrentEffects = max;
    return this;
  }

  /**
   * 清空所有效果
   */
  clearAllEffects() {
    // 停止所有运行中的效果
    for (const effectId of this.runningEffects) {
      this.stopEffect(effectId);
    }
    weightManager.clearAllEffects();
    return this;
  }
}

// 导出单例实例
const effectScheduler = new EffectScheduler();
export default effectScheduler;
export { EffectScheduler };