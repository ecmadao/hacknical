import React from 'react';
import { InfoCard } from 'light-ui';
import styles from '../styles/scientific.css';
import CardMenu from './CardMenu';
import locales from 'LOCALES';

const githubLocales = locales('github');
const githubTexts = githubLocales.sections;

const iconLink = (options) => {
  const {
    link,
    icon,
    text,
    linkClass = '',
    iconClass = '',
  } = options;
  const iconDOM = (
    <span className={iconClass}>
      <i aria-hidden="true" className={`fa fa-${icon}`} />
      {text}
    </span>
  );
  if (!link) return iconDOM;
  return (
    <a href={link} className={linkClass} target="_blank" rel="noopener noreferrer">
      {iconDOM}
    </a>
  );
};

const cardSubInfo = (options) => {
  const {
    owner,
    login,
    description,
    forks_count,
    stargazers_count
  } = options;
  return (
    <div className={styles.subInfo}>
      <div className={styles.subContent}>{description}</div>
      <div className={styles.subBottom}>
        {iconLink({
          icon: 'user-circle',
          link: (owner && owner.html_url) ? owner.html_url : `https://github.com/${login}`,
          linkClass: styles.iconLink
        })}
        {iconLink({
          icon: 'star',
          text: stargazers_count,
          iconClass: styles.iconText
        })}
        {iconLink({
          icon: 'code-fork',
          text: forks_count,
          iconClass: styles.iconText
        })}
      </div>
    </div>
  );
};

class Scientific extends React.PureComponent {
  handleItemClick(index, liked) {
    const {
      onFeedback
    } = this.props;
    return () => {
      onFeedback && onFeedback(index, liked)
    };
  }

  renderCardRows(ROW_LENGTH = 3) {
    const { scientific } = this.props;
    const { predictions } = scientific;
    const loopTimes = Math.ceil(predictions.length / ROW_LENGTH);
    const results = [];
    for (let i = 1; i <= loopTimes; i += 1) {
      results.push((
        <div className={styles.row} key={i}>
          {this.renderCards(predictions.slice((i - 1) * ROW_LENGTH, i * ROW_LENGTH))}
        </div>
      ));
    }
    return results;
  }

  renderCards(predictions) {
    return predictions.map((prediction, index) => {
      const {
        name,
        liked,
        owner,
        login,
        html_url,
        description,
        forks_count,
        stargazers_count,
      } = prediction;

      const menuItems = [
        {
          text: githubTexts.scientific.like,
          icon: 'thumbs-o-up',
          onClick: this.handleItemClick(index, 1),
          className: liked === 1 ? styles.liked : '',
        },
        {
          text: githubTexts.scientific.dislike,
          icon: 'thumbs-o-down',
          onClick: this.handleItemClick(index, -1),
          className: liked === -1 ? styles.disliked : '',
        },
        {
          text: githubTexts.scientific.notShow,
          icon: 'eye-slash',
          onClick: this.handleItemClick(index, -2),
        }
      ];

      return (
        <InfoCard
          key={index}
          mainText={(
            <a
              href={html_url}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.cardTitle}
            >{name}</a>
          )}
          tipsoTheme="dark"
          subText={cardSubInfo({
            login,
            owner,
            description,
            forks_count,
            stargazers_count
          })}
          style={{ textAlign: 'left' }}
          className={styles.predictionCard}
          tipso={<CardMenu items={menuItems} />}
        />
      );
    });
  }

  render() {
    return (
      <div>
        {this.renderCardRows()}
      </div>
    );
  }
}

export default Scientific;
