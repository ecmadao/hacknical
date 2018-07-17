/* eslint new-cap: "off" */

import React from 'react';
import Chart from 'chart.js';
import cx from 'classnames';
import Headroom from 'headroom.js';
import objectAssign from 'UTILS/object-assign';
import ScrollReveal from 'scrollreveal';
import { InfoCard, CardGroup } from 'light-ui';
import FAB from 'COMPONENTS/FloatingActionButton';

import Api from 'API';
import github from 'UTILS/github';
import chart from 'UTILS/chart';
import {
  removeDOM,
  getMaxIndex,
  getFirstMatchTarget,
} from 'UTILS/helper';
import dateHelper from 'UTILS/date';
import { DAYS } from 'UTILS/constant';
import { LINE_CONFIG } from 'UTILS/constant/chart';
import styles from '../styles/github.css';
import sharedStyles from 'SHARED/styles/mobile.css';
import Slick from 'COMPONENTS/Slick';
import locales from 'LOCALES';
import Hotmap from 'COMPONENTS/GitHub/Hotmap';
import LanguageLines from 'COMPONENTS/GitHub/LanguageLines';
import 'SRC/vendor/mobile/github.css';
import message from 'UTILS/message';
import HeartBeat from 'UTILS/heartbeat';

const sortByLanguageStar = github.sortByX({ key: 'star' });
const githubLocales = locales('github');
const githubTexts = githubLocales.sections;
const githubMsg = githubLocales.message;
const getDateBySeconds = dateHelper.date.bySeconds;

