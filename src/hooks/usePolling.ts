import { useEffect } from 'react';
import { DefaultService, Ride } from '../api/generated';

interface RidePollingProps {
  started: boolean;
  onSuccess: (ride: Ride) => void;
  onError: (msg: string) => void;
}

function useRidePolling({ started, onSuccess, onError }: RidePollingProps) {
  useEffect(() => {
    if (!started) return;

    const maxPollingTime = 20000;
    const pollingStartTime = Date.now();

    const pollingRide = async () => {
      try {
        const data = await DefaultService.getRideRequest();

        onSuccess(data);
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
