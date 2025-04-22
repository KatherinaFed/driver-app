import axios from 'axios';

const BASE_URL = 'http://localhost:3001';

export const getDriverShift = (driverId: string) => {
  return axios.get(`${BASE_URL}/driver-shift`, { params: { driverId } });
};

export const postVehicleCheck = (checkList: object) => {
  return axios.post(`${BASE_URL}/vehicle-check`, checkList);
};

export const getAssignedRide = () => {
  return axios.get(`${BASE_URL}/ride-request`);
};

export const postCheckInPassengers = (
  shiftId: string,
  passengerId: string,
  action: string
) => {
  return axios.post(`${BASE_URL}/check-in-passenger`, {
    shiftId,
    passengerId,
    action,
  });
};

export const postStartRide = () => {
  return axios.post(`${BASE_URL}/start-ride`, {});
};
