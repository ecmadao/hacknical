
import React from 'react'
import cx from 'classnames'
import HeartBeat from 'UTILS/heartbeat'
import styles from './terminal.css'
import { sleep } from 'UTILS/helper'

class Terminal extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      wordIndex: 0,
      lineIndex: 0
    }
    this.heartBeat = null
  }

  componentDidMount() {
    this.start()
  }

  start() {
    const {
      wordLines,
      sleepMs = 0,
      interval = 100,
      onFinish = Function.prototype
    } = this.props

    if (!this.heartBeat) {
      this.heartBeat = new HeartBeat({
        interval,
        callback: async () => {
          const { lineIndex, wordIndex } = this.state
          const word = wordLines[lineIndex]

          if (wordIndex > word.length - 1) {
            if (lineIndex === wordLines.length - 1) {
              this.heartBeat.stop()
              onFinish()
              return
            }
            await sleep(sleepMs)
            this.setState({
              wordIndex: 0,
              lineIndex: lineIndex + 1
            })
          } else {
            this.setState({
              wordIndex: wordIndex + 1
            })
          }
        }
      })
    }
    this.heartBeat.takeoff()
  }

  componentWillUnmount() {
    this.heartBeat && this.heartBeat.stop()
  }

  renderLine(index) {
    const { wordLines, className } = this.props
    const { wordIndex, lineIndex } = this.state

    const word = wordLines[index].slice(
      0, index === lineIndex ? (wordIndex + 1) : wordLines[index].length
    )

    return (
      <div className={cx(styles.contentSection, className)} key={index}>
        <div className={styles.contentInfo}>
          {word}
        </div>
        {index === lineIndex && (
          <div className={cx(styles.contentCursor, styles.cursorFlash)} />
        )}
      </div>
    )
  }

  render() {
    const { lineIndex } = this.state
    return Array.from({ length: lineIndex + 1 })
      .map((_, index) => this.renderLine(index))
  }
}

export default Terminal
