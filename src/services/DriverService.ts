// src/services/DriverService.ts
import axios from 'axios';
import { DriverInfo, VehicleCheckList } from '../shared/types';

const BASE_URL = 'http://localhost:3001';

export class DriverService {
  static async getDriverShift(driverId: string) {
    const response = await axios.get(`${BASE_URL}/driver-shift`, {
      params: { driverId },
    });
    return response.data as DriverInfo;
  }

  static async submitVehicleCheck(checklist: VehicleCheckList) {
    const response = await axios.post(`${BASE_URL}/vehicle-check`, checklist);
    return response.data;
  }

  static async getAssignedRide() {
    const response = await axios.get(`${BASE_URL}/ride-request`);
    return response;
  }

  static async checkInPassenger(
    shiftId: string,
    passengerId: string,
    action: string
  ) {
    const response = await axios.post(`${BASE_URL}/check-in-passenger`, {
      shiftId,
      passengerId,
      action,
    });
    return response.data;
  }

  static async startRide() {
    const response = await axios.post(`${BASE_URL}/start-ride`);
    return response;
  }
}
