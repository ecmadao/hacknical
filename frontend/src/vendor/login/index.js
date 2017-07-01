import 'particles.js';
import './styles/index.css';
import Api from 'API';

const formatNumber = (number) => {
  if (number.length <= 3) return number;
  const numberString = `${number}`;
  const loop = parseInt(numberString.length / 3, 10);
  const offset = numberString.length % 3;
  let result = '';
  for (let i = loop - 1; i >= 0; i -= 1) {
    const start = offset + 3 * i;
    const end = start + 3;
    const section = numberString.slice(start, end);
    result = `,${section}${result}`;
  }
  result = offset
    ? `${numberString.slice(0, offset)}${result}`
    : result.slice(1);
  return result;
};

const countUp = (options = {}) => {
  const {
    elem, // 数字要变化的元素
    endVal = 100, // 最终显示数字
    startVal = 0, // 数字变化开始值
    duration = 1500, // 变化持续时间 (ms)
  } = options;
  let startTime = 0;
  const dec = Math.pow(10, 0);
  let progress, value;
  elem.innerHTML = '';
  const startCount = (timestamp) => {
    if(!startTime) startTime = timestamp;
    progress = timestamp - startTime;
    value = startVal + (endVal - startVal) * (progress / duration);
    value = (value > endVal) ? endVal : value;
    value = Math.floor(value * dec) / dec;
    elem.innerHTML = formatNumber(value);
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
  const githubPageview = github.pageview || 0;
  const resumePageview = resume.pageview || 0;
  const resumeCount = resume.count || 0;
  const resumeDownload = resume.download || 0;

  countUp({
    elem: $statisticUsers[0],
    endVal: Number(usersCount)
  });
  countUp({
    elem: $statisticPv[0],
    endVal: Number(githubPageview) + Number(resumePageview)
  });
  countUp({
    elem: $statisticResume[0],
    endVal: Number(resumeCount) + Number(resumeDownload)
  });

  $($statisticUsers[1]).text(usersCount);
  $($statisticPv[1]).text(githubPageview);
  $($statisticPv[2]).text(resumePageview);
  $($statisticResume[1]).text(Number(resumeCount) + Number(resumeDownload));
};

$(() => {
  particlesJS.load('login', '/vendor/particlesjs-config.json', () => {});
  if ($('.statistic-container')[0]) {
    renderStatistic();
  }
});
