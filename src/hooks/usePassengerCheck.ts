import { useState } from 'react';
import { DefaultService, Passenger, Ride } from '../api/generated';

export function usePassengerCheck(
  initRideData: Ride,
  onError: (msg: string) => void
) {
  const [rideInfo, setRideInfo] = useState<Ride>(initRideData);

  const handlePassengerCheck = async (
    passId: string,
    status: Passenger.status
  ) => {
    try {
      const action = status === 'checked-in' ? 'check-in' : 'reject';
      await DefaultService.postCheckInPassenger({
        passengerId: passId,
        action,
      });

      setRideInfo((prev) => ({
        ...prev,
        passengers: (prev.passengers || []).map((pas) =>
          pas.id === passId
            ? {
                ...pas,
                status,
              }
            : pas
        ),
      }));
    } catch (err: any) {
      onError(
        err.response?.data?.message || 'Failed to update passenger status'
      );
    }
  };

  return {
    rideInfo,
    handlePassengerCheck,
  };
}
