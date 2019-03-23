
import API from './base'

const getUserStatistic = login => API.get(`/scientific/${login}/statistic`)

const getUserPredictions = login => API.get(`/scientific/${login}/predictions`)

const removePrediction = (login, fullName) =>
  API.delete(`/scientific/${login}/predictions`, { fullName })

const putPredictionFeedback = (login, fullName, liked) =>
  API.put(`/scientific/${login}/predictions`, { fullName, liked })

export default {
  getUserStatistic,
  getUserPredictions,
  removePrediction,
  putPredictionFeedback
}
