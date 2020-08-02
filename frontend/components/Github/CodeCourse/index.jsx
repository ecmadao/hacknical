
import React from 'react'
import cx from 'classnames'
import { Label, Tipso, Loading } from 'light-ui'
import {
  hex2Rgba,
  randomColor
} from 'UTILS/colors'
import { OPACITY, SECONDS_PER_DAY } from 'UTILS/constant'
import dateHelper from 'UTILS/date'
import githubHelper from 'UTILS/github'
import locales from 'LOCALES'
import ReposBaseInfo from '../ReposBaseInfo'
import cardStyles from '../styles/info_card.css'
import githubStyles from '../styles/github.css'

const getRamdomColor = randomColor('CodeCourse')
const githubTexts = locales('github').sections.course
const getSecondsByDate = dateHelper.seconds.getByDate
const getValidateDate = dateHelper.validator.fullDate
const getDateBySeconds = seconds =>
  dateHelper.validator.fullDateBySeconds(seconds).split('T')[0]
const formatCommitsTimeline = githubHelper.formatCommitsTimeline()

const yearAgo = dateHelper.date.beforeYears(1)
const maxDateSeconds = getSecondsByDate(getValidateDate())
const minDateSeconds = getSecondsByDate(dateHelper.date.beforeMonths(1, yearAgo))

class CodeCourse extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      showedCount: 10,
    }
  }

  get repositoriesDict() {
    if (this._repositoriesDict) return this._repositoriesDict
    const { repositories = [] } = this.props.data
    if (!repositories.length) return {}

    const repositoriesDict = {}
    for (let i = 0; i < repositories.length; i += 1) {
      const repository = repositories[i]
      const {
        name,
        fork,
        language,
        html_url,
        created_at,
        pushed_at,
        forks_count,
        description,
        watchers_count,
        stargazers_count
      } = repository
      const color = getRamdomColor(name)

      repositoriesDict[name] = {
        fork,
        color,
        language,
        html_url,
        created_at,
        pushed_at,
        description,
        forks_count,
        watchers_count,
        stargazers_count
      }
    }
    this._repositoriesDict = repositoriesDict
    return repositoriesDict
  }

  get formatedRepositories() {
    const { commitDatas } = this.props.data
    const repositoriesDict = this.repositoriesDict
    const showedCount = Math.min(this.state.showedCount, commitDatas.length)

    return formatCommitsTimeline(
      commitDatas.slice(0, showedCount),
      repositoriesDict,
      minDateSeconds
    )
  }

  renderChosedRepos() {
    const formatRepositories = this.formatedRepositories

    return (
      <div className={githubStyles.reposTimelineContainer}>
        <div className={githubStyles.reposDates}>
          <div className={githubStyles.reposDate}>
            {getDateBySeconds(minDateSeconds)}
          </div>
          <div className={githubStyles.reposDate}>
            {getDateBySeconds(maxDateSeconds)}
          </div>
        </div>
        <div className={githubStyles.reposTimelines}>
          {this.renderTimeLines(formatRepositories)}
        </div>
        <div className={githubStyles.reposIntros}>
          {this.renderReposIntros(formatRepositories)}
        </div>
      </div>
    )
  }

  renderTimeLines(repos) {
    const totalSeconds = maxDateSeconds - minDateSeconds

    return repos.map((repository, index) => {
      const {
        name,
        color,
        timeline
      } = repository

      return (
        <div
          key={index}
          className={githubStyles.reposTimelineWrapper}
        >
          <div className={githubStyles.timelineWrapper}>
            {this.renderTimeline({
              name,
              color,
              timeline,
              totalSeconds
            })}
          </div>
        </div>
      )
    })
  }

  renderTimeline(options) {
    const {
      name,
      color,
      timeline,
      totalSeconds
    } = options
    const timelineDOMs = [<div key={'placeholder'} />]
    let preToSecond = minDateSeconds
    let preCommit = null

    for (let i = 0; i < timeline.length; i += 1) {
      const item = timeline[i]
      const {
        to,
        from,
        commits
      } = item
      const width = ((to + SECONDS_PER_DAY - from) * 100) / totalSeconds
      const marginLeft = ((from - preToSecond) * 100) / totalSeconds

      timelineDOMs.push(
        <Tipso
          key={i}
          theme="dark"
          wrapperClass={githubStyles.timelineTipso}
          wrapperStyle={{
            width: `${width}%`,
            marginLeft: `${marginLeft}%`
          }}
          tipsoContent={
            <div className={githubStyles.timelineContent}>
              {name}<br/>
              {getDateBySeconds(from)} ~ {getDateBySeconds(to)}<br/>
              {commits === -1
                ? githubTexts.emptyCommit
                : `${commits} commits`
              }
            </div>
          }
        >
          <div
            className={cx(
              githubStyles.timelineItem,
              commits === -1 && githubStyles.timelineOld,
              preCommit === -1 && githubStyles.timelineNew
            )}
            style={{
              backgroundColor: color,
            }}
          />
        </Tipso>
      )
      preToSecond = to
      preCommit = commits
    }
    return timelineDOMs
  }

  renderReposIntros(repos) {
    return repos.map((repository, index) => {
      const {
        name,
        fork,
        html_url,
        language,
        pushed_at,
        created_at,
        description,
        forks_count,
        watchers_count,
        stargazers_count
      } = repository

      const color = repository.color || getRamdomColor(name)
      const rgb = hex2Rgba(color)

      return (
        <Tipso
          key={index}
          tipsoContent={(
            <div className={cx(githubStyles.tipso_container, githubStyles.tipso_large)}>
              <span className={githubStyles.tipso_title}>
                <a
                  href={html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {name}
                </a>
                <Label
                  color="darkLight"
                  theme="ghost"
                  clickable={false}
                  text={`<${language}>`}
                  style={{ lineHeight: 'normal' }}
                />
                {fork ? (
                  <Label
                    min
                    color="darkLight"
                    text="forked"
                    icon="code-fork"
                    clickable={false}
                    className={githubStyles.reposLabel}
                  />
                ) : null}
              </span>
              <div className={githubStyles.tipso_line} />
              <ReposBaseInfo
                stargazers={stargazers_count}
                forks={forks_count}
                watchers={watchers_count}
              />
              <br />
              <span>
                {getValidateDate(created_at)} ~ {getValidateDate(pushed_at)}
              </span>
            </div>
          )}
        >
          <div className={githubStyles.reposIntro}>
            <div
              className={githubStyles.reposIntroLine}
              style={{
                background: `linear-gradient(to bottom, ${rgb(OPACITY.max)}, ${rgb(OPACITY.max)})`
              }}
            />
            <div className={githubStyles.introInfoWrapper}>
              <div className={githubStyles.introInfo}>
                <a
                  className={githubStyles.introTitle}
                  href={html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {name}
                </a>
                <br />
                <span>{description}</span>
              </div>
            </div>
          </div>
        </Tipso>
      )
    })
  }

  render() {
    const { loaded, className } = this.props
    const { repositories } = this.props.data

    let component
    if (!loaded) {
      component = (<Loading loading />)
    } else {
      component = (!repositories || !repositories.length)
        ? <div className={cardStyles.empty_card}>{githubTexts.emptyText}</div>
        : <div>{this.renderChosedRepos()}</div>
    }
    return (
      <div className={className}>
        {component}
      </div>
    )
  }
}

CodeCourse.defaultProps = {
  loaded: false,
  className: '',
  data: {
    commitDatas: [],
    repositories: []
  }
}

export default CodeCourse
