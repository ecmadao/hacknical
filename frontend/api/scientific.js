import { getData, putData } from './base';

const fetchInfo = (url, data = {}) => getData(`/scientific${url}`, data);
const putInfo = (url, data = {}) => putData(`/scientific${url}`, data);

const getUserScientific = login => fetchInfo(`/${login}/statistic`);
const getUserPredictions = login => fetchInfo(`/${login}/predictions`);
const putPredictionFeedback = (login, fullName, liked) =>
  putInfo(`/${login}/predictions`, { fullName, liked });

export default {
  getUserScientific,
  getUserPredictions,
  putPredictionFeedback,
};
