import config from '../config';
import axios from 'axios';


const apiFetch = (url, method = 'get', data = {}) => {
  let headers = {}

  return axios({
    method,
    url,
    data,
    headers,
    responseType: 'json',
  });
};

// ajax get method
export const get = path => apiFetch(config.API_URL + path, 'get', null);

// ajax post method
export const post = (path, data) => apiFetch(config.API_URL + path, 'post', data);
