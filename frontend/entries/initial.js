import Api from 'API';
import Rock from 'SRC/vendor/initial';

$(() => {
  $(document).bind("contextmenu", (e) => {
    return false;
  });

  const $content = $('.content');
  const rock = new Rock($content);
  rock
    .roll('start fetching your informations')
    .then(instance => instance.loading())
    .then(instance => instance.roll('🚀 fetching repositories'))
    .then(instance => instance.loading())
    .then(() => Api.github.fetchRepos())
    .then(result => rock.roll(`${result} 😎`))
    .then(instance => instance.roll('🚀 fetching commits info'))
    .then(instance => instance.loading())
    .then(() => Api.github.fetchCommits())
    .then(result => rock.roll(`${result} 😉`))
    .then(instance => instance.roll('🚀 fetching your organizations info'))
    .then(instance => instance.loading())
    .then(() => Api.github.fetchOrgs())
    .then(result => rock.roll(`${result} 😝`))
    .then(instance => instance.stop())
});
