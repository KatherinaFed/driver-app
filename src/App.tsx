import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import { Box } from '@mui/material';
import DriverInfo from './pages/DriverInfo';
import RideInfo from './pages/RideInfo';
import StartRide from './pages/StartRide';

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
          <Route path="driver/:driverId" element={<DriverInfo />} />
          <Route path="/ride" element={<RideInfo />} />
          <Route path="/start-ride" element={<StartRide />} />
        </Routes>
      </BrowserRouter>
    </Box>
  );
}

export default App;
