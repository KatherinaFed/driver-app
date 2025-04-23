export type DriverInfo = {
  driverId: string;
  licensePlate: string;
  vehicleId: string;
  vehicleName: string;
  vehicleCheckDone: boolean;
};

export type VehicleCheckList = {
  carOk: boolean;
  licenseOk: boolean;
  lightsWorking: boolean;
  brakesWorking: boolean;
};

export type Passenger = {
  id: string;
  name: string;
  status: string;
};

export type RideT = {
  dropoffLocation: {
    address: string;
  };
  passengers: Passenger[];
  pickupLocation: {
    address: string;
  };
  rideId: string;
  rideStarted: boolean;
  shiftId: string;
};