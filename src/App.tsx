import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import { Container } from '@mui/material';
import DriverInfo from './pages/DriverInfo';
import RideInfo from './pages/RideInfo';

function App() {
  return (
    <Container sx={{bgcolor: '#60bf78'}}  className="driver-app-container">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="driver/:driverId" element={<DriverInfo />} />
          <Route path='/ride' element={<RideInfo/>} />
        </Routes>
      </BrowserRouter>
    </Container>
  );
}

export default App;
