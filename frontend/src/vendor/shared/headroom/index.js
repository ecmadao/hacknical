
import Headroom from 'headroom.js'
import './banner.css'

const initialHeadroom = (id, options = {}) => {
  const $dom = $(`${id}`)[0]
  if ($dom) {
    const headroom = new Headroom($dom, options)
    headroom.init()
  }
}

export default initialHeadroom
