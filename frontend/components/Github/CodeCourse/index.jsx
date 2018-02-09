import React from 'react';
import cx from 'classnames';
import { Label, Tipso, Loading } from 'light-ui';
import {
  randomColor,
  hex2Rgba,
} from 'UTILS/colors';
import { OPACITY } from 'UTILS/const-value';
import dateHelper from 'UTILS/date';
import {
  getOffsetLeft,
  getOffsetRight
} from 'UTILS/helper';
import github from 'UTILS/github';
import locales from 'LOCALES';
import ReposBaseInfo from '../ReposBaseInfo';
import cardStyles from '../styles/info_card.css';
import githubStyles from '../styles/github.css';

const getRamdomColor = randomColor();
const githubTexts = locales('github').sections.course;
const getSecondsByDate = dateHelper.seconds.getByDate;
const getRelativeTime = dateHelper.relative.hoursBefore;
const getValidateDate = dateHelper.validator.fullDate;
const getDateBySeconds = seconds =>
  dateHelper.validator.fullDateBySeconds(seconds).split('T')[0];

const SECONDS_PER_DAY = 24 * 60 * 60;
const oneDayOffset = (before, now) => now - before === SECONDS_PER_DAY;

class CodeCourse extends React.Component {
  constructor(props) {
    super(props);
    const yearAgo = dateHelper.date.beforeYears(1);
    const dayOfWeek = dateHelper.date.dayOfWeek(yearAgo);
    this.state = {
      showedCount: 10,
      yearAgoSeconds: getSecondsByDate(yearAgo) - dayOfWeek * SECONDS_PER_DAY,
      maxDateSeconds: getSecondsByDate(getValidateDate()),
      minDateSeconds: getSecondsByDate(dateHelper.date.beforeMonths(1, yearAgo)),
    }
  }

