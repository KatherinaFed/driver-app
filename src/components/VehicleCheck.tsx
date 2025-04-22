import {
  Alert,
  Box,
  Button,
  Checkbox,
  Divider,
  FormControlLabel,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import { postVehicleCheck } from '../services/api';

type VehicleCheckList = {
  carOk: boolean;
  licenseOk: boolean;
  lightsWorking: boolean;
  brakesWorking: boolean;
};

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
      await postVehicleCheck(checkList);
      onSuccess();
      setError('');
    } catch (err: any) {
      setError(
        err.response?.data?.message || 'Failed to submit vehicle checklist'
      );
    }
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
    >
      <Paper
        elevation={3}
        sx={{
          mt: 2,
          p: 4,
          borderRadius: 3,
          backgroundColor: '#fdfdf3',
        }}
      >
        <Typography variant="h6">✔️ Pre-trip Vehicle Checklist</Typography>
        <Divider sx={{ mb: 2 }} />

        <Stack>
          {Object.entries(checkList).map(([key, value]) => (
            <FormControlLabel
              key={key}
              label={labelNames[key as keyof VehicleCheckList]}
              control={
                <Checkbox
                  checked={value}
                  onChange={() =>
                    handleChangeItem(key as keyof VehicleCheckList)
                  }
                />
              }
            />
          ))}
        </Stack>

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
    </Box>
  );
}

export default VehicleCheck;
