import React from 'react'
import { InfoCard } from 'light-ui'
import styles from '../styles/predictions.css'
import CardMenu from './CardMenu'
import locales from 'LOCALES'
import Icon from 'COMPONENTS/Icon'

const githubTexts = locales('github.sections')

const formatCount = (count) => {
  if (count < 1000) return count
  return `${(count / 1000).toFixed(1)}K`
}

const iconLink = (options) => {
  const {
    link,
    icon,
    text,
    linkClass = '',
    iconClass = '',
  } = options
  const iconDOM = (
    <span className={iconClass}>
      <Icon icon={icon} />
      {text}
    </span>
  )
  if (!link) return iconDOM
  return (
    <a
      href={link}
      className={linkClass}
      target="_blank"
      rel="noopener noreferrer"
    >
      {iconDOM}
    </a>
  )
}

const cardSubInfo = (options) => {
  const {
    owner,
    login,
    description,
    forks_count,
    stargazers_count
  } = options
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
  )
}

class Predictions extends React.PureComponent {
  handleItemClick(index, liked, newLike) {
    const {
      onFeedback
    } = this.props
    if (liked === newLike) return Function.prototype
    return () => {
      onFeedback && onFeedback(index, newLike)
    }
  }

  renderCardRows(ROW_LENGTH = 3) {
    const { predictions } = this.props
    const loopTimes = Math.ceil(predictions.length / ROW_LENGTH)
    const results = []
    for (let i = 1; i <= loopTimes; i += 1) {
      results.push((
        <div className={styles.row} key={i}>
          {this.renderCards(predictions.slice((i - 1) * ROW_LENGTH, i * ROW_LENGTH), i - 1)}
        </div>
      ))
    }
    return results
  }

  renderCards(predictions, lineIndex, ROW_LENGTH = 3) {
    return predictions.map((prediction, index) => {
      const {
        name,
        liked,
        owner,
        login,
        html_url,
        likedCount,
        description,
        forks_count,
        stargazers_count
      } = prediction

      const itemIndex = index + (lineIndex * ROW_LENGTH)
      const likedText = likedCount > 10
        ? `${githubTexts.predictions.like} ${formatCount(likedCount)}`
        : githubTexts.predictions.like

      const menuItems = [
        {
          text: likedText,
          icon: 'thumbs-o-up',
          onClick: this.handleItemClick(itemIndex, liked, 1),
          className: liked === 1 ? styles.liked : '',
        },
        {
          text: githubTexts.predictions.dislike,
          icon: 'thumbs-o-down',
          onClick: this.handleItemClick(itemIndex, liked, -1),
          className: liked === -1 ? styles.disliked : '',
        },
        {
          text: githubTexts.predictions.notShow,
          icon: 'eye-slash',
          onClick: this.handleItemClick(itemIndex, liked, -2),
        }
      ]

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
      )
    })
  }

  render() {
    return (
      <div>
        {this.renderCardRows()}
      </div>
    )
  }
}

export default Predictions
