import { renderHook } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import useRidePolling from '../usePolling';
import { DefaultService, Ride } from '../../api/generated';

vi.mock('../../api/generated', async () => {
  const actual = await import('../../api/generated');
  return {
    ...actual,
    DefaultService: {
      getRideRequest: vi.fn(),
    },
  };
});

describe('useRidePolling', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  const mockRide: Ride = {
    rideId: 'ride_001',
    shiftId: 'shift_001',
    rideStarted: false,
    pickupLocation: { address: 'Start' },
    dropoffLocation: { address: 'End' },
    passengers: [],
  };

  it('should be called when ride is assigned', async () => {
    vi.mocked(DefaultService.getRideRequest).mockResolvedValue(mockRide);

    const onSuccess = vi.fn();
    const onError = vi.fn();

    renderHook(() =>
      useRidePolling({
        started: true,
        onSuccess,
        onError,
      })
    );

    await vi.advanceTimersByTimeAsync(1000);

    expect(DefaultService.getRideRequest).toHaveBeenCalled();
    expect(onSuccess).toHaveBeenCalledWith(mockRide);
    expect(onError).not.toHaveBeenCalled();
  });

  it('should be called when API fails (not 404)', async () => {
    vi.mocked(DefaultService.getRideRequest).mockRejectedValue({
      response: { status: 500 },
    });

    const onSuccess = vi.fn();
    const onError = vi.fn();

    renderHook(() =>
      useRidePolling({
        started: true,
        onSuccess,
        onError,
      })
    );

    await vi.advanceTimersByTimeAsync(1000);

    expect(onSuccess).not.toHaveBeenCalled();
    expect(onError).toHaveBeenCalledWith('Failed to check ride assignment');
  });

  it('should be called after timeout if no ride is found', async () => {
    vi.mocked(DefaultService.getRideRequest).mockRejectedValue({
      response: { status: 404 },
    });
  
    const onSuccess = vi.fn();
    const onError = vi.fn();
  
    renderHook(() =>
      useRidePolling({
        started: true,
        onSuccess,
        onError,
      })
    );
  
    await vi.runAllTimersAsync();
  
    expect(onSuccess).not.toHaveBeenCalled();
    expect(onError).toHaveBeenCalledWith('No rides, please, try again');
  });
});
