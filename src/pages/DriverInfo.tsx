import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getAssignedRide, getDriverShift } from '../services/api';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  Paper,
  Typography,
} from '@mui/material';
import VehicleCheck from '../components/VehicleCheck';
import { Ride } from '../shared/types';

type DriverInfo = {
  driverId: string;
  licensePlate: string;
  vehicleId: string;
  vehicleName: string;
  vehicleCheckDone: boolean;
};

function DriverInfo() {
  const [driverInfo, setDriverInfo] = useState<DriverInfo | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState<boolean>(true);
  const [rideInfo, setRideInfo] = useState<Ride | null>(null);

  // url params
  const params = useParams<{ driverId: string }>();
  const navigate = useNavigate();

  // GET driver shift
  const fetchDriverInfo = async () => {
    try {
      if (!params.driverId) return;

      const res = await getDriverShift(params.driverId);
      const { data } = res;

      const selectedData: DriverInfo = {
        driverId: data.driverId,
        licensePlate: data.licensePlate,
        vehicleId: data.vehicleId,
        vehicleName: data.vehicleName,
        vehicleCheckDone: data.vehicleCheckDone,
      };

      setDriverInfo(selectedData);
    } catch (error: any) {
      setError(error.response?.data?.message || 'Error fetching data');
    } finally {
      setLoading(false);
    }
  };

  // checking driver ID
  useEffect(() => {
    if (params.driverId) {
      fetchDriverInfo();
    }
  }, [params.driverId]);

  // checking if vehicle check Done
  useEffect(() => {
    // skip if vehicle check is true or the polling after ride data is recieved
    if (!driverInfo?.vehicleCheckDone || rideInfo) return;

    // 5–20 seconds
    const maxPollingTime = 20000;
    const pollingStartTime = Date.now();

    const pollingRide = async () => {
      try {
        const res = await getAssignedRide();

        if (res.status === 200) {
          const { data } = res;
          const selectedRideData: Ride = {
            dropoffLocation: data.dropoffLocation,
            passengers: data.passengers,
            pickupLocation: data.pickupLocation,
            rideId: data.rideId,
            rideStarted: data.rideStarted,
            shiftId: data.shiftId,
          };

          setRideInfo(selectedRideData);
          setError('');
          navigate('/ride', { state: selectedRideData });
          clearInterval(interval);
        }
      } catch (error: any) {
        if (error.response?.status !== 404) {
          setError('Failed to check ride assignment');
        } else {
          setError('No ride assigned yet');
        }
      }
    };

    const interval = setInterval(() => {
      const timeOut = Date.now() - pollingStartTime;

      if (timeOut > maxPollingTime) {
        clearInterval(interval);
        setError('No rides, please, try again');
      } else {
        pollingRide();
      }
    }, 3000);

    return () => {
      clearInterval(interval);
    };
  }, [driverInfo?.vehicleCheckDone, rideInfo]);

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Box p={2}>
        <Button variant="outlined" onClick={() => navigate('/')}>
          Back
        </Button>
      </Box>
      {!error && (
        <Typography variant="h4" color="black" mt={2}>
          Driver Info
        </Typography>
      )}

      {loading && <CircularProgress />}

      {driverInfo && (
        <Paper sx={{ p: 3, mt: 3 }}>
          <Box mb={2}>
            <Typography variant="h6">Driver ID:</Typography>
            <Typography>{driverInfo.driverId}</Typography>
          </Box>
          <Box mb={2}>
            <Typography variant="h6">Auto:</Typography>
            <Typography>{driverInfo.vehicleName}</Typography>
          </Box>
          <Box mb={2}>
            <Typography variant="h6">Auto ID:</Typography>
            <Typography>{driverInfo.vehicleId}</Typography>
          </Box>
          <Box mb={2}>
            <Typography variant="h6">License Plate:</Typography>
            <Typography>{driverInfo.licensePlate}</Typography>
          </Box>
          <Box>
            <Typography variant="h6">Vehicle Check:</Typography>
            <Typography color={driverInfo.vehicleCheckDone ? 'green' : 'red'}>
              {driverInfo.vehicleCheckDone ? '✅ Done' : "❌ Haven't done"}
            </Typography>
          </Box>
        </Paper>
      )}

      {error && <Alert severity="error">{error}</Alert>}

      {driverInfo && !driverInfo?.vehicleCheckDone && (
        <VehicleCheck onSuccess={() => fetchDriverInfo()} />
      )}
    </Container>
  );
}

export default DriverInfo;
