import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DefaultService } from '../api/generated';

export function useStartRide() {
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleStartRide = async () => {
    try {
      await DefaultService.postStartRide();

      navigate('/start-ride');
    } catch (err: any) {
      setError(err.message);
    }
  };

  return { handleStartRide, error, setError };
}
