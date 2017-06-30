import 'particles.js';
import './styles/index.css';
import Api from 'API';

const countUp = (options = {}) => {
  const {
    elem, // 数字要变化的元素
    endVal = 100, // 最终显示数字
    startVal = 0, // 数字变化开始值
    duration = 1500, // 变化持续时间 (ms)
    decimal = 0 // 小数点位数
  } = options;
  let startTime = 0;
  const dec = Math.pow(10, decimal);
  let progress, value;
  elem.innerHTML = '';
  const startCount = (timestamp) => {
    if(!startTime) startTime = timestamp;
    progress = timestamp - startTime;
    value = startVal + (endVal - startVal) * (progress / duration);
    value = (value > endVal) ? endVal : value;
    value = Math.floor(value * dec) / dec;
    elem.innerHTML = value.toFixed(decimal);
    progress < duration && requestAnimationFrame(startCount)
  };
  requestAnimationFrame(startCount);
};

const renderStatistic = async () => {
  const statistic = await Api.home.statistic();
  const {
    users,
    github,
    resume
  } = statistic;
  const $statisticUsers = $('.statistic-users');
  const $statisticPv = $('.statistic-pv');
  const $statisticResume = $('.statistic-resume');
  const $modal = $('.statistic-modal');

  const usersCount = users || 0;
  const pageviewCount = (github.pageview || 0) + (resume.pageview || 0);
  const resumeCount = resume.count || 0;
  countUp({
    elem: $statisticUsers[0],
    endVal: usersCount
  });
  countUp({
    elem: $statisticPv[0],
    endVal: pageviewCount
  });
  countUp({
    elem: $statisticResume[0],
    endVal: resumeCount
  });

  $($statisticUsers[1]).text(usersCount);
  $($statisticPv[1]).text(pageviewCount);
  $($statisticResume[1]).text(resumeCount);
};

$(() => {
  particlesJS.load('login', '/vendor/particlesjs-config.json', () => {});
  if ($('.statistic-container')[0]) {
    renderStatistic();
  }
});
