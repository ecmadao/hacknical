
import React from 'react'
import PropTypes from 'prop-types'
import cx from 'classnames'
import { Tipso } from 'light-ui'

import config from './config'
import Icon from 'COMPONENTS/Icon'
import Operations from 'COMPONENTS/Operations'
import cardStyles from './styles/info_card.css'
import locales from 'LOCALES'
import BaseSection from './BaseSection'

const operationTexts = locales('github.operations')
const EmptyDOM = () => (<div />)

class GitHubSection extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      showOperations: false
    }
    this.onMenuClick = this.onMenuClick.bind(this)
    this.handleMenuClick = this.handleMenuClick.bind(this)
    this.onOperationFocusChange = this.onOperationFocusChange.bind(this)
  }

  onOperationFocusChange(value) {
    this.setState({
      showOperations: value
    })
  }

  handleMenuClick() {
    const { section, sectionStatus } = this.props
    this.onMenuClick({
      [section]: !sectionStatus
    })
  }

  onMenuClick(value) {
    const { callback } = this.props
    callback && callback(value)
    this.onOperationFocusChange(false)
  }

  get operationItems() {
    const { sectionStatus = true } = this.props
    return [
      {
        text: sectionStatus ? operationTexts.share.hide : operationTexts.share.show,
        onClick: this.handleMenuClick
      }
    ]
  }

  render() {
    const {
      hide,
      intro,
      title,
      status,
      section,
      isShare,
      disabled,
      className,
      canOperate,
      cardClass,
      onTransitionEnd
    } = this.props
    const { showOperations } = this.state
    if (hide) return <EmptyDOM />
    const Section = config[section] || EmptyDOM

    return (
      <div
        className={cx(
          cardStyles.info_card_container,
          cardStyles.container,
          cardStyles[`container-${status}`],
          className
        )}
        onTransitionEnd={onTransitionEnd}
      >
        <div className={cardStyles.cardHeader}>
          <Icon icon={title.icon} />
          &nbsp;&nbsp;{title.text}&nbsp;&nbsp;
          {intro && !isShare ? (
            <Tipso
              theme="dark"
              className={cardStyles.card_tipso}
              tipsoContent={(<span>{intro.text}</span>)}
            >
              <span className={cardStyles.card_intro}>
                <Icon icon={intro.icon} />
              </span>
            </Tipso>
          ) : null}
        </div>
        <BaseSection
          disabled={disabled}
          cardClass={cardClass}
          handleClick={this.handleMenuClick}
        >
          <Section {...this.props} />
        </BaseSection>
        {!isShare && canOperate ? (
          <Operations
            className={cardStyles.card_operation}
            items={this.operationItems}
            showOperations={showOperations}
            onFocusChange={this.onOperationFocusChange}
          />
        ) : null}
      </div>
    )
  }
}

GitHubSection.propTypes = {
  section: PropTypes.string,
  disabled: PropTypes.bool,
  hide: PropTypes.bool,
  isShare: PropTypes.bool,
  canOperate: PropTypes.bool,
  show: PropTypes.bool,
  title: PropTypes.object,
  className: PropTypes.string,
  callback: PropTypes.func,
  intro: PropTypes.object,
  cardClass: PropTypes.string,
  status: PropTypes.string
}

GitHubSection.defaultProps = {
  section: Object.keys(config)[0],
  disabled: false,
  hide: false,
  isShare: false,
  canOperate: true,
  show: true,
  title: {
    text: '',
    icon: ''
  },
  className: '',
  callback: Function.prototype,
  intro: null,
  cardClass: '',
  status: 'hidden'
}

export default GitHubSection
