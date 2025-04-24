import { renderHook, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useDriver } from '../../hooks/useDriver';
import { DefaultService } from '../../api/generated';

vi.mock('../../api/generated', () => ({
  DefaultService: {
    getDriverShift: vi.fn(),
  },
}));

const mockDriverData = {
  driverId: '123',
  licensePlate: 'TEST 123',
  vehicleId: 'v001',
  vehicleName: 'Test Car',
  vehicleCheckDone: true,
};

describe('useDriver', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should fetch and return driver info', async () => {
    vi.mocked(DefaultService.getDriverShift).mockResolvedValue(mockDriverData);

    const { result } = renderHook(() => useDriver('123'));
    
    await waitFor(() => {
      console.log(result)
      expect(result.current.driverInfo).toEqual(mockDriverData);
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBe('');
    });

    expect(DefaultService.getDriverShift).toHaveBeenCalledWith('123');
  });

  it('should handle error while fetching driver info', async () => {
    vi.mocked(DefaultService.getDriverShift).mockRejectedValue({
      response: { data: { message: 'Driver not found' } },
    });

    const { result } = renderHook(() => useDriver('999'));

    await waitFor(() => {
      expect(result.current.driverInfo).toBe(null);
      expect(result.current.error).toBe('Driver not found');
      expect(result.current.loading).toBe(false);
    });
  });
});
