import 'particles.js';
import './styles/index.css';

$(() => {
  // particleground(document.getElementById('login'), {
  //   dotColor: GREEN_COLORS[2],
  //   lineColor: GREEN_COLORS[2]
  // });
  particlesJS.load('login', '/vendor/particlesjs-config.json', () => {});
});
