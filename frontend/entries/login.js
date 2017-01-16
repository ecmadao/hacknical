import 'SRC/vendor/login';
import { GREEN_COLORS } from 'UTILS/colors';

$(() => {
  particleground(document.getElementById('login'), {
    dotColor: GREEN_COLORS[2],
    lineColor: GREEN_COLORS[2]
  });
});
