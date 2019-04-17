
import React from 'react'
import API from 'API'
import { EMOJI } from 'UTILS/constant'
import LogoText from 'COMPONENTS/LogoText'
import Terminal from 'COMPONENTS/Terminal'
import refresher from 'UTILS/refresher'
import styles from '../styles/initial.css'
import { ClassicButton } from 'light-ui'

class InitialPanel extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      finished: false,
      renderButton: false
    }
    this.onFinish = this.onFinish.bind(this)
    this.onFetchFinish = this.onFetchFinish.bind(this)
  }

  componentDidMount() {
    API.github.update()
  }

  onFetchFinish() {
    refresher.fire(
      1000,
      () => {
        API.user.initialed()
        this.setState({
          finished: true
        })
      }
    )
  }

  onFinish() {
    this.setState({
      renderButton: true
    })
  }

  renderFinish() {
    return (
      <Terminal
        sleepMs={0}
        className={styles.terminal}
        onFinish={this.onFinish}
        wordLines={[
          `$ Initialize finished!!! ${EMOJI.rock}${EMOJI.fireworks}${EMOJI.rock}`
        ]}
      />
    )
  }

  render() {
    const { login } = this.props
    const { finished, renderButton } = this.state

    return (
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.contentHeader}>
            <LogoText theme="light" text={`HACKNICAL INITIALIZING - ${login}`}/>
          </div>
          <div className={styles.contentWrapper}>
            <Terminal
              wordLines={[
                '$ Start fetching your informations',
                '$ Fetching repositories...',
                '$ Fetching commits info...',
                '$ Fetching hotmap data...',
                '$ Fetching your organizations info...',
                '$ Waiting for final initial.....'
              ]}
              sleepMs={500}
              className={styles.terminal}
              onFinish={this.onFetchFinish}
            />
            {finished && <br />}
            {finished && this.renderFinish()}
            {renderButton && (
              <ClassicButton
                theme="light"
                className={styles.button}
                buttonContainerClassName={styles.buttonContainer}
                onClick={() => window.location = '/'}
                content={`BOOM! ${EMOJI.fireworks}${EMOJI.fireworks}`}
              />
            )}
          </div>
        </div>
      </div>
    )
  }
}

export default InitialPanel
