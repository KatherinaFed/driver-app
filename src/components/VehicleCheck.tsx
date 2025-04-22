import {
  Alert,
  Box,
  Button,
  Checkbox,
  FormControlLabel,
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

  const allChecked = Object.values(checkList).every(
    (item: boolean) => item === true
  );

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
    <Box m={2}>
      <Typography variant="h6" color="black">
        Pre-trip Vehicle Checklist
      </Typography>

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

      <Box p={2}>
        <Button
          variant="outlined"
          disabled={!allChecked}
          onClick={handleSubmit}
        >
          Submit Checklist
        </Button>
        {!allChecked && (
          <Typography color="error" sx={{ mt: 2 }}>
            Please, check all items to continue
          </Typography>
        )}
      </Box>

      {error && <Alert severity="error">{error}</Alert>}
    </Box>
  );
}

export default VehicleCheck;
