import React from 'react';
import ReactDOM from 'react-dom';
import Chart from 'chart.js';
import cx from 'classnames';
import objectAssign from 'object-assign';
import ScrollReveal from 'scrollreveal';
import { Loading, InfoCard, CardGroup } from 'light-ui';

import Api from 'API/index';
import github from 'UTILS/github';
import chart from 'UTILS/chart';
import { randomColor } from 'UTILS/colors';
import {
  sortByX,
  sortRepos,
  getMaxIndex,
  getFirstMatchTarget,
  sortLanguages
} from 'UTILS/helper';
import dateHelper from 'UTILS/date';
import { DAYS } from 'UTILS/const_value';
import { LINE_CONFIG } from 'SHARED/datas/chart_config';
import styles from '../styles/github.css';
import sharedStyles from '../../shared/styles/mobile.css';
import Slick from '../../shared/components/Slick';
import locales from 'LOCALES';
import USER from 'SRC/data/user';

const sortByLanguageStar = sortByX('star');
const githubLocales = locales('github');
const githubTexts = githubLocales.sections;
const getDateBySeconds = dateHelper.date.bySeconds;

class GitHubMobileShare extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: objectAssign({}, USER),
      reposLoaded: false,
      commitLoaded: false,
      repos: [],
      commits: [],
      commitDatas: {
        dailyCommits: [],
        total: 0,
        commits: []
      },
      reposLanguages: [],
      languageDistributions: {},
      languageSkills: [],
      languageUsed: {}
    };
    this.reposChart = null;
    this.languageSkillChart = null;
    this.commitsYearlyReviewChart = null;
  }

  componentDidMount() {
    this.getGithubUser();
    this.getGithubRepos();
  }

  componentDidUpdate(preProps, preState) {
    this.renderCharts();
    const { reposLoaded, commitLoaded } = this.state;
    if (reposLoaded && !preState.reposLoaded) {
      this.getGithubCommits();
    }
    reposLoaded && commitLoaded && this.initialScrollReveal();
    commitLoaded && !preState.commitLoaded && this.renderReposChart();
  }

  async getGithubUser() {
    const { login } = this.props;
    const user = await Api.github.getUser(login);
    this.setState({ user });
  }

  async getGithubCommits() {
    const { login } = this.props;
    const result = await Api.github.getCommits(login);
    this.setGithubCommits(result.commits);
  }

  async getGithubRepos() {
    const { login } = this.props;
    const result = await Api.github.getRepos(login);
    this.setGithubRepos(result.repos);
  }

  setGithubCommits(commits = []) {
    this.setState({
      commitLoaded: true,
      commits,
      commitDatas: github.combineReposCommits(commits),
    });
  }

  setGithubRepos(repos = []) {
    this.setState({
      repos: repos.sort(sortRepos()),
      languageDistributions: github.getLanguageDistribution(repos),
      languageSkills: github.getLanguageSkill(repos),
      reposLanguages: [...github.getReposLanguages(repos)],
      languageUsed: github.getLanguageUsed(repos),
      reposLoaded: true,
    });
  }

  initialScrollReveal() {
    const sr = ScrollReveal({ reset: true });
    sr.reveal('#repos_chart', { duration: 150 });
    sr.reveal('#skill_chart', { duration: 150 });
    sr.reveal('#commits_chart', { duration: 150 });

    sr.reveal('#commits_wrapper', { duration: 150 });
    sr.reveal('#repos_wrapper', { duration: 150 });
    sr.reveal('#language_wrapper', { duration: 150 });
  }

  renderCharts() {
    const { repos, commitDatas } = this.state;
    const { commits } = commitDatas;
    if (repos.length) {
      !this.reposChart && this.renderReposChart();
      !this.languageSkillChart && this.renderLanguagesChart();
    }
    if (commits.length) {
      !this.commitsYearlyReviewChart && this.renderYearlyChart(commits);
    }
  }

  renderYearlyChart(commits) {
    const commitsChart = ReactDOM.findDOMNode(this.commitsYearlyChart);
    const commitDates = [];
    const dateLabels = [];

    const monthlyCommits = {};
    commits.forEach((item) => {
      const endDate = getDateBySeconds(item.week);
      const [year, month, day] = endDate.split('-');
      const sliceIndex = parseInt(day, 10) < 7 ? (7 - parseInt(day, 10)) : 0;

      const thisMonthKey = `${year}-${parseInt(month, 10)}`;
      const totalCommits = item.days.slice(sliceIndex).reduce((pre, next) => pre + next, 0);
      const targetCommits = monthlyCommits[thisMonthKey];
      monthlyCommits[thisMonthKey] = isNaN(targetCommits) ? totalCommits : totalCommits + targetCommits;

      if (sliceIndex > 0) {
        const preMonthKey = parseInt(month, 10) - 1 <= 0 ?
          `${parseInt(year, 10) - 1}-12` :
          `${year}-${parseInt(month, 10) - 1}`;
        const preTotalCommits = item.days.slice(0, sliceIndex).reduce((pre, next) => pre + next, 0);
        const preTargetCommits = monthlyCommits[preMonthKey];
        monthlyCommits[preMonthKey] = isNaN(preTargetCommits) ? preTotalCommits : preTotalCommits + preTargetCommits;
      }
    });

    Object.keys(monthlyCommits).forEach((key) => {
      commitDates.push(monthlyCommits[key]);
      dateLabels.push(key);
    });
    // this.monthlyCommits = {
    //   commitDates,
    //   dateLabels
    // };

    // commits.forEach((item) => {
    //   commitDates.push(item.total);
    //   dateLabels.push(
    //     `${getDateBySeconds(item.week - 7 * 24 * 60 * 60)} ~ ${getDateBySeconds(item.week)}`
    //   );
    // });
    this.commitsYearlyReviewChart = new Chart(commitsChart, {
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
            ticks: {
              beginAtZero: true,
            }
          }],
        },
        // tooltips: {
        //   callbacks: {
        //     title: (item, data) => {
        //       return `${item[0].xLabel} ~ ${dateHelper.date.afterDays(7, item[0].xLabel)}`
        //     },
        //     label: (item, data) => {
        //       return `${item.yLabel} commits this week`
        //     }
        //   }
        // }
      }
    });
  }

  renderLanguagesChart() {
    const { languageSkills } = this.state;

    const languages = [], skills = [];
    const languageArray = Object.keys(languageSkills).filter(language => languageSkills[language] && language !== 'null').slice(0, 6).map(language => ({ star: languageSkills[language], language })).sort(sortByLanguageStar);
    languageArray.forEach((obj) => {
      languages.push(obj.language);
      skills.push(obj.star);
    });

    const languageSkill = ReactDOM.findDOMNode(this.languageSkill);
    this.languageSkillChart = new Chart(languageSkill, {
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
        legend: {
          display: false,
        },
        tooltips: {
          enabled: false,
        }
      }
    });
  }

  renderReposChart() {
    const { commits, repos } = this.state;
    const renderedRepos = repos.slice(0, 10);
    const datasets = [
      chart.repos.starsDatasets(renderedRepos),
      chart.repos.forksDatasets(renderedRepos)
    ];
    if (commits.length) {
      datasets.push(
        chart.repos.commitsDatasets(renderedRepos, commits)
      );
    }
    const reposReview = ReactDOM.findDOMNode(this.reposReview);
    this.reposChart = new Chart(reposReview, {
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
        // legend: {
        //   display: false,
        // },
        scales: {
          xAxes: [{
            display: false,
            gridLines: {
              display:false
            }
          }],
          yAxes: [{
            display: false,
            gridLines: {
              display:false
            },
            ticks: {
              beginAtZero:true
            }
          }]
        },
      }
    });
  }

  renderCommitsInfo() {
    const { commitDatas, commits } = this.state;
    const { dailyCommits, total } = commitDatas;
    // commits
    const totalCommits = commits[0] ? commits[0].totalCommits : 0;
    // day info
    const maxIndex = getMaxIndex(dailyCommits);
    const dayName = DAYS[maxIndex];
    // first commit
    const [firstCommitWeek, firstCommitIndex] = getFirstMatchTarget(commitDatas.commits, (item) => item.total);
    const [firstCommitDay, dayIndex] = getFirstMatchTarget(firstCommitWeek.days, (day) => day > 0);
    const firstCommitDate = getDateBySeconds(firstCommitWeek.week + dayIndex * 24 * 60 * 60);

    return (
      <CardGroup
        id="commits_wrapper"
        className={cx(
          styles["info_with_chart_wrapper"],
          sharedStyles["info_share"]
        )}>
        <CardGroup>
          <InfoCard
            mainText={parseInt(total / 52, 10)}
            subText={githubTexts.commits.averageCount}
            mainTextStyle={sharedStyles["main_text"]}
          />
          <InfoCard
            mainText={totalCommits}
            subText={githubTexts.commits.maxCommitCount}
            mainTextStyle={sharedStyles["main_text"]}
          />
        </CardGroup>
        <CardGroup>
          <InfoCard
            mainText={dayName}
            subText={githubTexts.commits.maxDay}
            mainTextStyle={sharedStyles["main_text"]}
          />
          <InfoCard
            mainText={firstCommitDate}
            subText={githubTexts.commits.firstCommit}
            mainTextStyle={sharedStyles["main_text"]}
          />
        </CardGroup>
      </CardGroup>
    );
  }

  renderReposInfo() {
    const { repos } = this.state;
    const [totalStar, totalFork] = github.getTotalCount(repos);

    const maxStaredRepos = repos[0] ? repos[0].name : '';
    const maxStaredPerRepos = repos[0] ? repos[0]['stargazers_count'] : 0;
    const yearlyRepos = github.getYearlyRepos(repos);

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
        wrapperId="repos_wrapper"
        sliders={sliders}
      />
    );
  }

  renderLanguageLines() {
    const { languageUsed } = this.state;
    const color = randomColor();
    const languages = Object.keys(languageUsed).sort(sortLanguages(languageUsed)).slice(0, 9);
    const maxUsedCounts = languageUsed[languages[0]];
    const languagesCount = languages.length;

    return languages.map((language, index) => {
      const style = {
        backgroundColor: color,
        opacity: `${(languagesCount - index) / languagesCount}`,
      };
      const barStyle = {
        width: `${(languageUsed[language] * 100 / maxUsedCounts).toFixed(2)}%`
      };
      return (
        <div className={styles["repos_item"]} key={index}>
          <div
            style={barStyle}
            className={styles["item_chart"]}>
            <div
              style={style}
              className={styles["commit_bar"]}></div>
          </div>
          <div className={styles["item_data"]}>
            {language}
          </div>
        </div>
      );
    });
  }

  render() {
    const {
      user,
      commits,
      reposLoaded,
      commitLoaded,
      languageSkills,
      languageDistributions
    } = this.state;
    const { updated_at } = user;

    if (!reposLoaded) {
      return (
        <div className={sharedStyles["loading_container"]}>
          <Loading loading={true} />
        </div>
      );
    }

    const reposCount = Object.keys(languageDistributions).map(key => languageDistributions[key]);
    const starCount = Object.keys(languageSkills).map(key => languageSkills[key]);
    const maxReposCountIndex = getMaxIndex(reposCount);
    const maxStarCountIndex = getMaxIndex(starCount);

    return (
      <div className={styles["not_admin"]}>
        <div className={cx(sharedStyles["mobile_card"], styles["mobile_card_full"])}>
          <div
            id="repos_chart"
            className={cx(sharedStyles["info_chart"], styles["repos_chart"])}>
            <canvas
              className={styles["max_canvas"]}
              ref={ref => this.reposReview = ref}></canvas>
          </div>
          {this.renderReposInfo()}
        </div>

        <div className={
          cx(
            sharedStyles["mobile_card"],
            styles["mobile_card_full"],
            styles["languages_line"]
          )
        }>
          <div className={styles["repos_wrapper"]}>
            <div className={styles["repos_contents_wrapper"]}>
              <div className={styles["repos_contents"]}>
                {reposLoaded ? this.renderLanguageLines() : ''}
              </div>
              <div className={styles["repos_yAxes"]}>
                <div className={styles["yAxes_text"]}>{githubTexts.languages.frequency}</div>
              </div>
            </div>
          </div>
        </div>

        <div className={cx(styles["mobile_card_full"], sharedStyles["mobile_card_with_info"])}>
          <CardGroup
            id="language_wrapper"
            className={cx(
              sharedStyles["info_with_chart"],
              sharedStyles["info_share"]
            )}>
            <InfoCard
              mainTextStyle={sharedStyles["main_text"]}
              mainText={Object.keys(languageDistributions)[maxReposCountIndex]}
              subText={githubTexts.languages.maxReposCountLanguage}
            />
            <InfoCard
              mainTextStyle={sharedStyles["main_text"]}
              mainText={Object.keys(languageSkills)[maxStarCountIndex]}
              subText={githubTexts.languages.maxStarLanguage}
            />
          </CardGroup>
          <div
            id="skill_chart"
            className={sharedStyles["info_chart"]} style={{ marginTop: '15px' }}>
            <canvas ref={ref => this.languageSkill = ref} className={sharedStyles["min_canvas"]}></canvas>
          </div>
        </div>

        {commitLoaded && commits.length ? (
          <div className={cx(styles["mobile_card_full"], sharedStyles["mobile_card_with_info"], styles["mobile_card_no_bottom"])}>
            {this.renderCommitsInfo()}
            <div
              id="commits_chart"
              className={sharedStyles["info_chart"]}>
              <strong>{githubTexts.commits.monthlyCommitChartTitle}</strong>
              <canvas
                className={sharedStyles["max_canvas"]}
                ref={ref => this.commitsYearlyChart = ref}></canvas>
            </div>
          </div>
        ) : ''}
      </div>
    );
  }
}

export default GitHubMobileShare;
