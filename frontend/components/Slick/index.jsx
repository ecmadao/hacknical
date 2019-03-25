
import React from 'react'
import cx from 'classnames'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick.min'
import styles from './slick.css'
import MinInfoCard from 'COMPONENTS/MinInfoCard'

const initialSlick = (dom) => {
  $(dom).slick({
    accessibility: false,
    arrows: false,
    slidesToShow: 2,
    mobileFirst: true,
    swipeToSlide: true,
    infinite: false,
    slidesToScroll: 1,
    variableWidth: true
  })
}

class Slick extends React.Component {
  componentDidMount() {
    const { sliders } = this.props
    if (sliders.length) {
      this.initialSlick()
    }
  }

  componentDidUpdate(preProps) {
    const { sliders } = this.props
    if (sliders !== preProps.sliders) {
      this.initialSlick()
    }
  }

  initialSlick() {
    initialSlick(`#${this.props.slickId}`)
  }

  renderSliders() {
    return this.props.sliders.map((slider, index) => (
      <div
        key={index}
        className={styles.infoWrapper}
      >
        <MinInfoCard
          icon={slider.icon}
          mainText={slider.mainText}
          subText={slider.subText}
          className={styles.infoCard}
        />
      </div>
    ))
  }

  render() {
    const { className, wrapperId, slickId } = this.props
    return (
      <div
        id={wrapperId}
        className={cx(
          styles.wrapper,
          className
        )}
      >
        <div
          id={slickId}
          className={styles.container}
        >
          {this.renderSliders()}
        </div>
      </div>
    )
  }
}

Slick.defaultProps = {
  className: '',
  sliders: [],
  wrapperId: '',
  slickId: 'slick'
}

export default Slick
