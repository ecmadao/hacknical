import Headroom from 'headroom.js';
import './banner.css';

const initialBanner = (dom, options = {}) => {
  if (dom) {
    Object.keys(options).map((key) => {
      Headroom.options[key] = options[key];
    });
    const headroom = new Headroom(dom);
    headroom.init();
  }
};

export default initialBanner;
