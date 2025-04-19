import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getDriverShift } from '../services/api';
import { Alert, Box, Button, CircularProgress, Container, Paper, Typography } from '@mui/material';

type DriverInfo = {
  driverId: string;
  licensePlate: string;
  vehicleId: string;
  vehicleName: string;
  vehicleCheckDone: boolean;
};

function DriverInfo() {
  const [driverInfo, setDriverInfo] = useState<DriverInfo | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState<boolean>(true);

  const { driverId } = useParams<{ driverId: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    if (!driverId) return;

    const fetchDriverInfo = async () => {
      try {
        const res = await getDriverShift(driverId);
        const { data } = res;

        const selectedData: DriverInfo = {
          driverId: data.driverId,
          licensePlate: data.licensePlate,
          vehicleId: data.vehicleId,
          vehicleName: data.vehicleName,
          vehicleCheckDone: data.vehicleCheckDone,
        };

        setDriverInfo(selectedData);
      } catch (error: any) {
        setError(error.response?.data?.message || 'Error fetching data');
      } finally {
        setLoading(false);
      }
    };

    fetchDriverInfo();
  }, [driverId]);

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Button variant="outlined"  onClick={() => navigate('/')}>Back</Button>
      {!error && <Typography variant="h4" color='black' mt={2}>
        Driver Info
      </Typography>}


      {loading && <CircularProgress />}
      {error && <Alert severity="error">{error}</Alert>}

      {driverInfo && (
        <Paper sx={{ p: 3, mt: 3 }}>
          <Box mb={2}>
            <Typography variant="h6">Driver ID:</Typography>
            <Typography>{driverInfo.driverId}</Typography>
          </Box>
          <Box mb={2}>
            <Typography variant="h6">Auto:</Typography>
            <Typography>{driverInfo.vehicleName}</Typography>
          </Box>
          <Box mb={2}>
            <Typography variant="h6">Auto ID:</Typography>
            <Typography>{driverInfo.vehicleId}</Typography>
          </Box>
          <Box mb={2}>
            <Typography variant="h6">License Plate:</Typography>
            <Typography>{driverInfo.licensePlate}</Typography>
          </Box>
          <Box>
            <Typography variant="h6">Vehicle Check:</Typography>
            <Typography color={driverInfo.vehicleCheckDone ? 'green' : 'red'}>
              {driverInfo.vehicleCheckDone ? '✅ Done' : '❌ Pending'}
            </Typography>
          </Box>
        </Paper>
      )}
    </Container>
  );
}

export default DriverInfo;
