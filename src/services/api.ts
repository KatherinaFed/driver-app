import axios from 'axios';

const BASE_URL = 'http://localhost:3001';

export const getDriverShift = (driverId: string) => {
  return axios.get(`${BASE_URL}/driver-shift`, { params: { driverId } });
};
