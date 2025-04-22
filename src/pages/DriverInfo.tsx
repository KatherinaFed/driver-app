import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getAssignedRide, getDriverShift } from '../services/api';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Divider,
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
          setLoading(true)
          // setError('No ride assigned yet');
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
    }, 1000);

    return () => {
      clearInterval(interval);
      setLoading(false);
    };
  }, [driverInfo?.vehicleCheckDone, rideInfo]);

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="flex-start"
      alignItems="center"
      height="100vh"
      sx={{ marginTop: 2, paddingTop: 2 }}
    >
      <Paper
        elevation={3}
        sx={{
          width: '100%',
          maxWidth: { xs: '80%', md: '500px' },
          p: { xs: 2, md: 3 },
          borderRadius: 3,
          backgroundColor: '#fdfdf3',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            mb: 2,
            position: 'relative',
          }}
        >
          <Button
            variant="outlined"
            onClick={() => navigate('/')}
          >
            Back
          </Button>

          <Typography
            variant="h5"
            color="#353b48"
            sx={{
              position: 'absolute',
              left: '50%',
              transform: 'translateX(-50%)',
              width: 'max-content',
            }}
          >
            🚐 Driver Info
          </Typography>
        </Box>

        <Divider sx={{ mb: 2 }} />

        {loading && (
          <Box display="flex" justifyContent="center" my={4}>
            <CircularProgress />
          </Box>
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {driverInfo && (
          <>
            <Box mb={1}>
              <Typography variant="body1">
                <Box component="span" fontWeight="bold">
                  Driver ID:
                </Box>{' '}
                {driverInfo.driverId}
              </Typography>
            </Box>
            <Box mb={1}>
              <Typography variant="body1">
                <Box component="span" fontWeight="bold">
                  Auto:
                </Box>{' '}
                {driverInfo.vehicleName}
              </Typography>
            </Box>
            <Box mb={1}>
              <Typography variant="body1">
                <Box component="span" fontWeight="bold">
                  License Plate:
                </Box>{' '}
                {driverInfo.licensePlate}
              </Typography>
            </Box>
            <Box mb={1}>
              <Typography variant="body1">
                <Box component="span" fontWeight="bold">
                  Vehicle Check:
                </Box>{' '}
                <Box
                  component="span"
                  color={driverInfo.vehicleCheckDone ? 'green' : 'red'}
                >
                  {driverInfo.vehicleCheckDone ? '✅ Done' : "❌ Haven't done"}
                </Box>
              </Typography>
            </Box>
          </>
        )}
      </Paper>

      {driverInfo && !driverInfo?.vehicleCheckDone && (
        <VehicleCheck onSuccess={() => fetchDriverInfo()} />
      )}
    </Box>
  );
}

export default DriverInfo;
