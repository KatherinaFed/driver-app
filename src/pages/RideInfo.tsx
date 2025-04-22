import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Passenger, Ride } from '../shared/types';
import {
  Box,
  Button,
  Chip,
  Divider,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import { postCheckInPassengers, postStartRide } from '../services/api';

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

function RideInfo() {
  const location = useLocation();
  const navigate = useNavigate();
  const data = location.state as Ride;

  const [rideInfo, setRideInfo] = useState<Ride>(data);
  const [error, setError] = useState<string>('');

  const countOfPassengers = rideInfo.passengers.filter(
    (pas) => pas.status === 'pending'
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
        navigate('/start-ride', { state: res.data.message });
      }
    } catch (err: any) {
      setError(err.response.data.message || 'Something went wrong...');
    }
  };

  return (
    <Box>
      <Typography variant="h5" align="center" m={2} p={2}>
        🚌 Ride Information
      </Typography>

      <Paper elevation={4} sx={{ m: 2, p: 2 }}>
        <Typography>
          <Box component="span" fontWeight="bold">
            📍 From:
          </Box>{' '}
          {data.pickupLocation.address}
        </Typography>
        <Typography>
          <Box component="span" fontWeight="bold">
            🏁 To:
          </Box>{' '}
          {data.dropoffLocation.address}
        </Typography>
      </Paper>

      <Divider variant="middle" />

      <Typography variant="h5" align="center" m={2} p={2}>
        👥 Passengers ({countOfPassengers}/{rideInfo.passengers.length})
      </Typography>

      {rideInfo.passengers.map((pas, key) => (
        <Paper key={key} sx={{ m: 2, p: 2 }}>
          <Stack
            direction="row"
            alignItems="center"
            color={pas.status === 'checked-in' ? 'success' : 'error'}
          >
            <Box>
              <Typography>
                <Box component="span" fontWeight="bold">
                  Passenger's name:
                </Box>{' '}
                {pas.name}
              </Typography>
              <Chip
                label={statusLabelMap[pas.status]}
                color={statusColorMap[pas.status]}
                size="small"
              />
            </Box>
            <Stack direction="row" spacing={1}>
              <Button
                size="small"
                variant="outlined"
                onClick={() => handlePassengerCheck(pas.id, 'checked-in')}
              >
                Check-In ✅
              </Button>
              <Button
                size="small"
                variant="outlined"
                onClick={() => handlePassengerCheck(pas.id, 'reject')}
              >
                Reject ❌
              </Button>
            </Stack>
          </Stack>
        </Paper>
      ))}

      {error && (
        <Typography color="error" mt={2} align="center">
          {error}
        </Typography>
      )}

      <Box mt={4}>
        <Button
          variant="contained"
          color="secondary"
          onClick={() => handleStart()}
        >
          Start Ride
        </Button>
      </Box>
    </Box>
  );
}

export default RideInfo;
