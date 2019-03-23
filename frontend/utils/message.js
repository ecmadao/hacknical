
import { Message } from 'light-ui/lib/raw'

const message = new Message({
  theme: 'notify',
  showClose: false,
  isMobile: window.isMobile === 'true' || window.isMobile === true
})

export default message
