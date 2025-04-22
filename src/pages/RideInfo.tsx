import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Passenger, Ride } from '../shared/types';
import {
  Alert,
  Box,
  Button,
  Chip,
  Container,
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
        navigate('/start-ride');
      }
    } catch (err: any) {
      setError(err.response.data.message || 'Something went wrong...');
    }
  };

  return (
    <Container maxWidth="md">
      <Typography variant="h5" align="center"  p={2}>
        🚌 Ride Information
      </Typography>

      <Paper
        elevation={3}
        sx={{
          p: 4,
          borderRadius: 3,
          mb: 4,
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

      <Typography variant="h5" align="center"  m={2}>
        Passengers ({countOfPassengers}/{rideInfo.passengers.length})
      </Typography>

      {rideInfo.passengers.map((pas, key) => (
        <Paper
          key={key}
          sx={{
            p: 2,
            m: 2,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderRadius: 2,
            bgcolor: '#fafafa',
          }}
        >
          <Box>
            <Typography>
              <Box component="span" fontWeight="bold">
                👤 Name:
              </Box>{' '}
              {pas.name}
            </Typography>
            <Chip
              label={statusLabelMap[pas.status]}
              color={statusColorMap[pas.status]}
              size="small"
              sx={{ mt: 1 }}
            />
          </Box>

          <Stack direction="row" spacing={1}>
            <Button
              size="small"
              variant="contained"
              color="success"
              onClick={() => handlePassengerCheck(pas.id, 'checked-in')}
            >
              Check-In ✅
            </Button>
            <Button
              size="small"
              variant="outlined"
              color="error"
              onClick={() => handlePassengerCheck(pas.id, 'reject')}
            >
              Reject ❌
            </Button>
          </Stack>
        </Paper>
      ))}

      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}

      <Box display="flex" justifyContent="center" mt={3} pb={3}>
        <Button
          variant="contained"
          color="success"
          size="large"
          onClick={handleStart}
        >
          🚀 Start Ride
        </Button>
      </Box>
    </Container>
  );
}

export default RideInfo;
