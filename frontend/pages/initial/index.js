import cx from 'classnames';
import { polyfill } from 'es6-promise';
import styles from './styles/initial.css';

polyfill();
const LOADING = ' .......... ';
const waitFor = ms => new Promise(resolve => setTimeout(resolve, ms));

class Rock {
  constructor(containerDOM, waitTime = 100) {
    this.$container = containerDOM;
    this.$main = containerDOM.parent();
    this.$info = null;
    this.$cursor = null;
    this.chars = '';
    this.waitTime = waitTime;
  }

  _scroll() {
    this.$main.scrollTop(this.$main.height());
  }

  _setDOM() {
    const $template = $(this._template());
    this.$container.append($template);
    this.$info = $template.find(`.${styles['content-info']}`);
    this.$cursor = $template.find(`.${styles['content-cursor']}`);
  }

  _template() {
    return `
      <div class="${styles['content-section']}">
        <div class="${styles['content-info']}">
        </div>
        <div class="${cx(styles['content-cursor'], styles['cursor-flash'])}"></div>
      </div>
    `;
  }

  _setCursorAnimation(open = false) {
    return (name) => {
      const cursorStyle = styles[`cursor-${name}`];
      this.$cursor
        ? (open
            ? this.$cursor.addClass(cursorStyle)
            : this.$cursor.removeClass(cursorStyle))
        : null;
    };
  }

  get cursorAnimation() {
    return {
      start: this._setCursorAnimation(true),
      stop: this._setCursorAnimation(false)
    };
  }

  async _setCharHtml(html) {
    this.$info && await this.$info.html(html);
  }

  async _setChar(char) {
    const $html = this.$info.html();
    await this._setCharHtml(`${$html}${char}`);
  }

  async _renderChars(chars, time = this.waitTime) {
    for (let i = 0; i < chars.length; i++) {
      const char = chars[i];
      await this.wait(time);
      await this._setChar(char);
    }
  }

  async rock(chars, animation = 'flash') {
    await this.stop();
    this._setDOM();
    this.cursorAnimation.stop(animation);
    await this._setChar(chars);
    this.cursorAnimation.start(animation);
    return this;
  }

  async roll(chars, animation = 'flash', time = this.waitTime) {
    await this.stop();
    this.chars = chars;
    this._setDOM();
    this.cursorAnimation.stop(animation);
    await this._renderChars(chars, time);
    this.cursorAnimation.start(animation);
    return this;
  }

  async loading(time = this.waitTime) {
    this.cursorAnimation.stop('flash');
    this.cursorAnimation.start('loading');
    this.chars = `${this.chars}${LOADING}`;
    await this._renderChars(LOADING, time);
    return this;
  }

  async stop() {
    this.cursorAnimation.stop('loading');
    await this._setCharHtml(this.chars);
    this.chars = '';
    this.cursorAnimation.start('flash');
    this._scroll();
    return this;
  }

  async wait(time) {
    await waitFor(time || this.waitTime);
    return this;
  }
}

export default Rock;
