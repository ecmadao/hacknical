import config from 'config';
import request from 'request';

const clientId = config.get('github.clientId');
const clientSecret = config.get('github.clientSecret');
const appName = config.get('github.appName');

const API_TOKEN = 'https://github.com/login/oauth/access_token';
const API_USER = 'https://api.github.com/user';
const API_REPOS = 'https://api.github.com/repos/';

const getToken = (code) => {
  return new Promise((resolve, reject) => {
    request.post(`${API_TOKEN}?client_id=${clientId}&client_secret=${clientSecret}&code=${code}`, (err, httpResponse, body) => {
      if (httpResponse.statusCode === 200 && body) {
        resolve(body);
      } else {
        reject(false);
      }
    });
  });
};

const getUser = (token) => {
  return new Promise((resolve, reject) => {
    request.get(`${API_USER}?access_token=${token}`, {
      headers: {
        'User-Agent': appName
      }
    }, (err, httpResponse, body) => {
      if (httpResponse.statusCode === 200 && body) {
        resolve(body);
      } else {
        reject(false);
      }
    });
  });
};

const getUserRepos = (token) => {

};

const getRepos = () => {

};

export default {
  getToken,
  getUser,
  getUserRepos,
  getRepos
}
