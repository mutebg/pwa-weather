import config from '../config';

const apiFetch = (url, method = 'get', data = {}) => {
  const options = {
    method,
  };
  if (data) {
    options.body = JSON.stringify(data);
  }
  return fetch(url, options).then(response => response.json());
};

// ajax get method
export const get = path => apiFetch(config.API_URL + path, 'get', null);

// ajax post method
export const post = (path, data) => apiFetch(config.API_URL + path, 'post', data);
