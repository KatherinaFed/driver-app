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

function VehicleCheck() {
  const [checkList, setCheckList] = useState<VehicleCheckList>({
    carOk: false,
    licenseOk: false,
    lightsWorking: false,
    brakesWorking: false,
  });

  const [error, setError] = useState<string>('');

  const allChecked = Object.values(checkList).every((item) => item === true);

  const handleChangeItem = (key: keyof VehicleCheckList) => {
    setCheckList((prevKeys) => ({ ...prevKeys, [key]: !prevKeys[key] }));
  };

  const handleSubmit = async () => {
    try {
      await postVehicleCheck(checkList);
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
          label={`${key}`}
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
          disabled={!allChecked || false}
          onClick={handleSubmit}
        >
          Submit Checklist
        </Button>
      </Box>

      {error && <Alert severity="error">{error}</Alert>}
    </Box>
  );
}

export default VehicleCheck;
