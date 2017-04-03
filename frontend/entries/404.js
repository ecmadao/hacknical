import 'SRC/vendor/404/404.css';
import Rock from 'PAGES/initial';

const redirect = (url = '/') => window.location = url;

$(() => {
  const $content = $('.content-wrapper');
  const rock = new Rock($content, 50);
  rock
    .roll('$ seems nothing could find ')
    .then(instance => instance.wait(1000))
    .then(instance => instance.roll('$ start redirecting'))
    .then(instance => instance.loading())
    .then(instance => instance.roll('$ 5 4 3 2 1 0 ', 'flash', 600))
    .then(() => redirect());
});
