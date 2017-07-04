import keyboardJS from 'keyboardjs';

class Hotkeys {

  _baseBind(what, callback) {
    keyboardJS.bind(what, (e) => {
      callback && callback();
      e.preventDefault();
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
    return this._baseBind('command + right', callback);
  }

  previous(callback) {
    return this._baseBind('command + left', callback);
  }
}

export default Hotkeys;
