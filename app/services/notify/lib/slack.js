
import config from 'config';

const slack = config.get('services.messenger.slack');

class SlackMsg {
  constructor(mq) {
    this.mq = mq;
    this._loginMsg = this._loginMsg.bind(this);
    this._signupMsg = this._signupMsg.bind(this);
    this._viewMsg = this._viewMsg.bind(this);
    this._resumeMsg = this._resumeMsg.bind(this);
    this._downloadMsg = this._downloadMsg.bind(this);
    this._scientificMsg = this._scientificMsg.bind(this);
  }

  async send(msg) {
    const message = this.format(msg);

    slack.channel && await this.mq.sendMessage(JSON.stringify({
      data: message,
      type: 'slack',
      channel: slack.channel
    }));
  }

  format(msg) {
    if (msg.type) {
      return this.formatMsg[msg.type](msg.data);
    }
    return msg.data;
  }

  get formatMsg() {
    return {
      login: this._loginMsg,
      signup: this._signupMsg,
      resume: this._resumeMsg,
      download: this._downloadMsg,
      view: this._viewMsg,
      scientific: this._scientificMsg,
    };
  }

  _signupMsg(data) {
    return `*🎉 Signup*\n>${data}`;
  }

  _loginMsg(data) {
    return `*😝 Login*\n>${data}`;
  }

  _viewMsg(data) {
    return `*👀 Page View*\n>${data}`;
  }

  _resumeMsg(data) {
    return `*🚀 Resume*\n>${data}`;
  }

  _downloadMsg(data) {
    return `*😎 Download*\n>${data}`;
  }

  _scientificMsg(data) {
    return `*🙃 Scientific*\n>${data}`;
  }
}

export default SlackMsg;
