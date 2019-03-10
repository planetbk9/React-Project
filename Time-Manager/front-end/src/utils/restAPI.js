import axios from 'axios';
import server from './serverinfo';

export const getUserAllData = (user) => {
  return axios.get(server + '/api/getUserAllData/' + user);
};

export const getData = (user, _id) => {
  return axios.get(server + '/api/getData/' + user + '/' + _id);
};

export const addUser = (userData) => {
  return axios.post(server + '/api/addUser', userData);
};

export const checkUser = (id) => {
  return axios.get(server + '/api/checkUser/' + id);
};

export const loginUser = (id, password) => {
  return axios.get(server + '/api/login/' + id + '/' + password);
}

export const changeUserInfo = (id, password) => {
  return axios.put(server + '/api/updateUserInfo/' + id + '/' + password);
}

export const addData = (user, userInfo) => {
  return axios.put(server + '/api/addData/' + user, userInfo);
};

export const updateData = (user, _id, dateItem) => {
  return axios.put(server + '/api/updateDateItem/' + user + '/' + _id, dateItem);
};

export const deleteItem = (user, _id) => {
  return axios.delete(server + '/api/deleteItem/' + user + '/' + _id);
};