import axios from 'axios';

const BASE_URL = 'http://localhost:3001';

export const getDriverShift = (driverId: string) => {
  return axios.get(`${BASE_URL}/driver-shift`, { params: { driverId } });
};

export const postVehicleCheck = (checkList: object) => {
  console.log(checkList);
  return axios.post(`${BASE_URL}/vehicle-check`, checkList);
};

export const getAssignedRide = () => {
  return axios.get(`${BASE_URL}/ride-request`);
};
