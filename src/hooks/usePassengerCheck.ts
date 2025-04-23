import {  useState } from 'react';
import { RideT } from '../shared/types';
import { DriverService } from '../services/DriverService';

export function usePassengerCheck(
  initRideData: RideT,
  onError: (msg: string) => void
) {
  const [rideInfo, setRideInfo] = useState<RideT>(initRideData);

  const handlePassengerCheck = async (passId: string, status: string) => {
    try {
      await DriverService.checkInPassenger(rideInfo.shiftId, passId, status);

      // add a new status of passengers
      setRideInfo((prev) => ({
        ...prev,
        passengers: prev.passengers.map((pas) =>
          pas.id === passId
            ? {
                ...pas,
                status: status === 'checked-in' ? 'checked-in' : 'rejected',
              }
            : pas
        ),
      }));
    } catch (err: any) {
      onError(err.response.data.message);
    }
  };

  return {
    rideInfo,
    handlePassengerCheck,
  };
}
