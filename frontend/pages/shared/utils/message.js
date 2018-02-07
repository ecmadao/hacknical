import { Message } from 'light-ui/lib/raw';

const message = new Message({
  isMobile: window.isMobile === 'true' || window.isMobile === true
});

export default message;
