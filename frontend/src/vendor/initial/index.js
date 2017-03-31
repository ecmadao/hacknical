import { polyfill } from 'es6-promise';
import './styles/index.css';

polyfill();
const LOADING = ' .......... ';
const wait = ms => new Promise(resolve => setTimeout(resolve, ms));

class Rock {
  constructor(mainDOM) {
    this.$main = mainDOM;
    this.$info = null;
    this.$cursor = null;
    this.chars = '';
  }

  _setDOM() {
    const $template = $(this._template());
    this.$main.append($template);
    this.$info = $template.find('.content-info');
    this.$cursor = $template.find('.content-cursor');
  }

  _template() {
    return `
      <div class="content-section">
        <div class="content-info">
        </div>
        <div class="content-cursor cursor-flash"></div>
      </div>
    `;
  }

  _setCursorAnimation(open = false) {
    return (name) => {
      this.$cursor
        ? (open
            ? this.$cursor.addClass(`cursor-${name}`)
            : this.$cursor.removeClass(`cursor-${name}`))
        : null;
    }
  }

  get cursorAnimation() {
    return {
      start: this._setCursorAnimation(true),
      stop: this._setCursorAnimation(false),
    };
  }

  async _setCharHtml(html) {
    this.$info && await this.$info.html(html);
  }

  async _setChar(char) {
    const $html = this.$info.html();
    await this._setCharHtml(`${$html}${char}`);
  }

  async _renderChars(chars) {
    for (let i = 0; i < chars.length; i++) {
      const char = chars[i];
      await wait(100);
      await this._setChar(char);
    }
  }

  async roll(chars, animation = 'flash') {
    await this.stop();
    this.chars = chars;
    this._setDOM();
    this.cursorAnimation.stop(animation);
    await this._renderChars(chars);
    this.cursorAnimation.start(animation);
    return this;
  }

  async loading() {
    this.cursorAnimation.stop('flash');
    this.cursorAnimation.start('loading');
    this.chars = `${this.chars}${LOADING}`;
    await this._renderChars(LOADING);
    return this;
  }

  async stop() {
    this.cursorAnimation.stop('loading');
    await this._setCharHtml(this.chars);
    this.chars = '';
    this.cursorAnimation.start('flash');
    return this;
  }
}

export default Rock;
