/* eslint new-cap: "off" */
import Api from 'API';
import 'STYLES/fonts-hack.css';
import 'SRC/vendor/initial/index.css';
import Rock from 'PAGES/initial';
import styles from 'PAGES/initial/styles/initial.css';
import Button from 'PAGES/initial/button';
import HeartBeat from 'UTILS/heartbeat';

const EMOJI = {
  rocket: '🚀',
  winking: '😉',
  heartEyes: '😍',
  smiling: '😝',
  heart: '\u2764\uFE0F',
  fireworks: '🎉',
  rock: '🤘',
  smile: '😌',
};
const redirect = (url = '/') => () => { window.location = url; };

$(() => {
  $(document).bind('contextmenu', () => false);

  const $content = $('.content-wrapper');
  const rock = new Rock($content, 70);
  rock
    .roll({
      className: styles.contentBottom,
      chars: '$ Start fetching your informations'
    })
    .then(instance => instance.loading())
    .then(() => Api.github.update())
    .then(() => rock.roll({ chars: '$ Fetching repositories' }))
    .then(instance => instance.loading())
    .then(instance => instance.wait(300))
    .then(instance => instance.roll({ chars: '$ Fetching commits info' }))
    .then(instance => instance.loading())
    .then(instance => instance.wait(300))
    .then(instance => instance.roll({ chars: '$ Fetching hotmap data' }))
    .then(instance => instance.loading())
    .then(instance => instance.wait(300))
    .then(instance => instance.roll({ chars: '$ Fetching your organizations info' }))
    .then(instance => instance.loading())
    .then(instance => instance.roll({ chars: '$ Waiting for final initial.....' }))
    .then((instance) => {
      const heartBeat = new HeartBeat({
        interval: 1000, // 1s
        callback: () => Api.github.getUpdateStatus().then((result) => {
          if (result && result.finished) {
            heartBeat.stop();
            Api.user.initialed();
            instance
              .roll({
                chars: `$ Initialize finished!!! ${EMOJI.rock}${EMOJI.fireworks}${EMOJI.rock}`,
              })
              .then(() =>
                Button(`BOOM! ${EMOJI.fireworks}${EMOJI.fireworks}`).renderIn($content, redirect())
              );
          }
        })
      });
      heartBeat.takeoff();
    });
});