class GitHubContent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      refreshEnable: false,
      refreshing: false,
    };
    this.reposChart = null;
    this.languageSkillChart = null;
    this.commitsYearlyReviewChart = null;
    this.refreshGithubDatas = this.refreshGithubDatas.bind(this);
  }

  componentDidMount() {
    this.fetchRefreshStatus();
    removeDOM('#loading', { async: true });
  }

  componentDidUpdate(preProps) {
    this.renderCharts();
    const { repositoriesLoaded, commitLoaded } = this.props;
    repositoriesLoaded && commitLoaded && this.initialScrollReveal();
    commitLoaded && !preProps.commitLoaded && this.renderRepositoriesChart();

    if (this.props.isAdmin && !this.headroom && this.refreshButton) {
      this.headroom = new Headroom(this.refreshButton, {
        classes: {
          initial: 'fab',
          pinned: 'fab-pinned',
          unpinned: 'fab-unpinned'
        }
      });
      this.headroom.init();
    }
  }

  async fetchRefreshStatus() {
    const { isAdmin } = this.props;
    if (!isAdmin) return;
    const result = await Api.github.getUpdateStatus();
    this.setRefreshStatus(result);
  }

  setRefreshStatus(data) {
    const { refreshEnable } = data;
    this.setState({
      refreshEnable,
      refreshing: false,
    });
  }

  refreshGithubDatas() {
    if (!this.state.refreshEnable) {
      message.error(githubMsg.update.error);
      return;
    }
    this.setState({ refreshing: true });
    Api.github.update().then(() => {
      const heartBeat = new HeartBeat({
        interval: 3000, // 3s
        callback: () => Api.github.getUpdateStatus().then((result) => {
          if (result && Number(result.status) === 1) {
            heartBeat.stop();
            this.setRefreshStatus(result);
            window.location.reload(false);
          }
        })
      });
      heartBeat.takeoff();
    });
  }

  initialScrollReveal() {
    const sr = ScrollReveal({ reset: true });
    try {
      sr.reveal('#reposChart', { duration: 150 });
      sr.reveal('#skillChart', { duration: 150 });
      sr.reveal('#commitsChart', { duration: 150 });
      // sr.reveal('#commitsWrapper', { duration: 150 });
      sr.reveal('#reposWrapper', { duration: 150 });
      // sr.reveal('#languageWrapper', { duration: 150 });
    } catch (e) {
      console.error(e);
    }
  }

  renderCharts() {
    const { repositories, commitInfos } = this.props;
    const { commits } = commitInfos;
    if (repositories.length) {
      !this.reposChart && this.renderRepositoriesChart();
      !this.languageSkillChart && this.renderLanguagesChart();
    }
    if (commits.length) {
      !this.commitsYearlyReviewChart && this.renderYearlyChart(commits);
    }
  }

  renderYearlyChart(commits) {
    const commitDates = [];
    const dateLabels = [];

    const monthlyCommits = {};

    for (const commit of commits) {
      const endDate = getDateBySeconds(commit.week);
      const [year, month, day] = endDate.split('-');
      const sliceIndex = parseInt(day, 10) < 7 ? (7 - parseInt(day, 10)) : 0;

      const thisMonthKey = `${year}-${parseInt(month, 10)}`;
      const totalCommits = commit.days.slice(sliceIndex).reduce(
        (pre, next) => pre + next, 0
      );
      const targetCommits = monthlyCommits[thisMonthKey];
      monthlyCommits[thisMonthKey] = Number.isNaN(targetCommits)
        ? totalCommits
        : totalCommits + targetCommits;

      if (sliceIndex > 0) {
        const preMonthKey = parseInt(month, 10) - 1 <= 0
          ? `${parseInt(year, 10) - 1}-12`
          : `${year}-${parseInt(month, 10) - 1}`;
        const preTotalCommits = commit.days.slice(0, sliceIndex)
          .reduce((pre, next) => pre + next, 0);
        const preTargetCommits = monthlyCommits[preMonthKey];
        monthlyCommits[preMonthKey] = Number.isNaN(preTargetCommits)
          ? preTotalCommits
          : preTotalCommits + preTargetCommits;
      }
    }

    for (const key of Object.keys(monthlyCommits)) {
      commitDates.push(monthlyCommits[key]);
      dateLabels.push(key);
    }
    this.commitsYearlyReviewChart = new Chart(this.commitsYearlyChart, {
      type: 'line',
      data: {
        labels: dateLabels,
        datasets: [objectAssign({}, LINE_CONFIG, {
          data: commitDates,
          label: '',
          pointHoverRadius: 2,
          pointHoverBorderWidth: 2,
          pointHitRadius: 2,
          pointBorderWidth: 1,
          pointRadius: 2,
        })]
      },
      options: {
        title: {
          display: false,
        },
        legend: {
          display: false,
        },
        scales: {
          xAxes: [{
            display: false,
            gridLines: {
              display: false
            }
          }],
          yAxes: [{
            display: false,
            gridLines: {
              display: false
            },
            ticks: { beginAtZero: true, }
          }],
        },
      }
    });
  }

  renderLanguagesChart() {
    const { languageSkills } = this.props;

    const languages = [];
    const skills = [];
    const languageArray = Object.keys(languageSkills)
      .filter(language => languageSkills[language] && language !== 'null')
      .slice(0, 6)
      .map(language => ({ star: languageSkills[language], language }))
      .sort(sortByLanguageStar);

    for (const obj of languageArray) {
      languages.push(obj.language);
      skills.push(obj.star);
    }

    this.languageSkillChart = new Chart(this.languageSkill, {
      type: 'radar',
      data: {
        labels: languages,
        datasets: [chart.radar(skills)]
      },
      options: {
        title: {
          display: true,
          text: githubTexts.languages.starChart.title
        },
        legend: { display: false, },
        tooltips: { enabled: false, }
      }
    });
  }

  renderRepositoriesChart() {
    const { commitDatas, repositories } = this.props;
    const renderedRepos = repositories.slice(0, 10);
    const datasets = [
      chart.repos.starsDatasets(renderedRepos),
      chart.repos.forksDatasets(renderedRepos)
    ];
    if (commitDatas.length) {
      datasets.push(
        chart.repos.commitsDatasets(renderedRepos, commitDatas)
      );
    }
    this.reposChart = new Chart(this.reposReview, {
      type: 'bar',
      data: {
        datasets,
        labels: github.getReposNames(renderedRepos)
      },
      options: {
        title: {
          display: false,
          text: ''
        },
        scales: {
          xAxes: [{
            display: false,
            gridLines: {
              display: false
            }
          }],
          yAxes: [{
            display: false,
            gridLines: {
              display: false
            },
            ticks: {
              beginAtZero: true
            }
          }]
        },
      }
    });
  }

  renderCommitsInfo() {
    const { commitInfos, commitDatas } = this.props;
    const { total, dailyCommits } = commitInfos;
    // commits
    const totalCommits = commitDatas[0] ? commitDatas[0].totalCommits : 0;
    // day info
    const maxIndex = getMaxIndex(dailyCommits);
    const dayName = DAYS[maxIndex];
    // first commit
    const firstCommitWeek = getFirstMatchTarget(
      commitInfos.commits, item => item.total
    )[0];
    const dayIndex = getFirstMatchTarget(
      firstCommitWeek.days, day => day > 0
    )[1];
    const firstCommitDate = getDateBySeconds(
      firstCommitWeek.week + (dayIndex * 24 * 60 * 60)
    );

    return (
      <CardGroup
        id="commitsWrapper"
        className={cx(
          styles.info_with_chart_wrapper,
          sharedStyles.info_share
        )}
      >
        <CardGroup>
          <InfoCard
            tipsoTheme="dark"
            mainText={parseInt(total / 52, 10)}
            subText={githubTexts.commits.averageCount}
            mainTextStyle={sharedStyles.main_text}
          />
          <InfoCard
            tipsoTheme="dark"
            mainText={totalCommits}
            subText={githubTexts.commits.maxCommitCount}
            mainTextStyle={sharedStyles.main_text}
          />
        </CardGroup>
        <CardGroup>
          <InfoCard
            tipsoTheme="dark"
            mainText={dayName}
            subText={githubTexts.commits.maxDay}
            mainTextStyle={sharedStyles.main_text}
          />
          <InfoCard
            tipsoTheme="dark"
            mainText={firstCommitDate}
            subText={githubTexts.commits.firstCommit}
            mainTextStyle={sharedStyles.main_text}
          />
        </CardGroup>
      </CardGroup>
    );
  }

  renderRepositoriesInfo() {
    const { repositories } = this.props;
    const [totalStar, totalFork] = github.getTotalCount(repositories);

    const maxStaredRepos = repositories[0] ? repositories[0].name : '';
    const maxStaredPerRepos = repositories[0] ? repositories[0].stargazers_count : 0;
    const yearlyRepos = github.getYearlyRepos(repositories);

    const sliders = [
      {
        icon: 'star-o',
        mainText: totalStar,
        subText: githubTexts.repos.starsCount
      },
      {
        icon: 'code-fork',
        mainText: totalFork,
        subText: githubTexts.repos.forksCount
      },
      {
        icon: 'cubes',
        mainText: yearlyRepos.length,
        subText: githubTexts.repos.reposCount
      },
      {
        icon: 'cube',
        mainText: maxStaredRepos,
        subText: githubTexts.repos.popularestRepos
      },
      {
        icon: 'star',
        mainText: maxStaredPerRepos,
        subText: githubTexts.repos.maxStarPerRepos
      }
    ];

    return (
      <Slick
        wrapperId="reposWrapper"
        sliders={sliders}
      />
    );
  }

  render() {
    const { refreshing } = this.state;
    const {
      user,
      languages,
      commitDatas,
      commitLoaded,
      languageUsed,
      languageSkills,
      repositoriesLoaded,
      languageDistributions
    } = this.props;

    const { isAdmin, login, isShare } = this.props;

    if (!repositoriesLoaded) return null;

    const reposCount = Object.keys(languageDistributions)
      .map(key => languageDistributions[key]);
    const starCount = Object.keys(languageSkills)
      .map(key => languageSkills[key]);
    const maxReposCountIndex = getMaxIndex(reposCount);
    const maxStarCountIndex = getMaxIndex(starCount);

    return (
      <div className={styles.notAdmin}>
        <div className={styles.shareHeader}>
          <img src={user['avatar_url']} /><br/>
          <span>
            {user.name}, {githubTexts.baseInfo.joinedAt}{user['created_at'].split('T')[0]}
          </span>
          {user.bio ? (<blockquote>{user.bio}</blockquote>) : null}
          <div className={styles.social}>
            <div className={styles.socialInfo}>
              <span>{user['public_repos']}</span><br/>
              <span>Repositories</span>
            </div>
            <div className={styles.socialInfo}>
              <span>{user.followers}</span><br/>
              <span>Followers</span>
            </div>
            <div className={styles.socialInfo}>
              <span>{user.following}</span><br/>
              <span>Following</span>
            </div>
          </div>
        </div>
        <Hotmap
          login={login}
          renderCards={false}
          className={styles.hotmapContainer}
        />
        <div className={cx(sharedStyles.mobile_card, styles.mobile_card_full)}>
          <div
            id="reposChart"
            className={cx(sharedStyles.info_chart, styles.repos_chart)}
          >
            <canvas
              className={styles.max_canvas}
              ref={ref => (this.reposReview = ref)}
            />
          </div>
          {this.renderRepositoriesInfo()}
        </div>

        <div
          className={cx(
            sharedStyles.mobile_card,
            styles.mobile_card_full,
            styles.languages_line
          )}
        >
          <LanguageLines
            dynamicOpacity
            languages={languages}
            languageUsed={languageUsed}
            loaded={repositoriesLoaded}
          />
        </div>

        <div
          className={cx(
            styles.mobile_card_full,
            sharedStyles.mobile_card_with_info
          )}
        >
          <CardGroup
            id="languageWrapper"
            className={cx(
              sharedStyles.info_with_chart,
              sharedStyles.info_share
            )}
          >
            <InfoCard
              tipsoTheme="dark"
              mainTextStyle={sharedStyles.main_text}
              mainText={Object.keys(languageDistributions)[maxReposCountIndex]}
              subText={githubTexts.languages.maxReposCountLanguage}
            />
            <InfoCard
              tipsoTheme="dark"
              mainTextStyle={sharedStyles.main_text}
              mainText={Object.keys(languageSkills)[maxStarCountIndex]}
              subText={githubTexts.languages.maxStarLanguage}
            />
          </CardGroup>
          <div
            id="skillChart"
            className={sharedStyles.info_chart}
            style={{ marginTop: '15px' }}
          >
            <canvas
              ref={ref => (this.languageSkill = ref)}
              className={sharedStyles.min_canvas}
            />
          </div>
        </div>

        {commitLoaded && commitDatas.length ? (
          <div
            className={cx(
              styles.mobile_card_full,
              sharedStyles.mobile_card_with_info,
              styles.mobile_card_no_bottom
            )}
          >
            {this.renderCommitsInfo()}
            <div
              id="commitsChart"
              className={sharedStyles.info_chart}
            >
              <strong>{githubTexts.commits.monthlyCommitChartTitle}</strong>
              <canvas
                className={sharedStyles.max_canvas}
                ref={ref => (this.commitsYearlyChart = ref)}
              />
            </div>
          </div>
        ) : null}

        {isAdmin && !isShare ? (
          <div ref={ref => (this.refreshButton = ref)}>
            <FAB
              icon="refresh"
              color="dark"
              onClick={this.refreshGithubDatas}
              className={refreshing ? styles.roating : ''}
              disabled={refreshing}
            />
          </div>
        ) : null}
      </div>
    );
  }
}

GitHubContent.defaultProps = {
  isShare: false,
  login: window.login,
  isAdmin: window.isAdmin === 'true',
};

export default GitHubContent;
