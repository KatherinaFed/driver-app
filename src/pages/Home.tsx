import { Box, Button, Container, TextField } from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Home() {
  const [driverId, setDriverId] = useState<string>('');
  const navigate = useNavigate();

  const handleSubmit = () => {
    if (driverId.trim()) {
      navigate(`/driver/${driverId}`);
    }
  };

  return (
    <Box sx={{ display: 'flex', gap: 2 }}>
      <TextField
        label="Driver ID"
        value={driverId}
        onChange={(e) => setDriverId(e.target.value)}
        fullWidth
      />
      <Button variant="contained" onClick={handleSubmit}>
        Enter
      </Button>
    </Box>
  );
}

export default Home;
