import React from 'react';
import cx from 'classnames';
import { Loading, Label } from 'light-ui';
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

const githubTexts = locales('github').sections.course;
const getSecondsByDate = dateHelper.seconds.getByDate;
const getRelativeTime = dateHelper.relative.hoursBefore;
const getValidateDate = dateHelper.validator.fullDate;

class CodeCourse extends React.Component {
  constructor(props) {
    super(props);
    this.minDate = null;
    this.maxDate = null;
  }

  renderChosedRepos() {
    const { userRepos } = this.props;
    const sortedRepos = github.sortByDate(userRepos.slice(0, 20));

    this.minDate = dateHelper.validator.full(sortedRepos[0].created_at);
    this.maxDate = github.getMaxDate(sortedRepos);
    return (
      <div className={githubStyles.repos_timeline_container}>
        <div className={githubStyles.repos_dates}>
          <div
            className={githubStyles.repos_date}
          >
            {getRelativeTime(this.minDate)}
          </div>
          <div
            className={githubStyles.repos_date}
          >
            {getRelativeTime(this.maxDate)}
          </div>
        </div>
        <div className={githubStyles.repos_timelines}>
          {this.renderTimeLine(sortedRepos)}
        </div>
        <div className={githubStyles.repos_intros}>
          {this.renderReposIntros(sortedRepos)}
        </div>
      </div>
    );
  }

  renderTimeLine(repos) {
    const { showedRepository } = this.props;
    const minDate = getSecondsByDate(this.minDate);
    const maxDate = getSecondsByDate(this.maxDate);

    const offsetLeft = getOffsetLeft(minDate, maxDate);
    const offsetRight = getOffsetRight(minDate, maxDate);
    return repos.map((repository, index) => {
      const {
        name,
        fork,
        language,
        html_url,
        created_at,
        pushed_at,
        forks_count,
        watchers_count,
        stargazers_count,
      } = repository;

      const left = offsetLeft(getSecondsByDate(created_at));
      const right = offsetRight(getSecondsByDate(pushed_at));
      let color = repository.color;
      if (!color) {
        color = randomColor();
        repository.color = color;
      }

      const isActive = showedRepository === name;
      const wrapperClass = cx(
        githubStyles.repos_timeline_wrapper,
        isActive && githubStyles.active
      );
      const tipsoClass = cx(
        githubStyles.tipso_wrapper,
        isActive && githubStyles.active
      );

      return (
        <div
          key={index}
          className={wrapperClass}
          style={{ marginLeft: left, marginRight: right }}
        >
          <div
            style={{ backgroundColor: color }}
            className={githubStyles.repos_timeline}
          />
          <div className={tipsoClass}>
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

  renderReposIntros(repos) {
    const { showedRepository } = this.props;
    return repos.map((repository, index) => {
      const { name, description, color, html_url } = repository;
      const rgb = hex2Rgba(color);
      const isTarget = name === showedRepository;
      const opacity = isTarget ? OPACITY.min : OPACITY.max;
      const infoClass = cx(
        githubStyles.intro_info,
        isTarget && githubStyles.with_readme
      );
      return (
        <div className={githubStyles.repos_intro} key={index}>
          <div
            className={githubStyles.intro_line}
            style={{ background: `linear-gradient(to bottom, ${rgb(OPACITY.max)}, ${rgb(opacity)})` }}
          />
          <div className={githubStyles.intro_info_wrapper}>
            <div className={infoClass}>
              <a
                className={githubStyles.intro_title}
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
      );
    });
  }

  renderReposReadme(readme) {
    if (readme) {
      return (
        <div
          className="readme_container wysiwyg"
          dangerouslySetInnerHTML={{ __html: readme }}
        />
      );
    }
    return (
      <div className="readme_container">
        <Loading loading />
      </div>
    );
  }

  render() {
    const { userRepos, loaded, className } = this.props;
    let component;
    if (!loaded) {
      component = (<Loading loading />);
    } else {
      component = (!userRepos || !userRepos.length) ?
        (<div className={cardStyles.empty_card}>{githubTexts.emptyText}</div>) : (
          <div>
            {this.renderChosedRepos()}
          </div>
        );
    }
    return (
      <div
        className={cx(
          cardStyles.info_card,
          className)
        }
      >
        {component}
      </div>
    );
  }
}

CodeCourse.defaultProps = {
  loaded: false,
  userRepos: [],
  className: '',
  showedRepository: null,
};

export default CodeCourse;
