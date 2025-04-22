import { Box, Button, Typography } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';

function StartRide() {
  const location = useLocation();
  const message = location.state as string;
  const navigate = useNavigate();

  return (
    <Box p={4} textAlign="center">
      <Typography variant="h5">⚡️{message}⚡️</Typography>

      <Button variant="contained" onClick={() => navigate('/')}>
        Back to Home
      </Button>
    </Box>
  );
}

export default StartRide;
