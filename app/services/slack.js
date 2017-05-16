import { IncomingWebhook } from '@slack/client';
import config from 'config';
import logger from '../utils/logger';

const slack = config.get('services.slack');

class SlackClient {
  constructor() {
    if (slack) {
      this.slack = {
        webhook: new IncomingWebhook(slack.webhookUrl)
      };
    } else {
      this.slack = null
    }
    this._loginMsg = this._loginMsg.bind(this);
    this._signupMsg = this._signupMsg.bind(this);
    this._viewMsg = this._viewMsg.bind(this);
    this._resumeMsg = this._resumeMsg.bind(this);
    this._downloadMsg = this._downloadMsg.bind(this);
  }

  msg(msg) {
    if (msg.type) {
      this.sendMsg[msg.type](msg.data);
    } else {
      this._sendMsg(msg);
    }
  }

  get sendMsg() {
    return {
      login: this._loginMsg,
      signup: this._signupMsg,
      resume: this._resumeMsg,
      download: this._downloadMsg,
      view: this._viewMsg
    };
  }

  _sendMsg(msg) {
    this.slack && this.slack.webhook.send(msg, (err, res) => {
      if (err) {
        logger.error(err);
      }
    });
  }

  _signupMsg(data) {
    const message = `*🎉 Signup*\n>${data}`;
    this._sendMsg(message);
  }

  _loginMsg(data) {
    const message = `*😝 Login*\n>${data}`;
    this._sendMsg(message);
  }

  _viewMsg(data) {
    const message = `*👀 Page View*\n>${data}`;
    this._sendMsg(message);
  }

  _resumeMsg(data) {
    const message = `*🚀 Resume*\n>${data}`;
    this._sendMsg(message);
  }

  _downloadMsg(data) {
    const message = `*😎 Download*\n>${data}`;
    this._sendMsg(message);
  }
}

let slackClient = null;
const Slack = (() => {
  if (!slackClient) {
    slackClient = new SlackClient();
  }
  return slackClient;
})();

export default Slack;
