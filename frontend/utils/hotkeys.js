import keyboardJS from 'keyboardjs';

class Hotkeys {

  submit(callback) {
    keyboardJS.bind('command + enter', (e) => {
      callback && callback();
      e.preventDefault();
      return false;
    });
    return this;
  }

  save(callback) {
    keyboardJS.bind('command + s', (e) => {
      callback && callback();
      e.preventDefault();
      return false;
    });
    return this;
  }

  preview(callback) {
    keyboardJS.bind('command + p', (e) => {
      callback && callback();
      e.preventDefault();
      return false;
    });
    return this;
  }

}

export default Hotkeys;
