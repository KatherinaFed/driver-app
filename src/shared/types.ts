export type Passenger = {
  id: string;
  name: string;
  status: string;
};

export type Ride = {
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