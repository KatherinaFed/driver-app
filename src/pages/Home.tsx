import { Box, Button, Paper, TextField, Typography } from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Home() {
  const [driverId, setDriverId] = useState<string>('');
  const navigate = useNavigate();

  const handleSubmit = () => {
    if (driverId) {
      navigate(`/driver/${driverId}`);
    }
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="100vh"
    >
      <Paper
        elevation={4}
        sx={{
          p: 4,
          width: '100%',
          maxWidth: 400,
          borderRadius: 3,
          textAlign: 'center',
          bgcolor: '#fdfdf3',
        }}
      >
        <Typography variant="h5" mb={2} color='#353b48'>
          🚗 Driver App
        </Typography>
        <Typography variant="body1" color="textSecondary" mb={3}>
          Enter your Driver ID to start a ride
        </Typography>

        <Box display="flex" flexDirection="column" gap={2}>
          <TextField
            label="Driver ID"
            value={driverId}
            onChange={(e) => setDriverId(e.target.value)}
            fullWidth
            variant="outlined"
          />
          <Button
            variant="contained"
            color="success"
            onClick={handleSubmit}
            disabled={!driverId}
          >
            Enter
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}

export default Home;
