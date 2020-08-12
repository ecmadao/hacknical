
import API from './base'

const statistic = () => API.get('/statistic')

const languages = () => API.get('/languages')

const icon = ({ url, size }) => API.get('/icon', { url, size })

export default {
  icon,
  statistic,
  languages
}
