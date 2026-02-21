/**
 * 四季系统主入口
 * 测试四季系统的功能
 */
/** @type {any} */
let seasonSystem = null;
let istest = true; // 是否运行测试，默认为true
let flowerEffect = null;
let winterNightEffect = null;

// 根据环境导出
if (typeof window !== 'undefined') {
  // 在浏览器环境中，将导出值挂载到 window 对象
  seasonSystem = window.Bundle;
  istest = false;
  // 在浏览器环境中，flowerEffect 会在 floawer.js 中自动注册
  // winterNightEffect 会在 night_effect.js 中自动注册
} else {
  seasonSystem = await import('./season_system/bundle.min.js');
  // 在 Node.js 环境中导入飘花效果
  try {
    flowerEffect = await import('./season_system/effects_library/spring/floawer.js');
  } catch (error) {
    console.warn('在 Node.js 环境中无法导入飘花效果:', error.message);
  }
  // 在 Node.js 环境中导入冬季晚上效果
  try {
    winterNightEffect = await import('./season_system/effects_library/winter/night_effect.js');
  } catch (error) {
    console.warn('在 Node.js 环境中无法导入冬季晚上效果:', error.message);
  }
}

// 导入四季系统
// 运行测试
// await testSeasonSystem();
window.addEventListener('DOMContentLoaded', async () => {
  await generateSeasonSystem();
});

// 生成四季系统
async function generateSeasonSystem() {
  // 注册效果
  if (seasonSystem) {
    const timeDetection = seasonSystem.timeDetection;
    const effectScheduler = seasonSystem.effectScheduler;
    const weightManager = seasonSystem.weightManager;

    // 注册季节效果处理器
    effectScheduler.registerEffectHandler('season', async (config) => {
      console.log(`执行季节效果: ${config.seasonName} - 强度: ${config.intensity}`);
      // 模拟效果执行时间
      await new Promise(resolve => setTimeout(resolve, 500));
    });

    // 注册天气效果处理器
    effectScheduler.registerEffectHandler('weather', async (config) => {
      console.log(`执行天气效果: ${config.weatherType} - 持续时间: ${config.duration}秒`);
      await new Promise(resolve => setTimeout(resolve, 300));
    });

    // 注册时间效果处理器
    effectScheduler.registerEffectHandler('time', async (config) => {
      console.log(`执行时间效果: ${config.timeOfDay} - 亮度: ${config.brightness}`);
      await new Promise(resolve => setTimeout(resolve, 200));
    });

    console.log('已注册效果处理器:', effectScheduler.getStats().registeredHandlers);
    console.log('已添加效果数量:', weightManager.getAllEffects().length);
  }

  // 初始化监听器
  await init();
}

/**
 * 初始化函数，注册监听器并测试效果调用
 */
