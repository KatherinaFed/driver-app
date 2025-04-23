import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useStartRide } from '../../hooks/useStartRide';
import { DriverService } from '../../services/DriverService';
import { AxiosResponse } from 'axios';

vi.mock('../../services/DriverService');

const mockNavigate = vi.fn();
vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}));

describe('useStartRide', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should navigate on successful ride start', async () => {
    vi.mocked(DriverService.startRide).mockResolvedValue({
      status: 200,
      data: { message: 'Ride started' },
      statusText: 'OK',
      headers: {},
      config: {},
    } as AxiosResponse);

    const { result } = renderHook(() => useStartRide());

    await act(async () => {
      await result.current.handleStartRide();
    });

    expect(DriverService.startRide).toHaveBeenCalled();
    expect(result.current.error).toBe('');
    expect(mockNavigate).toHaveBeenCalledWith('/start-ride');
  });

  it('should set error on failure', async () => {
    vi.mocked(DriverService.startRide).mockRejectedValue({
      response: { data: { message: 'Ride cannot be started' } },
    });

    const { result } = renderHook(() => useStartRide());

    await act(async () => {
      await result.current.handleStartRide();
    });

    expect(result.current.error).toBe('Ride cannot be started');
  });
});
