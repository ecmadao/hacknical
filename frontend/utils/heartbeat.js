const toPromise = f => (...args) =>
  new Promise((resolve, reject) => {
    const result = f(...args);
    try {
      return result.then(resolve, reject); // promise.
    } catch (e) {
      if (e instanceof TypeError) {
        resolve(result); // resolve naked value.
      } else {
        reject(e); // pass unhandled exception to caller.
      }
    }
  });

class HeartBeat {
  constructor(options = {}) {
    const {
      interval = 1000, // 1s
      callback = Function.prototype
    } = options;
    this.state = {
      interval,
      callback
    };
    this.timeout = null;
  }

  takeoff(...args) {
    this.timeout = setTimeout(this.callback(...args), this.state.interval);
  }

  callback(...args) {
    const { callback } = this.state;
    return () => toPromise(callback)(...args).then(() => {
      this.clearTimeout();
      this.takeoff(...args);
    });
  }

  clearTimeout() {
    this.timeout && clearTimeout(this.timeout);
    this.timeout = null;
  }
}

export default HeartBeat;