async function init() {
  if (!seasonSystem || !seasonSystem.timeManager || !seasonSystem.effectScheduler) {
    console.error('四季系统未初始化，无法注册监听器');
    return;
  }

  const timeManager = seasonSystem.timeManager;
  const effectScheduler = seasonSystem.effectScheduler;

  console.log('================================');
  console.log('初始化四季系统监听器...');
  console.log('================================');

  // 添加季节变化监听器
  console.log('1. 添加季节变化监听器...');
  const seasonChangeListener = timeManager.addListener('seasonChange', async (eventData) => {
    console.log('\n=== 季节变化事件 ===');
    console.log('  旧季节:', eventData.oldSeason.chineseName);
    console.log('  新季节:', eventData.newSeason.chineseName);
    console.log('  时间:', eventData.timeInfo.formattedTime);
    // 季节发生变化后执行随机效果
    console.log('  季节变化后执行随机效果...');
    const executedEffect = await effectScheduler.executeRandomEffect(eventData.timeInfo);
    if (executedEffect) {
      console.log('  执行的效果:', executedEffect.id, '(类型:', executedEffect.config.type, ')');
    } else {
      console.log('  没有找到可执行的效果');
    }
  });

  // 添加时段变化监听器
  console.log('2. 添加时段变化监听器...');
  const timePeriodChangeListener = timeManager.addListener('timePeriodChange', async (eventData) => {
    console.log('\n=== 时段变化事件 ===');
    console.log('  旧时段:', eventData.oldTimePeriod.chineseName);
    console.log('  新时段:', eventData.newTimePeriod.chineseName);
    console.log('  时间:', eventData.timeInfo.formattedTime);
    // 时段发生变化后执行随机效果
    console.log('  时段变化后执行随机效果...');
    const executedEffect = await effectScheduler.executeRandomEffect(eventData.timeInfo);
    if (executedEffect) {
      console.log('  执行的效果:', executedEffect.id, '(类型:', executedEffect.config.type, ')');
    } else {
      console.log('  没有找到可执行的效果');
    }
  });

  // 添加分钟变化监听器
  console.log('3. 添加分钟变化监听器...');
  const minuteChangeListener = timeManager.addListener('minuteChange', async (eventData) => {
    console.log('\n=== 分钟变化事件 ===');
    console.log('  时间:', eventData.timeInfo.formattedTime);
    // 每分钟执行一次随机效果
    console.log('  每分钟执行随机效果...');
    // const executedEffect = await effectScheduler.executeRandomEffect(eventData.timeInfo);
    // if (executedEffect) {
    //   console.log('  执行的效果:', executedEffect.id, '(类型:', executedEffect.config.type, ')');
    // } else {
    //   console.log('  没有找到可执行的效果');
    // }
  });

  // 启动时间监控
  console.log('\n4. 启动时间监控（1000ms间隔）:');
  timeManager.startMonitoring();
  console.log('  时间监控已启动，将监控季节、时段、分钟、小时和日期的变化');
  console.log('  季节和时段变化时会自动执行随机效果');
  console.log('');

  // 立即执行一次随机效果，测试效果是否能正常调用
  console.log('5. 测试效果调用...');
  const currentTimeInfo = timeManager.getCurrentTimeInfo();
  console.log('  当前时间:', currentTimeInfo.formattedTime);
  console.log('  当前季节:', currentTimeInfo.season.chineseName, '(', currentTimeInfo.season.name, ')');
  console.log('  当前时段:', currentTimeInfo.timePeriod.chineseName, '(', currentTimeInfo.timePeriod.name, ')');
  console.log('  执行一次随机效果...');
  const initialEffect = await effectScheduler.executeRandomEffect(currentTimeInfo);
  if (initialEffect) {
    console.log('  执行的效果:', initialEffect.id, '(类型:', initialEffect.config.type, ')');
  } else {
    console.log('  没有找到可执行的效果');
  }

  console.log('\n================================');
  console.log('初始化完成！');
  console.log('================================');
}

/**
 * 测试四季系统的功能
 */
