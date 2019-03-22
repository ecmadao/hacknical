
import cx from 'classnames'
import { polyfill } from 'es6-promise'
import styles from './styles/initial.css'
import { sleep } from 'UTILS/helper'

polyfill()
const LOADING = ' .......... '

class Rock {
  constructor(containerDOM, waitTime = 100) {
    this.$container = containerDOM
    this.$main = containerDOM.parent()
    this.$info = null
    this.$cursor = null
    this.chars = ''
    this.waitTime = waitTime
  }

  _scroll() {
    this.$main.scrollTop(this.$main.height())
  }

  _setDOM(className = '') {
    const $template = $(this._template(className))
    this.$container.append($template)
    this.$info = $template.find(`.${styles.contentInfo}`)
    this.$cursor = $template.find(`.${styles.contentCursor}`)
  }

  _template(className = '') {
    return `
      <div class="${cx(styles.contentSection, className)}">
        <div class="${styles.contentInfo}">
        </div>
        <div class="${cx(styles.contentCursor, styles['cursor-flash'])}"></div>
      </div>
    `
  }

  _setCursorAnimation(open = false) {
    return (name) => {
      const cursorStyle = styles[`cursor-${name}`]
      if (this.$cursor && open) {
        this.$cursor.addClass(cursorStyle)
      } else if (this.$cursor) {
        this.$cursor.removeClass(cursorStyle)
      }
    }
  }

  get cursorAnimation() {
    return {
      start: this._setCursorAnimation(true),
      stop: this._setCursorAnimation(false)
    }
  }

  async _setCharHtml(html) {
    this.$info && await this.$info.html(html)
  }

  async _setChar(char) {
    const $html = this.$info.html()
    await this._setCharHtml(`${$html}${char}`)
  }

  async _renderChars(options) {
    const {
      chars = this.chars,
      time = this.waitTime
    } = options
    for (let i = 0; i < chars.length; i += 1) {
      const char = chars[i]
      await this.wait(time)
      await this._setChar(char)
    }
  }

  async rock(chars, animation = 'flash') {
    await this.stop()
    this._setDOM()
    this.cursorAnimation.stop(animation)
    await this._setChar(chars)
    this.cursorAnimation.start(animation)
    return this
  }

  async roll(options = {}) {
    const {
      chars,
      className = '',
      animation = 'flash',
      time = this.waitTime
    } = options
    await this.stop()
    this.chars = chars.toUpperCase()
    this._setDOM(className)
    this.cursorAnimation.stop(animation)
    await this._renderChars({ time })
    this.cursorAnimation.start(animation)
    return this
  }

  async loading(time = this.waitTime) {
    this.cursorAnimation.stop('flash')
    this.cursorAnimation.start('loading')
    this.chars = `${this.chars}${LOADING}`
    await this._renderChars({ chars: LOADING, time })
    return this
  }

  async stop() {
    this.cursorAnimation.stop('loading')
    await this._setCharHtml(this.chars)
    this.chars = ''
    this.cursorAnimation.start('flash')
    this._scroll()
    return this
  }

  async wait(time) {
    await sleep(time || this.waitTime)
    return this
  }
}

export default Rock
