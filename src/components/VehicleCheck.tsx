import {
  Alert,
  Box,
  Button,
  Checkbox,
  Divider,
  FormControlLabel,
  Paper,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { VehicleCheckList } from '../shared/types';
import { DefaultService } from '../api/generated';

interface VehicleProps {
  onSuccess: () => void;
}

function VehicleCheck({ onSuccess }: VehicleProps) {
  const [checkList, setCheckList] = useState<VehicleCheckList>({
    carOk: false,
    licenseOk: false,
    lightsWorking: false,
    brakesWorking: false,
  });
  const [error, setError] = useState<string>('');

  const labelNames = {
    carOk: 'Vehicle is OK',
    licenseOk: 'Driver license is valid',
    lightsWorking: 'All lights are working',
    brakesWorking: 'Brakes are working',
  };

  // Check list
  const handleChangeItem = (key: keyof VehicleCheckList) => {
    setCheckList((prevKeys) => ({ ...prevKeys, [key]: !prevKeys[key] }));
  };

  // POST vehicle checklist
  const handleSubmit = async () => {
    try {
      await DefaultService.postVehicleCheck(checkList);
      onSuccess();
      setError('');
    } catch (err: any) {
      setError(
        err.response?.data?.message || 'Failed to submit vehicle checklist'
      );
    }
  };

  useEffect(() => {
    if (Object.values(checkList).every((item) => item)) {
      setError('');
    }
  }, [checkList]);

  return (
    <Paper
      elevation={3}
      sx={{
        width: '100%',
        maxWidth: { xs: '80%', md: '500px' },
        mt: 2,
        p: { xs: 2, md: 3 },
        borderRadius: 3,
      }}
    >
      <Box display="flex" flexDirection="column" alignItems="center">
        <Typography variant="h6">✔️ Pre-trip Vehicle Checklist</Typography>
      </Box>
      <Divider sx={{ mb: 2 }} />

      <Box display="flex" flexDirection="column">
        {Object.entries(checkList).map(([key, value]) => (
          <FormControlLabel
            key={key}
            label={labelNames[key as keyof VehicleCheckList]}
            control={
              <Checkbox
                checked={value}
                onChange={() => handleChangeItem(key as keyof VehicleCheckList)}
              />
            }
          />
        ))}
      </Box>

      <Box mt={2}>
        <Button
          fullWidth
          variant="contained"
          color="success"
          onClick={handleSubmit}
        >
          Submit Checklist
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}
    </Paper>
  );
}

export default VehicleCheck;