async function testSeasonSystem() {
  console.log('================================');
  console.log('开始测试四季系统...');
  console.log('================================');

  try {
    const timeManager = seasonSystem.timeManager;
    const timeDetection = seasonSystem.timeDetection;
    const effectScheduler = seasonSystem.effectScheduler;
    const weightManager = seasonSystem.weightManager;

    console.log('=== 时间模块测试 ===\n');

    // 测试1：获取当前时间信息
    console.log('1. 测试获取当前时间信息:');
    const currentTimeInfo = timeManager.getCurrentTimeInfo();
    console.log('当前时间:', currentTimeInfo.formattedTime);
    console.log('当前季节:', currentTimeInfo.season.chineseName, '(', currentTimeInfo.season.name, ')');
    console.log('当前时段:', currentTimeInfo.timePeriod.chineseName, '(', currentTimeInfo.timePeriod.name, ')');
    console.log('时间组件:', JSON.stringify(currentTimeInfo.components, null, 2));
    console.log('');

    // 测试2：测试时间检测模块的各个子模块
    console.log('2. 测试时间检测模块的各个子模块:');

    // 测试本地时间解析器
    const localTimeParser = timeDetection.getLocalTimeParser();
    console.log('本地时间解析器:');
    console.log('  当前时间:', localTimeParser.getCurrentTime());
    console.log('  时间戳:', localTimeParser.getTimestamp());
    console.log('  格式化时间:', localTimeParser.formatTime(new Date(), 'YYYY-MM-DD HH:mm:ss'));

    // 测试季节判定器
    const seasonDetermination = timeDetection.getSeasonDetermination();
    console.log('\n季节判定器:');
    console.log('  季节常量:', seasonDetermination.constructor.SEASONS);
    console.log('  春季范围:', seasonDetermination.getSeasonDateRange('spring'));
    console.log('  夏季范围:', seasonDetermination.getSeasonDateRange('summer'));
    console.log('  秋季范围:', seasonDetermination.getSeasonDateRange('autumn'));
    console.log('  冬季范围:', seasonDetermination.getSeasonDateRange('winter'));

    // 测试时段识别器
    const timePeriodIdentifier = timeDetection.getTimePeriodIdentifier();
    console.log('\n时段识别器:');
    console.log('  时段常量:', timePeriodIdentifier.constructor.TIME_PERIODS);
    console.log('  早晨范围:', timePeriodIdentifier.getTimePeriodRange('morning'));
    console.log('  下午范围:', timePeriodIdentifier.getTimePeriodRange('afternoon'));
    console.log('  晚上范围:', timePeriodIdentifier.getTimePeriodRange('evening'));
    console.log('  夜晚范围:', timePeriodIdentifier.getTimePeriodRange('night'));
    console.log('');

    // 测试3：测试时间管理器的定时任务功能
    console.log('3. 测试时间管理器的定时任务功能:');
    console.log('  设置一个2秒后执行的定时任务...');

    timeManager.setTimeout('testTimeout', () => {
      console.log('  定时任务执行成功!');
    }, 2000);

    // 测试4：测试时间管理器的监听器功能
    console.log('\n4. 测试时间管理器的监听器功能:');
    console.log('  添加季节变化监听器...');

    const seasonChangeListener = timeManager.addListener('seasonChange', async (eventData) => {
      console.log('  季节变化事件:', {
        oldSeason: eventData.oldSeason.chineseName,
        newSeason: eventData.newSeason.chineseName,
        time: eventData.timeInfo.formattedTime
      });
      // 季节发生变化后进行一次随机
      console.log('  季节变化后执行随机效果...');
      await effectScheduler.executeRandomEffect(eventData.timeInfo);
    });

    console.log('  添加时段变化监听器...');

    const timePeriodChangeListener = timeManager.addListener('timePeriodChange', async (eventData) => {
      console.log('  时段变化事件:', {
        oldTimePeriod: eventData.oldTimePeriod.chineseName,
        newTimePeriod: eventData.newTimePeriod.chineseName,
        time: eventData.timeInfo.formattedTime
      });
      // 时段发生变化后进行一次随机
      console.log('  时段变化后执行随机效果...');
      await effectScheduler.executeRandomEffect(eventData.timeInfo);
    });

    console.log('  添加分钟变化监听器...');

    const minuteChangeListener = timeManager.addListener('minuteChange', async (eventData) => {
      console.log('  分钟变化事件:', {
        time: eventData.timeInfo.formattedTime
      });
      await effectScheduler.executeRandomEffect(eventData.timeInfo);
    });

    console.log('');

    // 测试5：注册效果处理器
    console.log('5. 测试注册效果处理器:');

    // 注册季节效果处理器
    effectScheduler.registerEffectHandler('season', async (config) => {
      console.log(`执行季节效果: ${config.seasonName} - 强度: ${config.intensity}`);
      // 模拟效果执行时间
      await new Promise(resolve => setTimeout(resolve, 500));
    });

    // 注册天气效果处理器
    effectScheduler.registerEffectHandler('weather', async (config) => {
      console.log(`执行天气效果: ${config.weatherType} - 持续时间: ${config.duration}秒`);
      await new Promise(resolve => setTimeout(resolve, 300));
    });

    // 注册时间效果处理器
    effectScheduler.registerEffectHandler('time', async (config) => {
      console.log(`执行时间效果: ${config.timeOfDay} - 亮度: ${config.brightness}`);
      await new Promise(resolve => setTimeout(resolve, 200));
    });

    console.log('已注册效果处理器:', effectScheduler.getStats().registeredHandlers);

    // 测试6：添加效果（按季节和时段分组）
    console.log('\n6. 测试添加效果（按季节和时段分组）:');

    // 春季效果（3个效果，不同比重）
    effectScheduler.addEffect('spring_blossom', {
      type: 'season',
      seasonName: '春季',
      intensity: 0.8
    }, 50, 'spring', 'morning'); // 比重50，春季早晨

    effectScheduler.addEffect('spring_rain', {
      type: 'weather',
      weatherType: '春雨',
      duration: 120
    }, 30, 'spring', 'afternoon'); // 比重30，春季下午

    effectScheduler.addEffect('spring_morning', {
      type: 'time',
      timeOfDay: '春日早晨',
      brightness: 0.7
    }, 20, 'spring', 'morning'); // 比重20，春季早晨

    // 夏季效果
    effectScheduler.addEffect('summer_heat', {
      type: 'season',
      seasonName: '夏季',
      intensity: 0.9
    }, 60, 'summer', 'afternoon'); // 夏季下午

    effectScheduler.addEffect('summer_thunderstorm', {
      type: 'weather',
      weatherType: '雷阵雨',
      duration: 90
    }, 40, 'summer', 'evening'); // 夏季晚上

    // 秋季效果
    effectScheduler.addEffect('autumn_leaves', {
      type: 'season',
      seasonName: '秋季',
      intensity: 0.85
    }, 70, 'autumn', 'morning'); // 秋季早晨

    // 冬季效果
    effectScheduler.addEffect('winter_snow', {
      type: 'season',
      seasonName: '冬季',
      intensity: 0.95
    }, 80, 'winter', 'morning'); // 冬季早晨

    // 冬季下午效果
    effectScheduler.addEffect('winter_sunshine', {
      type: 'season',
      seasonName: '冬季',
      intensity: 0.7
    }, 60, 'winter', 'afternoon'); // 冬季下午

    console.log('已添加效果数量:', weightManager.getAllEffects().length);

    // 测试7：查看比重统计
    console.log('\n7. 测试比重统计:');
    const stats = weightManager.getWeightStats();
    console.log('统计信息:', JSON.stringify(stats, null, 2));

    // 测试8：按季节获取效果
    console.log('\n8. 测试按季节获取效果:');
    const springEffects = weightManager.getEffectsBySeason('spring');
    console.log('春季效果（3个）:');
    springEffects.forEach(effect => {
      console.log(`  ${effect.id} - 比重: ${effect.weight} - 类型: ${effect.config.type}`);
    });

    // 测试9：更新效果比重
    console.log('\n9. 测试更新效果比重:');
    console.log('更新 spring_rain 效果的比重从 30 到 40');
    effectScheduler.updateEffectWeight('spring_rain', 40);

    const updatedSpringEffects = weightManager.getEffectsBySeason('spring');
    console.log('更新后的春季效果:');
    updatedSpringEffects.forEach(effect => {
      console.log(`  ${effect.id} - 比重: ${effect.weight} - 类型: ${effect.config.type}`);
    });

    // 测试10：根据比重随机选择效果
    console.log('\n10. 测试根据比重随机选择效果:');
    console.log('随机选择10次春季效果（应该更倾向于比重高的）:');
    const selectionCounts = {};
    for (let i = 0; i < 10; i++) {
      const randomEffect = weightManager.getRandomEffectByWeight(springEffects);
      if (randomEffect) {
        selectionCounts[randomEffect.id] = (selectionCounts[randomEffect.id] || 0) + 1;
        console.log(`  第${i + 1}次: ${randomEffect.id} (比重: ${randomEffect.weight})`);
      }
    }
    console.log('选择次数统计:', selectionCounts);

    // 测试11：执行效果
    console.log('\n11. 测试执行效果:');
    console.log('执行单个效果: spring_blossom');
    await effectScheduler.executeEffect('spring_blossom');

    // 测试12：执行指定季节的效果
    console.log('\n12. 测试执行指定季节的效果:');
    console.log('执行春季所有效果:');
    await effectScheduler.executeEffectsBySeason('spring');

    // 测试13：随机执行效果（根据比重）
    console.log('\n13. 测试随机执行效果（根据比重）:');
    console.log('根据当前时间信息随机执行效果:');
    await effectScheduler.executeRandomEffect(currentTimeInfo);

    // 测试14：移除效果
    console.log('\n14. 测试移除效果:');
    console.log('移除效果: spring_morning');
    effectScheduler.removeEffect('spring_morning');
    console.log('剩余春季效果数量:', weightManager.getEffectsBySeason('spring').length);

    // 测试15：获取运行中的效果
    console.log('\n15. 测试获取运行中的效果:');
    console.log('运行中的效果:', effectScheduler.getRunningEffects());

    // 测试16：启动时间监控
    console.log('\n16. 启动时间监控（1000ms间隔）:');
    timeManager.startMonitoring();
    console.log('  时间监控已启动，将监控季节、时段、分钟、小时和日期的变化');
    console.log('  季节和时段变化时会自动执行随机效果');
    console.log('');

    // 测试17：获取所有定时任务和监听器
    console.log('17. 获取当前状态:');
    console.log('  所有定时任务:', timeManager.getAllTimers());
    console.log('  所有监听器:', JSON.stringify(timeManager.getAllListeners(), null, 2));
    console.log('');

    console.log('=== 测试完成 ===');
    console.log('注意：时间监控将持续运行，按 Ctrl+C 停止测试');

    if (istest) {
      // 5秒后停止测试
      setTimeout(() => {
        console.log('\n=== 停止测试 ===');
        timeManager.stopMonitoring();
        timeManager.clearAllTimers();
        effectScheduler.clearAllEffects();
        console.log('  时间监控已停止');
        console.log('  所有定时任务已清除');
        console.log('  所有效果已清空');
        process.exit(0);
      }, 5000);
    }

  } catch (error) {
    console.error('测试过程中出错:', error);
    seasonSystem.timeManager.stopMonitoring();
    seasonSystem.timeManager.clearAllTimers();
    seasonSystem.effectScheduler.clearAllEffects();
  }
}