import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import {
  Alert,
  Box,
  Button,
  Chip,
  Divider,
  Paper,
  Typography,
} from '@mui/material';
import checkIcon from '../assets/checkIcon.png';
import rejectIson from '../assets/rejectIcon.png';
import { usePassengerCheck } from '../hooks/usePassengerCheck';
import { useStartRide } from '../hooks/useStartRide';
import {
  statusColorLeftBorder,
  statusLabelMap,
  statusColorMap,
} from '../shared/colorStatus';
import { Passenger, Ride } from '../api/generated';

function RidePage() {
  const location = useLocation();
  const [localError, setLocalError] = useState<string>('');

  const data = location.state as Ride;
  const { rideInfo, handlePassengerCheck } = usePassengerCheck(
    data,
    setLocalError
  );
  const { handleStartRide, error, setError } = useStartRide();

  const countOfPassengers = rideInfo.passengers?.filter(
    (pas) => pas.status !== 'pending'
  ).length;

  useEffect(() => {
    const allHandled = rideInfo.passengers?.every(
      (p) => p.status !== 'pending'
    );

    if (allHandled) {
      setLocalError('');
      setError('');
    }
  }, [rideInfo.passengers]);

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
          {rideInfo.pickupLocation?.address}
        </Typography>
        <Typography variant="body1">
          <Box component="span" fontWeight="bold">
            🏁 To:
          </Box>{' '}
          {rideInfo.dropoffLocation?.address}
        </Typography>
      </Paper>

      <Divider variant="middle" />

      <Typography variant="h5" align="center" m={2}>
        Passengers ({countOfPassengers}/{rideInfo.passengers?.length})
      </Typography>

      {rideInfo.passengers?.map((pas, key) => (
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
            borderLeft: `6px solid ${
              statusColorLeftBorder[pas.status ?? 'pending']
            }`,

            bgcolor: '#fdfdf3',
          }}
        >
          <Box display="flex" flexDirection="row" alignItems="center" gap={1}>
            <Typography fontWeight={500}>👤 {pas.name}</Typography>
            <Chip
              label={statusLabelMap[pas.status ?? 'pending']}
              color={statusColorMap[pas.status ?? 'pending']}
              size="small"
              variant="outlined"
            />
          </Box>

          <Box display="flex" flexDirection="row" alignItems="center" gap={1}>
            <Button
              size="small"
              variant="outlined"
              color="success"
              onClick={() => {
                if (pas.id) {
                  handlePassengerCheck(pas.id, Passenger.status.CHECKED_IN);
                }
              }}
            >
              <img alt="check-in" src={checkIcon} />
            </Button>
            <Button
              size="small"
              variant="outlined"
              color="error"
              onClick={() => {
                if (pas.id) {
                  handlePassengerCheck(pas.id, Passenger.status.REJECTED);
                }
              }}
            >
              <img alt="reject" src={rejectIson} />
            </Button>
          </Box>
        </Paper>
      ))}

      {(localError || error) && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {localError || error}
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
          onClick={handleStartRide}
        >
          Start Ride
        </Button>
      </Box>
    </Box>
  );
}

export default RidePage;
