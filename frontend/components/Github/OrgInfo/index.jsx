import React, { PropTypes } from 'react';
import ReactDOM from 'react-dom';
import Chart from 'chart.js';
import cx from 'classnames';
import objectAssign from 'object-assign';

import Api from 'API';
import Loading from 'COMPONENTS/Loading';
import Tipso from 'COMPONENTS/Tipso';
import OrgRepos from './OrgRepos';
import chartStyles from '../styles/chart.css';
import cardStyles from '../styles/info_card.css';
import styles from '../styles/github.css';
import locales from 'LOCALES';
import { splitArray } from 'UTILS/helper';
import dateHelper from 'UTILS/date';

const githubTexts = locales('github').sections.orgs;
const sortByX = (key) => (thisObj, nextObj) => thisObj[key] - nextObj[key];
const sortByStar = sortByX('stargazers_count');

class OrgInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      orgs: [],
      loaded: false,
      showTipso: false,
      activeIndex: 0
    };
    this.onMouseEnter = this.onMouseEnter.bind(this);
    this.onMouseLeave = this.onMouseLeave.bind(this);
    this.changeAcitveOrg = this.changeAcitveOrg.bind(this);
  }

  componentDidMount() {
    const { userLogin } = this.props;
    const { orgs } = this.state;
    if (!orgs.length) {
      this.getGithubOrgs(userLogin);
    }
  }

  getGithubOrgs(login) {
    Api.github.getOrgs(login).then((result) => {
      // console.log(result);
      const { orgs } = result;
      this.setGithubOrgs(orgs);
    });
  }

  setGithubOrgs(orgs) {
    this.setState({
      loaded: true,
      orgs: [...orgs]
    });
  }

  changeAcitveOrg(index) {
    const { activeIndex } = this.state;
    if (activeIndex !== index) {
      this.setState({
        activeIndex: index
      });
    }
  }

  renderOrgsReview() {
    const { activeIndex, orgs } = this.state;

    const orgDOMs = splitArray(orgs, 10).map((organizations, line) => {
      const orgRows = organizations.map((organization, index) => {
        const { avatar_url, name, login } = organization;
        const itemClass = cx(
          styles["org_item"],
          activeIndex === index && styles["org_item_active"]
        );
        return (
          <div key={index} className={styles["org_item_container"]}>
            <div
              className={itemClass}
              onClick={() => this.changeAcitveOrg(index)}>
              <img src={avatar_url} />
              <span>{name || login}</span>
            </div>
          </div>
        )
      });
      return (
        <div key={line} className={styles["org_row"]}>
          {orgRows}
        </div>
      )
    });

    return (
      <div className={styles["orgs_container"]}>
        {orgDOMs}
        {this.renderOrgDetail()}
      </div>
    )
  }

  renderOrgDetail() {
    const { activeIndex, orgs } = this.state;
    const { userLogin } = this.props;
    if (!orgs.length) { return '' }
    const activeOrg = orgs[activeIndex];
    const { created_at, description, blog } = activeOrg;
    const repos = activeOrg.repos || [];

    return (
      <div className={styles["org_detail"]}>
        <div className={styles["org_info"]}>
          <i className="fa fa-rocket" aria-hidden="true"></i>&nbsp;
          {githubTexts.createdAt}{dateHelper.validator.fullDate(created_at)}
        </div>
        {blog ? (
          <div className={styles["org_info"]}>
            <i className="fa fa-link" aria-hidden="true"></i>&nbsp;&nbsp;
            <a href={blog} target="_blank">{blog}</a>
          </div>
        ) : ''}
        {description ? (
          <div className={styles["org_info"]}>
            <i className="fa fa-quote-left" aria-hidden="true"></i>&nbsp;&nbsp;
            {description}
          </div>
        ) : ''}
        <OrgRepos
          repos={repos.sort(sortByStar).reverse()}
          userLogin={userLogin}
        />
      </div>
    )
  }

  onMouseEnter() {
    this.setState({
      showTipso: true
    })
  }

  onMouseLeave() {
    this.setState({
      showTipso: false
    })
  }

  render() {
    const { orgs, loaded, showTipso } = this.state;
    let component;
    if (!loaded) {
      component = (<Loading />);
    } else {
      component = !orgs.length ?
        (<div className={cardStyles["empty_card"]}>没有组织信息</div>) : this.renderOrgsReview();
    }
    return (
      <div className={cardStyles["info_card"]}>
        {component}
      </div>
    )
    // return (
    //   <div className={cx(cardStyles["info_card_container"], styles["chart_card_container"])}>
    //     <p>
    //       <i aria-hidden="true" className="fa fa-rocket"></i>
    //       &nbsp;&nbsp;
    //       {githubTexts.title}&nbsp;&nbsp;
    //       <div
    //         onMouseOver={this.onMouseEnter}
    //         onMouseEnter={this.onMouseEnter}
    //         onMouseOut={this.onMouseLeave}
    //         onMouseLeave={this.onMouseLeave}
    //         className={cardStyles["card_intro"]}>
    //         <i className="fa fa-question-circle" aria-hidden="true"></i>
    //         {showTipso ? (
    //           <Tipso
    //             show={true}
    //             className={cardStyles["card_tipso"]}>
    //             <span>只有用户将自己在组织中的信息设置为公开可见时，才能抓取到数据</span>
    //           </Tipso>
    //         ) : ''}
    //       </div>
    //     </p>
    //     <div className={cardStyles["info_card"]}>
    //       {component}
    //     </div>
    //   </div>
    // )
  }
}

OrgInfo.propTypes = {
  userLogin: PropTypes.string
};

OrgInfo.defaultProps = {
  userLogin: ''
};

export default OrgInfo;
