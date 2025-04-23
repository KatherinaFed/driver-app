import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { usePassengerCheck } from '../../hooks/usePassengerCheck';
import { RideT } from '../../shared/types';
import { DriverService } from '../../services/DriverService';

vi.mock('../../services/DriverService');

const mockRideData: RideT = {
  rideId: 'ride1',
  shiftId: 'shift123',
  rideStarted: false,
  pickupLocation: { address: 'Start' },
  dropoffLocation: { address: 'End' },
  passengers: [
    { id: 'p1', name: 'Alice', status: 'pending' },
    { id: 'p2', name: 'Bob', status: 'pending' },
  ],
};

describe('usePassengerCheck', () => {
  const mockOnError = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should update passenger status to checked-in', async () => {
    vi.mocked(DriverService.checkInPassenger).mockResolvedValue({});

    const { result } = renderHook(() =>
      usePassengerCheck(mockRideData, mockOnError)
    );

    await act(async () => {
      await result.current.handlePassengerCheck('p1', 'checked-in');
    });

    const updatedPassenger = result.current.rideInfo.passengers.find(p => p.id === 'p1');
    expect(updatedPassenger?.status).toBe('checked-in');
    expect(DriverService.checkInPassenger).toHaveBeenCalledWith(
      'shift123',
      'p1',
      'checked-in'
    );
  });

  it('should call onError on failure', async () => {
    vi.mocked(DriverService.checkInPassenger).mockRejectedValue({
      response: { data: { message: 'Failed to check-in' } },
    });

    const { result } = renderHook(() =>
      usePassengerCheck(mockRideData, mockOnError)
    );

    await act(async () => {
      await result.current.handlePassengerCheck('p1', 'checked-in');
    });

    expect(mockOnError).toHaveBeenCalledWith('Failed to check-in');
  });
});
