import config from 'config';

const slack = config.get('services.slack');
const slackUrl = slack.url;

class SlackMsg {
  constructor(mq) {
    this.mq = mq;
    this._loginMsg = this._loginMsg.bind(this);
    this._signupMsg = this._signupMsg.bind(this);
    this._viewMsg = this._viewMsg.bind(this);
    this._resumeMsg = this._resumeMsg.bind(this);
    this._downloadMsg = this._downloadMsg.bind(this);
  }

  send(msg) {
    if (!slackUrl) return;
    const message = this.format(msg);
    this.mq.sendMessage({
      message,
      url: slackUrl,
      type: 'slack',
    });
  }

  format(msg) {
    if (msg.type) {
      return this.formatMsg[msg.type](msg.data);
    }
    return msg;
  }

  get formatMsg() {
    return {
      login: this._loginMsg,
      signup: this._signupMsg,
      resume: this._resumeMsg,
      download: this._downloadMsg,
      view: this._viewMsg
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
}

export default SlackMsg;
