import Api from 'API';
import 'SRC/vendor/initial/index.css';
import Rock from 'PAGES/initial';

const EMOJI = {
  rocket: '🚀',
  winking: '😉',
  heartEyes: '😍',
  smiling: '😝',
  heart: '\u2764\uFE0F'
};

$(() => {
  $(document).bind("contextmenu", (e) => {
    return false;
  });

  const $content = $('.content');
  const rock = new Rock($content);
  rock
    .roll('start fetching your informations')
    .then(instance => instance.loading())
    .then(instance => instance.roll(`${EMOJI.rocket} fetching repositories`))
    .then(instance => instance.loading())
    .then(() => Api.github.fetchRepos())
    .then(result => rock.roll(`${result} ${EMOJI.winking}`))
    .then(instance => instance.roll(`${EMOJI.rocket} fetching commits info`))
    .then(instance => instance.loading())
    .then(() => Api.github.fetchCommits())
    .then(result => rock.roll(`${result} ${EMOJI.heartEyes}`))
    .then(instance => instance.roll(`${EMOJI.rocket} fetching your organizations info`))
    .then(instance => instance.loading())
    .then(() => Api.github.fetchOrgs())
    .then(result => rock.roll(`${result} ${EMOJI.smiling}`))
    // .then(instance => instance.stop())
    .then(instance => instance.roll('fetch finished!!! 🤘🎉🤘'))
});
