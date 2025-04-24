import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Divider,
  Fade,
  Paper,
  Typography,
} from '@mui/material';
import VehicleCheck from '../components/VehicleCheck';
import { useDriver } from '../hooks/useDriver';
import useRidePolling from '../hooks/usePolling';
import { Ride } from '../api/generated';

function Driver() {
  const { driverId } = useParams<{ driverId: string }>();
  const navigate = useNavigate();
  const [rideInfo, setRideInfo] = useState<Ride | null>(null);

  // fetchind driver
  const { driverInfo, error, loading, fetchDriverInfo, setError } = useDriver(driverId);

  const shouldStartPolling = !!driverInfo?.vehicleCheckDone && !rideInfo;
  const handlePollingSuccess = (ride: Ride) => {
    setRideInfo(ride);
    navigate('/ride', { state: ride });
  };
  const handlePollingError = (msg: string) => {
    setError(msg);
  };

  // polling ride
  useRidePolling({
    started: shouldStartPolling,
    onSuccess: handlePollingSuccess,
    onError: handlePollingError,
  });

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
          <Button variant="outlined" onClick={() => navigate('/')}>
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
          <Fade in timeout={500}>
            <Box
              display='flex'
              flexDirection='column'
              alignItems='center'
              my={2}
            >
              <Typography>Loading driver info...</Typography>
              <CircularProgress />
            </Box>
          </Fade>
        )}

        {shouldStartPolling && !loading && (
          <Fade in={true} timeout={500}>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <Typography>Waiting for rides...</Typography>
              <CircularProgress />
            </Box>
          </Fade>
        )}

        {error && !shouldStartPolling && (
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

export default Driver;
