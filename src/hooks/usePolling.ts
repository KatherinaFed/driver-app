import { useEffect } from 'react';
import { RideT } from '../shared/types';
import { DriverService } from '../services/DriverService';

interface RidePollingProps {
  started: boolean;
  onSuccess: (ride: RideT) => void;
  onError: (msg: string) => void;
}

function useRidePolling({
  started,
  onSuccess,
  onError
}: RidePollingProps) {
  useEffect(() => {
    if (!started) return;

    const maxPollingTime = 20000;
    const pollingStartTime = Date.now();

    const pollingRide = async () => {
      try {
        const res = await DriverService.getAssignedRide();
        const { data } = res;
        const selectedRideData: RideT = {
          dropoffLocation: data.dropoffLocation,
          passengers: data.passengers,
          pickupLocation: data.pickupLocation,
          rideId: data.rideId,
          rideStarted: data.rideStarted,
          shiftId: data.shiftId,
        };
        if (res.status === 200) {
          onSuccess(selectedRideData);
        }
      } catch (error: any) {
        if (error.response?.status !== 404) {
          onError('Failed to check ride assignment');
        }
      }
    };

    const interval = setInterval(() => {
      const timeOut = Date.now() - pollingStartTime;

      if (timeOut > maxPollingTime) {
        clearInterval(interval);
        onError('No rides, please, try again');
      } else {
        pollingRide();
      }
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [started, onSuccess, onError]);
}

export default useRidePolling;
