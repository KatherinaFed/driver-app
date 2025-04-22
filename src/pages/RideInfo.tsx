import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Passenger, Ride } from '../shared/types';
import {
  Alert,
  Box,
  Button,
  Chip,
  Divider,
  Paper,
  Typography,
} from '@mui/material';
import { postCheckInPassengers, postStartRide } from '../services/api';
import checkIcon from '../assets/checkIcon.png';
import rejectIson from '../assets/rejectIcon.png';

const statusColorMap: Record<
  Passenger['status'],
  'success' | 'error' | 'default'
> = {
  'checked-in': 'success',
  rejected: 'error',
  pending: 'default',
};

const statusLabelMap: Record<
  Passenger['status'],
  'Checked-in' | 'Rejected' | 'Waiting'
> = {
  'checked-in': 'Checked-in',
  rejected: 'Rejected',
  pending: 'Waiting',
};

const statusColorLeftBorder: Record<
  Passenger['status'],
  '#2ecc71' | '#e74c3c' | '#bdc3c7'
> = {
  'checked-in': '#2ecc71',
  rejected: '#e74c3c',
  pending: '#bdc3c7',
};

function RideInfo() {
  const location = useLocation();
  const navigate = useNavigate();
  const data = location.state as Ride;

  const [rideInfo, setRideInfo] = useState<Ride>(data);
  const [error, setError] = useState<string>('');

  const countOfPassengers = rideInfo.passengers.filter(
    (pas) => pas.status !== 'pending'
  ).length;

  const handlePassengerCheck = async (passId: string, status: string) => {
    console.log(passId);
    try {
      await postCheckInPassengers(rideInfo.shiftId, passId, status);

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
      setError(err.response.data.message);
    }
  };

  const handleStart = async () => {
    try {
      const res = await postStartRide();
      if (res.status === 200) {
        setError('');
        navigate('/start-ride');
      }
    } catch (err: any) {
      setError(err.response.data.message || 'Something went wrong...');
    }
  };

  useEffect(() => {
    const allHandled = rideInfo.passengers.every((p) => p.status !== 'pending');

    if (allHandled) {
      setError('');
    }
  }, [rideInfo.passengers, error]);

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      height="100vh"
      sx={{ marginTop: 1, paddingTop: 1 }}
    >
      <Typography variant="h5" align="center" p={2}>
        🚌 Ride Information
      </Typography>

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
        <Typography variant="body1" mb={1}>
          <Box component="span" fontWeight="bold">
            📍 From:
          </Box>{' '}
          {rideInfo.pickupLocation.address}
        </Typography>
        <Typography variant="body1">
          <Box component="span" fontWeight="bold">
            🏁 To:
          </Box>{' '}
          {rideInfo.dropoffLocation.address}
        </Typography>
      </Paper>

      <Divider variant="middle" />

      <Typography variant="h5" align="center" m={2}>
        Passengers ({countOfPassengers}/{rideInfo.passengers.length})
      </Typography>

      {rideInfo.passengers.map((pas, key) => (
        <Paper
          key={key}
          elevation={2}
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%',
            maxWidth: { xs: '80%', md: '500px' },
            mb: 2,
            p: { xs: 2, md: 3 },
            borderRadius: 3,
            borderLeft: `6px solid ${statusColorLeftBorder[pas.status]}`,

            bgcolor: '#fdfdf3',
          }}
        >
          <Box display="flex" flexDirection="row" alignItems="center" gap={1}>
            <Typography fontWeight={500}>👤 {pas.name}</Typography>
            <Chip
              label={statusLabelMap[pas.status]}
              color={statusColorMap[pas.status]}
              size="small"
              variant="outlined"
            />
          </Box>

          <Box display="flex" flexDirection="row" alignItems="center" gap={1}>
            <Button
              size="small"
              variant="outlined"
              color="success"
              onClick={() => handlePassengerCheck(pas.id, 'checked-in')}
            >
              <img src={checkIcon} />
            </Button>
            <Button
              size="small"
              variant="outlined"
              color="error"
              onClick={() => handlePassengerCheck(pas.id, 'reject')}
            >
              <img src={rejectIson} />
            </Button>
          </Box>
        </Paper>
      ))}

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box>
        <Button
          sx={{
            display: 'flex',
            flexDirection: 'column',
          }}
          variant="contained"
          color="success"
          size="large"
          onClick={handleStart}
        >
          Start Ride
        </Button>
      </Box>
    </Box>
  );
}

export default RideInfo;
