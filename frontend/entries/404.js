import 'SRC/vendor/404.css';
import 'STYLES/fonts-hack.css';
import Rock from 'PAGES/initial/rock';

const redirect = (url = '/') => { window.location = url; };

$(() => {
  const $content = $('.content-wrapper');
  const rock = new Rock($content, 50);
  rock
    .roll({ chars: '$ seems nothing could found ' })
    .then(instance => instance.wait(1000))
    .then(instance => instance.roll({ chars: '$ start redirecting' }))
    .then(instance => instance.loading())
    .then(instance => instance.roll({
      chars: '$ 5 4 3 2 1 0 ',
      animation: 'flash',
      time: 600
    }))
    .then(() => redirect());
});
