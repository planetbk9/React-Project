import axios from 'axios';
import server from './serverinfo';

export const getUserAllData = (user) => {
  return axios.get(server + '/api/all-data/' + user);
};

export const getData = (user, _id) => {
  return axios.get(server + '/api/data/' + user + '/' + _id);
};

export const addUser = (userData) => {
  return axios.post(server + '/api/user', userData);
};

export const checkUser = (id) => {
  return axios.get(server + '/api/valid-user/' + id);
};

export const loginUser = (id, password) => {
  return axios.get(server + '/api/login/' + id + '/' + password);
}

export const changeUserInfo = (id, password) => {
  return axios.put(server + '/api/user-info/' + id + '/' + password);
}

export const addData = (user, userInfo) => {
  return axios.put(server + '/api/data/' + user, userInfo);
};

export const updateData = (user, _id, dateItem) => {
  return axios.put(server + '/api/date-item/' + user + '/' + _id, dateItem);
};

export const deleteItem = (user, _id) => {
  return axios.delete(server + '/api/date-item/' + user + '/' + _id);
};

export const deleteUser = (user) => {
  return axios.delete(server + '/api/user/' + user);
};

export const getAllUser = () => {
  return axios.get(server + '/api/all-user');
};