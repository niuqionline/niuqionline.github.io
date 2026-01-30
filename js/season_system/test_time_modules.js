/**
 * 时间模块测试文件
 * 验证时间检测模块和时间管理器的功能
 */

import { timeManager as _timeManager, timeDetection as _timeDetection } from './manager';
const timeManager = _timeManager;
const timeDetection = _timeDetection;

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

const seasonChangeListener = timeManager.addListener('seasonChange', (eventData) => {
  console.log('  季节变化事件:', {
    oldSeason: eventData.oldSeason.chineseName,
    newSeason: eventData.newSeason.chineseName,
    time: eventData.time
  });
});

console.log('  添加时段变化监听器...');

const timePeriodChangeListener = timeManager.addListener('timePeriodChange', (eventData) => {
  console.log('  时段变化事件:', {
    oldTimePeriod: eventData.oldTimePeriod.chineseName,
    newTimePeriod: eventData.newTimePeriod.chineseName,
    time: eventData.time
  });
});

console.log('  添加分钟变化监听器...');

const minuteChangeListener = timeManager.addListener('minuteChange', (eventData) => {
  console.log('  分钟变化事件:', {
    time: eventData.timeInfo.formattedTime
  });
});

console.log('');

// 测试5：启动时间监控
console.log('5. 启动时间监控（1000ms间隔）:');
timeManager.startMonitoring();
console.log('  时间监控已启动，将监控季节、时段、分钟、小时和日期的变化');
console.log('');

// 测试6：获取所有定时任务和监听器
console.log('6. 获取当前状态:');
console.log('  所有定时任务:', timeManager.getAllTimers());
console.log('  所有监听器:', JSON.stringify(timeManager.getAllListeners(), null, 2));
console.log('');

console.log('=== 测试完成 ===');
console.log('注意：时间监控将持续运行，按 Ctrl+C 停止测试');

// 5秒后停止测试
setTimeout(() => {
  console.log('\n=== 停止测试 ===');
  timeManager.stopMonitoring();
  timeManager.clearAllTimers();
  console.log('  时间监控已停止');
  console.log('  所有定时任务已清除');
  process.exit(0);
}, 5000);