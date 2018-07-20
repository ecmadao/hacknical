/* eslint new-cap: "off" */
import API from 'API';
import 'STYLES/fonts-hack.css';
import 'SRC/vendor/initial.css';
import Rock from 'PAGES/initial/rock';
import styles from 'PAGES/initial/styles/initial.css';
import Button from 'PAGES/initial/button';
import HeartBeat from 'UTILS/heartbeat';
import { EMOJI } from 'UTILS/constant';

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
    .then(() => API.github.update())
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
        callback: () => API.github.getUpdateStatus().then((result) => {
          if (result && result.finished) {
            heartBeat.stop();
            API.user.initialed();
            instance
              .roll({
                chars: `$ Initialize finished!!! ${EMOJI.rock}${EMOJI.fireworks}${EMOJI.rock}`,
              })
              .then(() =>
                Button(`BOOM! ${EMOJI.fireworks}${EMOJI.fireworks}`).render($content, redirect())
              );
          }
        })
      });
      heartBeat.takeoff();
    });
});
