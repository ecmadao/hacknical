import { getData, putData, deleteData } from './base';

const fetchInfo = (url, data = {}) => getData(`/scientific${url}`, data);
const putInfo = (url, data = {}) => putData(`/scientific${url}`, data);
const deleteInfo = (url, data = {}) => deleteData(`/scientific${url}`, data);

const getUserStatistic = login => fetchInfo(`/${login}/statistic`);
const getUserPredictions = login => fetchInfo(`/${login}/predictions`);
const removePrediction = (login, fullName) =>
  deleteInfo(`/${login}/predictions`, { fullName });
const putPredictionFeedback = (login, fullName, liked) =>
  putInfo(`/${login}/predictions`, { fullName, liked });

export default {
  getUserStatistic,
  getUserPredictions,
  removePrediction,
  putPredictionFeedback,
};
