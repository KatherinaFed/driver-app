import { useState } from 'react';
import { useLocation } from 'react-router-dom';
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
import { postCheckInPassengers } from '../services/api';

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
  const data = location.state as Ride;

  const [rideInfo, setRideInfo] = useState<Ride>(data);
  const [error, setError] = useState<string>('');

  const allChecked = rideInfo.passengers.every(
    (pas) => pas.status === 'checked-in' || pas.status === 'rejected'
  );
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
              <Typography>Passenger's name: {pas.name}</Typography>
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

      {allChecked && (
        <Box mt={4}>
          <Button variant="contained" color="primary">
            Start Ride ⚡️
          </Button>
        </Box>
      )}

      {error && (
        <Typography color="error" mt={2} align="center">
          {error}
        </Typography>
      )}
    </Box>
  );
}

export default RideInfo;
