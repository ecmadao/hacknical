
import 'particles.js'
import './login.css'
import API from 'API'
import { sleep } from 'UTILS/helper'
import HeartBeat from 'UTILS/heartbeat'
import { formatNumber } from 'UTILS/formatter'

const countUp = (options = {}) => {
  const {
    elem, // 数字要变化的元素
    endVal = 100, // 最终显示数字
    startVal = 0, // 数字变化开始值
    duration = 1500, // 变化持续时间 (ms)
  } = options
  let startTime = 0
  const dec = 1
  let progress
  let value

  elem.innerHTML = ''

  const startCount = (timestamp) => {
    if (!startTime) startTime = timestamp
    progress = timestamp - startTime
    value = startVal + ((endVal - startVal) * (progress / duration))
    value = (value > endVal) ? endVal : value
    value = Math.floor(value * dec) / dec
    elem.innerHTML = formatNumber(value)
    progress < duration && requestAnimationFrame(startCount)
  }
  requestAnimationFrame(startCount)
}

const NUMBER_CLASS = 'statistic-count'

const statisticTemplate = `
  <div class="statistic">
    <span class="${NUMBER_CLASS}"></span>
    <span>·</span>
    <span class="${NUMBER_CLASS}"></span>
    <span>·</span>
    <span class="${NUMBER_CLASS}"></span>
  </div>
`

const renderNumber = ($container, num, animation = true) => {
  if (animation) {
    countUp({
      elem: $container,
      endVal: num
    })
  } else {
    $container.innerHTML = formatNumber(num)
  }
}

const DEFAULT_NUM = 1111

const renderStatistic = async (statistic, animation = true) => {
  const {
    users,
    github = {},
    resume = {},
  } = statistic
  $('.statistic-loading').remove()
  $('.statistic').remove()
  $('.statistic-container').prepend(statisticTemplate)
  await sleep(100)

  const usersCount = Number(users || DEFAULT_NUM)
  const githubPageview = (github && github.pageview) || DEFAULT_NUM
  const resumePageview = (resume && resume.pageview) || DEFAULT_NUM
  const resumeCount = (resume && resume.count) || DEFAULT_NUM
  const resumeDownload = (resume && resume.download) || DEFAULT_NUM

  const pv = Number(githubPageview) + Number(resumePageview)
  const resumeNum = Number(resumeCount) + Number(resumeDownload)

  const $statisticContainer = $(`.${NUMBER_CLASS}`)
  renderNumber($statisticContainer[0], usersCount, animation)
  renderNumber($statisticContainer[1], pv, animation)
  renderNumber($statisticContainer[2], resumeNum, animation)

  $('.statistic-users').text(usersCount)
  $('.statistic-github-pv').text(githubPageview)
  $('.statistic-resume-pv').text(resumePageview)
  $('.statistic-resume').text(resumeNum)
}

$(() => {
  particlesJS.load('login', '/vendor/particlesjs-config.json', Function.prototype)

  const heartBeat = new HeartBeat({
    interval: 1000 * 60 * 10, // 10 min
    callback: () => API.home.statistic().then(data => renderStatistic(data))
  })
  heartBeat.takeoff()
})
