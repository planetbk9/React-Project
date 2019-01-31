import axios from 'axios';
import server from './serverinfo';

export const getAllData = () => {
  return axios.get(server+"/api/times");
};