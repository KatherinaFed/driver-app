import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { usePassengerCheck } from '../../hooks/usePassengerCheck';

import { DefaultService, Passenger, Ride } from '../../api/generated';

vi.mock('../../api/generated', async () => {
  const actual = await import('../../api/generated');
  return {
    ...actual,
    DefaultService: {
      postCheckInPassenger: vi.fn(),
    },
  };
});


const mockRideData: Ride = {
  rideId: 'ride1',
  shiftId: 'shift123',
  rideStarted: false,
  pickupLocation: { address: 'Start' },
  dropoffLocation: { address: 'End' },
  passengers: [
    { id: 'p1', name: 'Alice', status: Passenger.status.PENDING },
    { id: 'p2', name: 'Bob', status: Passenger.status.PENDING },
  ],
};

describe('usePassengerCheck', () => {
  const mockOnError = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should update passenger status to checked-in', async () => {
    vi.mocked(DefaultService.postCheckInPassenger).mockResolvedValue({});

    const { result } = renderHook(() =>
      usePassengerCheck(mockRideData, mockOnError)
    );

    await act(async () => {
      await result.current.handlePassengerCheck(
        'p1',
        Passenger.status.CHECKED_IN
      );
    });

    const updatedPassenger = result.current.rideInfo.passengers?.find(
      (p) => p.id === 'p1'
    );
    expect(updatedPassenger?.status).toBe('checked-in');
    expect(DefaultService.postCheckInPassenger).toHaveBeenCalledWith({
      passengerId: 'p1',
      action: 'check-in',
    });
  });

  it('should call onError on failure', async () => {
    vi.mocked(DefaultService.postCheckInPassenger).mockRejectedValue({
      response: { data: { message: 'Failed to check-in' } },
    });

    const { result } = renderHook(() =>
      usePassengerCheck(mockRideData, mockOnError)
    );

    await act(async () => {
      await result.current.handlePassengerCheck(
        'p1',
        Passenger.status.CHECKED_IN
      );
    });

    expect(mockOnError).toHaveBeenCalledWith('Failed to check-in');
  });
});
