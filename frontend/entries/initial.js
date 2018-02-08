/* eslint new-cap: "off" */
import Api from 'API';
import 'STYLES/fonts-hack.css';
import 'SRC/vendor/initial/index.css';
import Rock from 'PAGES/initial';
import Button from 'PAGES/initial/button';
// import { sleep } from 'UTILS/helper';
import styles from '../pages/initial/styles/initial.css';

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
  Api.user.initialed();

  const $content = $('.content-wrapper');
  const rock = new Rock($content, 70);
  rock
    .roll({
      className: styles.contentBottom,
      chars: '$ Start fetching your informations'
    })
    .then(instance => instance.loading())
    .then(instance => instance.roll({ chars: '$ Fetching repositories' }))
    .then(instance => instance.loading())
    // .then(() => sleep(2000))
    .then(() => Api.github.fetchRepositories())
    .then(result => rock.roll({
      chars: `$ ${result}`,
      className: styles.contentBottom
    }))
    .then(instance => instance.roll({ chars: '$ Fetching commits info' }))
    .then(instance => instance.loading())
    // .then(() => sleep(2000))
    .then(() => Api.github.fetchCommits())
    .then(result => rock.roll({
      chars: `$ ${result}`,
      className: styles.contentBottom
    }))
    .then(instance => instance.roll({ chars: '$ Fetching hotmap data' }))
    .then(instance => instance.loading())
    // .then(() => sleep(2000))
    .then(() => Api.github.fetchHotmap())
    .then(result => rock.roll({
      chars: `$ ${result}`,
      className: styles.contentBottom
    }))
    .then(instance => instance.roll({ chars: '$ Fetching your organizations info' }))
    .then(instance => instance.loading())
    // .then(() => sleep(2000))
    .then(() => Api.github.fetchOrganizations())
    .then(result => rock.roll({
      chars: `$ ${result}`,
      className: styles.contentBottom
    }))
    .then(instance => instance.roll({
      chars: `$ Initialize finished!!! ${EMOJI.rock}${EMOJI.fireworks}${EMOJI.rock}`
    }))
    .then(() =>
      Button(`BOOM! ${EMOJI.fireworks}${EMOJI.fireworks}`).renderIn($content, redirect())
    );
});
