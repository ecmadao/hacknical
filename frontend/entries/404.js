import 'STYLES/fonts-404.css';
import 'SRC/vendor/404/404.css';

$(() => {
  const $count = $('.count');
  setInterval(() => {
    const count = parseInt($count.html());
    if (count === 0) {
      window.location.href = '/';
    } else {
      $count.html(count - 1);
    }
  }, 1000);
});
