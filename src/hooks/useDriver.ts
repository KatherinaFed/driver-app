import { useCallback, useEffect, useState } from 'react';
import { DefaultService, DriverShift } from '../api/generated';

export function useDriver(driverId?: string) {
  const [driverInfo, setDriverInfo] = useState<DriverShift | null>(null);
  driverInfo;
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const fetchDriverInfo = useCallback(async () => {
    if (!driverId) return;

    setLoading(true);

    try {
      const data = await DefaultService.getDriverShift(driverId);
      const selectedData: DriverShift = {
        driverId: data.driverId,
        licensePlate: data.licensePlate,
        vehicleId: data.vehicleId,
        vehicleName: data.vehicleName,
        vehicleCheckDone: data.vehicleCheckDone,
      };
      setDriverInfo(selectedData);
      setError('');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error fetching data');
    } finally {
      setLoading(false);
    }
  }, [driverId]);

  useEffect(() => {
    if (driverId) {
      fetchDriverInfo();
    }
  }, [driverId]);

  return {
    driverInfo,
    error,
    loading,
    fetchDriverInfo,
    setError,
  };
}
