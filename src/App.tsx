import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import { Container } from '@mui/material';
import DriverInfo from './pages/DriverInfo';

function App() {
  return (
    <Container sx={{bgcolor: '#cfe8fc'}}  className="driver-app-container">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="driver/:driverId" element={<DriverInfo />} />
        </Routes>
      </BrowserRouter>
    </Container>
  );
}

export default App;
