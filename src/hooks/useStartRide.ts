import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DriverService } from '../services/DriverService';

export function useStartRide() {
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleStartRide = async () => {
    try {
      const res = await DriverService.startRide();
      console.log(res)
      if (res.status === 200) {
        navigate('/start-ride');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Something went wrong...');
    }
  };

  return { handleStartRide, error, setError };
}