  getRepositoriesMap() {
    const { repositories } = this.props;
    const repositoriesMap = {};
    for (let i = 0; i < repositories.length; i += 1) {
      const repository = repositories[i];
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
        stargazers_count,
      } = repository;
      repositoriesMap[name] = {
        fork,
        language,
        html_url,
        created_at,
        pushed_at,
        description,
        forks_count,
        watchers_count,
        stargazers_count,
      };
    }
    return repositoriesMap;
  }

  formatRepositories() {
    const {
      showedCount,
      yearAgoSeconds,
      minDateSeconds,
      maxDateSeconds
    } = this.state;
    const results = [];
    const { commitDatas } = this.props;
    if (!commitDatas.length) return results;
    const repositoriesMap = this.getRepositoriesMap();

    for (let i = 0; i < showedCount; i += 1) {
      const commitData = commitDatas[i];
      const {
        name,
        login,
        commits,
        pushed_at,
        created_at,
        totalCommits,
      } = commitData;
      if (!totalCommits) continue;
      const timeline = [];
      let preCommit = null;
      let startCommitDaySeconds = null;
      let totalCommitsInRange = 0;

      for (let j = 0; j < commits.length; j += 1) {
        const commit = commits[j];
        const { days, total, week } = commit;
        for (let d = 0; d < days.length; d += 1) {
          const dailyCommit = days[d];
          const daySeconds = week - ((7 - d) * SECONDS_PER_DAY);
          if (daySeconds < minDateSeconds) continue;
          if (!dailyCommit) {
            if (preCommit) {
              if (timeline.length && timeline[timeline.length - 1].to === startCommitDaySeconds) {
                timeline[timeline.length - 1].to = daySeconds;
                timeline[timeline.length - 1].commits += totalCommitsInRange;
              } else {
                timeline.push({
                  to: daySeconds,
                  from: startCommitDaySeconds,
                  commits: totalCommitsInRange,
                });
              }
            }
            preCommit = null;
            startCommitDaySeconds = null;
            totalCommitsInRange = 0;
          } else {
            preCommit = dailyCommit;
            totalCommitsInRange += dailyCommit;
            if (!startCommitDaySeconds) startCommitDaySeconds = daySeconds;
          }
        }
      }
      if (preCommit) {
        timeline.push({
          to: commits[commits.length - 1].week,
          from: startCommitDaySeconds,
          commits: totalCommitsInRange,
        });
      }

      if (timeline[0].from > minDateSeconds) {
        timeline.unshift({
          commits: -1,
          to: timeline[0].from,
          from: minDateSeconds,
        });
      }

      const repository = repositoriesMap[name];
      results.push({
        name,
        login,
        timeline,
        totalCommits,
        ...repository,
        pushed_at: pushed_at || repository.pushed_at,
        created_at: created_at || repository.created_at,
      });
    }
    return results;
  }

  renderChosedRepos() {
    const { maxDateSeconds, minDateSeconds } = this.state;
    const formatRepositories = this.formatRepositories();

    return (
      <div className={githubStyles.reposTimelineContainer}>
        <div className={githubStyles.reposDates}>
          <div className={githubStyles.reposDate}>
            {getDateBySeconds(minDateSeconds)}
          </div>
          <div className={githubStyles.reposDate}>
            {getRelativeTime(getDateBySeconds(maxDateSeconds))}
          </div>
        </div>
        <div className={githubStyles.reposTimelines}>
          {this.renderTimeLines(formatRepositories)}
        </div>
        <div className={githubStyles.reposIntros}>
          {this.renderReposIntros(formatRepositories)}
        </div>
      </div>
    );
  }

  renderTimeLines(repos) {
    const {
      maxDateSeconds,
      minDateSeconds,
    } = this.state;
    const totalSeconds = maxDateSeconds - minDateSeconds;

    const offsetLeft = getOffsetLeft(minDateSeconds, maxDateSeconds);
    const offsetRight = getOffsetRight(minDateSeconds, maxDateSeconds);
    return repos.map((repository, index) => {
      const {
        timeline,
      } = repository;

      let color = repository.color;
      if (!color) {
        color = getRamdomColor();
        repository.color = color;
      }

      return (
        <div
          key={index}
          className={githubStyles.reposTimelineWrapper}
        >
          <div className={githubStyles.timelineWrapper}>
            {this.renderTimeline({
              color,
              timeline,
              totalSeconds
            })}
          </div>
        </div>
      );
    });
  }

  renderTimeline(options) {
    const {
      color,
      timeline,
      totalSeconds,
    } = options;
    const timelineDOMs = [<div key={'placeholder'} />];
    const {
      minDateSeconds,
    } = this.state;
    let preToSecond = minDateSeconds;
    for (let i = 0; i < timeline.length; i += 1) {
      const item = timeline[i];
      const {
        to,
        from,
        commits
      } = item;
      const width = ((to - from) * 100) / totalSeconds;
      const marginLeft = ((from - preToSecond) * 100) / totalSeconds;
      timelineDOMs.push(
        <Tipso
          key={i}
          theme="dark"
          wrapperClass={githubStyles.timelineTipso}
          wrapperStyle={{
            width: `${width}%`,
            marginLeft: `${marginLeft}%`,
          }}
          tipsoContent={
            <div className={githubStyles.timelineContent}>
              {getDateBySeconds(from)}~{getDateBySeconds(to)}<br/>
              {commits === -1
                  ? `Let it be`
                  : `${commits} commits`
              }
            </div>
          }
        >
          <div
            className={cx(
              githubStyles.timelineItem,
              commits === -1 && githubStyles.timelineOld,
            )}
            style={{
              backgroundColor: color,
            }}
          />
        </Tipso>
      );
      preToSecond = to - SECONDS_PER_DAY;
    }
    return timelineDOMs;
  }

  renderReposIntros(repos) {
    return repos.map((repository, index) => {
      const {
        name,
        fork,
        color,
        html_url,
        language,
        pushed_at,
        created_at,
        description,
        forks_count,
        watchers_count,
        stargazers_count,
      } = repository;
      const rgb = hex2Rgba(color);
      return (
        <div className={githubStyles.reposIntro} key={index}>
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

          <div className={githubStyles.tipso_wrapper}>
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
                ) : ''}
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
          </div>

        </div>
      );
    });
  }

  render() {
    const { repositories, loaded, className } = this.props;
    let component;
    if (!loaded) {
      component = (<Loading loading />);
    } else {
      component = (!repositories || !repositories.length)
        ? (<div className={cardStyles.empty_card}>{githubTexts.emptyText}</div>)
        : (<div>{this.renderChosedRepos()}</div>);
    }
    return (
      <div className={className}>
        {component}
      </div>
    );
  }
}

CodeCourse.defaultProps = {
  loaded: false,
  className: '',
  commitDatas: [],
  repositories: [],
};

export default CodeCourse;
