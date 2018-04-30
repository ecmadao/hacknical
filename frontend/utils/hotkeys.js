
import hotkeys from 'hotkeys-js';

class Hotkeys {
  constructor() {
    this.onKeydown = this.onKeydown.bind(this);
  }

  _baseBind(what, callback) {
    hotkeys(what, (event) => {
      // Prevent the default refresh event under WINDOWS system
      callback && callback();
      event.preventDefault();
      event.stopPropagation();
      return false;
    });
    return this;
  }

  submit(callback) {
    return this._baseBind('command + enter', callback);
  }

  save(callback) {
    return this._baseBind('command + s', callback);
  }

  preview(callback) {
    return this._baseBind('command + p', callback);
  }

  next(callback) {
    return this._baseBind('shift + right', callback);
  }

  previous(callback) {
    return this._baseBind('shift + left', callback);
  }

  bind(what, dom, callback = null) {
    const onKeydown = this.onKeydown(what, callback);
    if (dom.addEventListener) {
      dom.addEventListener('keydown', onKeydown, true);
    } else {
      dom.attachEvent('onkeydown', onKeydown);
    }
    return this;
  }

  onKeydown(what, callback) {
    let targetCode = 0;
    switch (what) {
      case 'left':
        targetCode = 37;
        break;
      case 'right':
        targetCode = 39;
        break;
      default:
        targetCode = null;
    }
    return (e) => {
      const { keyCode } = e;
      if (keyCode === targetCode) {
        callback && callback(e);
      }
    }
  }
}

export default Hotkeys;
