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

// User 없을 시 User 추가, 있을 시 date 비교해서 기존 date에 concat or 새로운 date에 추가
export const addData = (user, userItem) => {
  return axios.put(server + '/api/addData/' + user, userItem);
};

export const updateData = (user, _id, dateItem) => {
  return axios.put(server + '/api/updateDateItem/' + user + '/' + _id, dateItem);
};

export const deleteItem = (user, _id) => {
  return axios.delete(server + '/api/deleteItem/' + user + '/' + _id);
};