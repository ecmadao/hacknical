import config from 'config';
import request from 'request';

const clientId = config.get('github.clientId');
const clientSecret = config.get('github.clientSecret');
const appName = config.get('github.appName');

const BASE_URL = 'https://api.github.com';
const API_TOKEN = 'https://github.com/login/oauth/access_token';
const API_GET_USER = `${BASE_URL}/user`;
const API_USERS = `${API_GET_USER}s`;
const API_REPOS = `${BASE_URL}/repos`;

/*
 * private
 */
const fetchGithub = (url, options = {}) => {
  return new Promise((resolve, reject) => {
    request.get(url, {
      headers: {
        'User-Agent': appName
      }
    }, (err, httpResponse, body) => {
      if (err) {
        reject(false);
      }
      if (body) {
        const result = options.parse ? JSON.parse(body) : body;
        resolve(result);
      }
      reject(false);
    });
  });
};

/*
 * private
 */
const postGethub = (url) => {
  return new Promise((resolve, reject) => {
    request.post(url,
      (err, httpResponse, body) => {
        if (err) {
          reject(false);
        }
        if (body) {
          resolve(body);
        }
        reject(false);
      }
    );
  });
}

const getToken = (code) => {
  return postGethub(`${API_TOKEN}?client_id=${clientId}&client_secret=${clientSecret}&code=${code}`)
};

const getUser = (token) => {
  return fetchGithub(`${API_GET_USER}?access_token=${token}`);
};

const getUserRepos = (token) => {

};

const getRepos = (login, token, page = 5) => {
  return fetchGithub(`${API_USERS}/${login}/repos?per_page=50&page=${page}&access_token=${token}`, {
    parse: true
  });
};

const getMultiRepos = (login, token, pages = 3) => {
  const promiseList = new Array(pages).fill(0).map((item, index) => {
    return getRepos(login, token, index + 1);
  });
  return Promise.all(promiseList).then((datas) => {
    let results = [];
    datas.forEach(data => results = [...results, ...data]);
    return Promise.resolve(results);
  });
};

const getReposYearlyCommits = (fullname, token) => {
  return fetchGithub(`${API_REPOS}/${fullname}/stats/commit_activity?access_token=${token}`, {
    parse: true
  });
};

const getAllReposYearlyCommits = (repos, token) => {
  const promiseList = repos.map((item, index) => {
    return getReposYearlyCommits(item.fullname || item.full_name, token);
  });
  return Promise.all(promiseList);
};

/*
 * private
 */
const getReposLanguages = async (fullname, token) => {
  console.log('getReposLanguages');
  let result = {};
  try {
    const languages = await fetchGithub(`${API_REPOS}/${fullname}/languages?access_token=${token}`, {
      parse: true
    });
    let total = 0;
    Object.keys(languages).forEach(key => total += languages[key]);
    Object.keys(languages).forEach(key => result[key] = languages[key] / total);
  } catch (err) {
    result = {};
  } finally {
    return Promise.resolve(result);
  }
};

const getAllReposLanguages = (repos, token) => {
  const promiseList = repos.map((item, index) => {
    return getReposLanguages(item.fullname || item.full_name, token);
  });
  return Promise.all(promiseList);
};

const getOctocat = () => {
  return fetchGithub(`${BASE_URL}/octocat?client_id=${clientId}&client_secret=${clientSecret}`);
};

const getZen = () => {
  return fetchGithub(`${BASE_URL}/zen?client_id=${clientId}&client_secret=${clientSecret}`);
};

export default {
  getToken,
  getUser,
  getUserRepos,
  getRepos,
  getMultiRepos,
  getAllReposYearlyCommits,
  getAllReposLanguages,
  getOctocat,
  getZen
}
