import 'particles.js';
import './login.css';
import API from 'API';
import { sleep } from 'UTILS/helper';
import HeartBeat from 'UTILS/heartbeat';

const formatNumber = (number) => {
  if (number.length <= 3) return number;
  const numberString = `${number}`;
  const loop = parseInt(numberString.length / 3, 10);
  const offset = numberString.length % 3;
  let result = '';
  for (let i = loop - 1; i >= 0; i -= 1) {
    const start = offset + (3 * i);
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
  const dec = 1;
  let progress;
  let value;
  elem.innerHTML = '';
  const startCount = (timestamp) => {
    if (!startTime) startTime = timestamp;
    progress = timestamp - startTime;
    value = startVal + ((endVal - startVal) * (progress / duration));
    value = (value > endVal) ? endVal : value;
    value = Math.floor(value * dec) / dec;
    elem.innerHTML = formatNumber(value);
    progress < duration && requestAnimationFrame(startCount)
  };
  requestAnimationFrame(startCount);
};

const statisticTemplate = `
  <div class="statistic">
    <span class="statistic-count statistic-users"></span>
    <span>·</span>
    <span class="statistic-count statistic-pv"></span>
    <span>·</span>
    <span class="statistic-count statistic-resume"></span>
  </div>
`;

const fetchStatistic = API.home.statistic;

const renderStatistic = async (statistic, animation = true) => {
  const {
    users,
    github = {},
    resume = {},
  } = statistic;
  $('.statistic-loading').remove();
  $('.statistic').remove();
  $('.statistic-container').prepend(statisticTemplate);
  await sleep(100);

  const $statisticUsers = $('.statistic-users');
  const $statisticPv = $('.statistic-pv');
  const $statisticResume = $('.statistic-resume');

  const usersCount = users || 0;
  const githubPageview = (github && github.pageview) || 0;
  const resumePageview = (resume && resume.pageview) || 0;
  const resumeCount = (resume && resume.count) || 0;
  const resumeDownload = (resume && resume.download) || 0;

  if (animation) {
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
  } else {
    $statisticUsers[0].innerHTML = formatNumber(Number(usersCount));
    $statisticPv[0].innerHTML = formatNumber(Number(githubPageview) + Number(resumePageview));
    $statisticResume[0].innerHTML = formatNumber(Number(resumeCount) + Number(resumeDownload));
  }

  const $modal = $('.statistic-modal');
  if ($modal[0]) {
    $($statisticUsers[1]).text(usersCount);
    $($statisticPv[1]).text(githubPageview);
    $($statisticPv[2]).text(resumePageview);
    $($statisticResume[1]).text(Number(resumeCount) + Number(resumeDownload));
  }
};

$(() => {
  particlesJS.load('login', '/vendor/particlesjs-config.json', Function.prototype);
  if ($('.statistic-container')[0]) {
    fetchStatistic()
      .then(data => renderStatistic(data))
      .then(() => {
        const heartBeat = new HeartBeat({
          interval: 1000 * 60 * 10, // 10 min
          callback: () => fetchStatistic().then(data => renderStatistic(data))
        });
        heartBeat.takeoff();
      });
  }
});
