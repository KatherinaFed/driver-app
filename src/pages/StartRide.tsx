import { Box, Button, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Lottie from 'lottie-react';
import rideStartedAnimation from '../assets/animation-ride.json';

function StartRide() {
  const navigate = useNavigate();

  return (
    <Box p={4} sx={{ position: 'relative' }} textAlign="center">
      <Button
        sx={{ pt: '2', position: 'absolute', top: 10, right: 10 }}
        variant="outlined"
        onClick={() => navigate('/')}
      >
        Back to Home
      </Button>

      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
      >
        <Lottie
          animationData={rideStartedAnimation}
          loop={true}
          style={{ width: 300, height: 300 }}
        />
      </Box>

      <Typography variant="body1" color="textSecondary" mt={1}>
        {'Your journey is started. Drive safe!'}
      </Typography>
    </Box>
  );
}

export default StartRide;
