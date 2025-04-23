import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import { Box } from '@mui/material';
import Driver from './pages/Driver';
import Ride from './pages/Ride';
import StartRide from './pages/Start';

function App() {
  return (
    <Box
      sx={{
        background: 'linear-gradient(to bottom right, #f5fff9, #6ab04c)',
        minHeight: '100vh',
        width: '100vw',
        overflowX: 'hidden',
      }}
      className="driver-app-container"
    >
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="driver/:driverId" element={<Driver />} />
          <Route path="/ride" element={<Ride />} />
          <Route path="/start-ride" element={<StartRide />} />
        </Routes>
      </BrowserRouter>
    </Box>
  );
}

export default App;
