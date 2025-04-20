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

type DriverInfo = {
  driverId: string;
  licensePlate: string;
  vehicleId: string;
  vehicleName: string;
  vehicleCheckDone: boolean;
};

type Passenger = {
  id: string;
  name: string;
  status: string;
};

type Ride = {
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
    if (!driverInfo?.vehicleCheckDone) return;

    const pollingRide = async () => {
      try {
        const res = await getAssignedRide();

        if (res.status === 200) {
          const { data } = res;
          const selectedRidedata: Ride = {
            dropoffLocation: data.dropoffLocation,
            passengers: data.passengers,
            pickupLocation: data.pickupLocation,
            rideId: data.rideId,
            rideStarted: data.rideStarted,
            shiftId: data.shiftId,
          };

          setRideInfo(selectedRidedata);
        }
      } catch (error: any) {
        if (error.response?.status === 404) {
          const message = 'Driver not found';
          setError(message);
        } else {
          setError('Something went wrong. Please try again.');
        }
      }
    };

    const interval = setInterval(() => {
      console.log('⏱ Polling /ride-request...');
      pollingRide();
    }, 3000);

    return () => clearInterval(interval);
  }, [driverInfo?.vehicleCheckDone]);

  console.log(rideInfo);

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
      {error && <Alert severity="error">{error}</Alert>}

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

      {driverInfo && !driverInfo?.vehicleCheckDone && (
        <VehicleCheck onSuccess={() => fetchDriverInfo()} />
      )}
    </Container>
  );
}

export default DriverInfo;
