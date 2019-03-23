
import API from './base'

const statistic = () => API.get('/statistic')

const languages = () => API.get('/languages')

export default {
  statistic,
  languages
}
