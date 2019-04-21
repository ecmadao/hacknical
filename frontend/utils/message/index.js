
import { Message } from 'light-ui/lib/raw'
import styles from './message.css'

const message = new Message({
  theme: 'notify',
  showClose: false,
  className: styles.message,
  isMobile: window.isMobile === 'true' || window.isMobile === true
})

export default message
