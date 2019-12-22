
import React from 'react'
import cx from 'classnames'
import styles from './styles.css'

class Avator extends React.Component {
  onError() {
    this.image && this.image.remove()
  }

  render() {
    if (!this.props.src) return null

    return (
      <img
        src={this.props.src}
        ref={ref => (this.image = ref)}
        className={cx(styles.image, this.props.className)}
        onClick={this.props.onClick}
        onError={this.props.onError || this.onError.bind(this)}
      />
    )
  }
}

export default Avator
