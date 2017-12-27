/* eslint new-cap: "off" */

import React from 'react';
import cx from 'classnames';
import CalHeatMap from 'cal-heatmap';
import 'cal-heatmap/cal-heatmap.css';
import { Loading, InfoCard, CardGroup } from 'light-ui';
import Api from 'API';
import 'SRC/vendor/share/github-calendar.css';
import styles from '../styles/github.css';
import cardStyles from '../styles/info_card.css';
import locales from 'LOCALES';

const githubTexts = locales('github').sections.hotmap;

class Hotmap extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
      hotmap: {
        start: null,
        end: null,
        datas: [],
        total: null,
        streak: null,
      }
    }
    this.githubCalendar = false;
  }

  componentDidUpdate() {
    const { login } = this.props;
    if (!this.githubCalendar && login && $('#cal-heatmap')[0]) {
      this.getHotmap(login);
    }
  }

  async getHotmap(login) {
    this.githubCalendar = true;
    const hotmap = await Api.github.getUserHotmap(login);
    console.log(hotmap);
    const cal = new CalHeatMap();
    this.setState({
      loaded: true,
      hotmap
    });
    const {
      start,
      datas,
      levelRanges,
    } = hotmap;
    cal.init({
      domain: 'month',
      start: new Date(start),
      data: datas,
      afterLoadData: (items) => {
        const result = {};
        items.forEach((item) => {
          result[new Date(item.date).getTime() / 1000] = item.data;
        });
        return result;
      },
      weekStartOnMonday: true,
      subDomain: 'day',
      range: 13,
      displayLegend: false,
      previousSelector: '#hotmap-left',
      nextSelector: '#hotmap-right',
      legend: levelRanges,
      domainLabelFormat: '%Y-%m',
      legendColors: {
        min: '#eee',
        max: '#196127',
        empty: '#eee'
      }
    });
  }

  renderCardGroup() {
    const { hotmap } = this.state;
    if (!hotmap.datas.length) return null;
    const {
      end,
      start,
      total,
      streak,
    } = hotmap;

    return (
      <CardGroup
        className={cx(
          cardStyles.card_group,
          styles.hotmapCards
        )}
      >
        <InfoCard
          icon="terminal"
          tipsoTheme="dark"
          mainText={total}
          subText={githubTexts.total}
          tipso={{
            text: `${start} ~ ${end}`
          }}
        />
        <InfoCard
          icon="rocket"
          tipsoTheme="dark"
          mainText={streak.longest.count}
          subText={githubTexts.longestStreak}
          tipso={{
            text: streak.longest.start
              ? `${streak.longest.start} ~ ${streak.longest.end}`
              : githubTexts.streakError
          }}
        />
        <InfoCard
          icon="thumb-tack"
          tipsoTheme="dark"
          mainText={streak.current.count}
          subText={githubTexts.currentStreak}
          tipso={{
            text: streak.current.start
              ? `${streak.current.start} ~ ${streak.current.end}`
              : githubTexts.streakError
          }}
        />
      </CardGroup>
    );
  }

  render() {
    const { loaded } = this.state;
    const { className } = this.props;
    return (
      <div
        className={cx(
          styles.githubCalendar,
          className
        )}
      >
        <Loading className={styles.loading} loading={!loaded} />
        <div className={styles.hotmapControllers}>
          <div className={styles.hotmapController}>
            <i
              aria-hidden="true"
              id="hotmap-left"
              className="fa fa-angle-left"
            />
          </div>
          <div className={styles.hotmapController}>
            <i
              aria-hidden="true"
              id="hotmap-right"
              className="fa fa-angle-right"
            />
          </div>
        </div>
        <div id="cal-heatmap" className={styles.githubHotmap} />
        {this.renderCardGroup()}
      </div>
    );
  }
}

Hotmap.defaultProps = {
  className: ''
};

export default Hotmap;
