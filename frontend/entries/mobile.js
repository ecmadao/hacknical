import 'SRC/vendor/mobile/index.js';
import initialHeadroom from 'SRC/vendor/shared/headroom';

$(() => {
  initialHeadroom('#mobile_topbar', {
    classes: {
      initial: 'mobile_topbar',
      pinned: 'mobile_topbar-pinned',
      unpinned: 'mobile_topbar-unpinned',
      top: 'mobile_topbar-top'
    }
  });
});
