import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useStartRide } from '../../hooks/useStartRide';
import { AxiosResponse } from 'axios';
import { DefaultService } from '../../api/generated';

vi.mock('../../api/generated', async () => {
  const actual = await import('../../api/generated');
  return {
    ...actual,
    DefaultService: {
      postStartRide: vi.fn(),
    },
  };
});

const mockNavigate = vi.fn();
vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}));

describe('useStartRide', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should navigate on successful ride start', async () => {
    vi.mocked(DefaultService.postStartRide).mockResolvedValue({});

    const { result } = renderHook(() => useStartRide());

    await act(async () => {
      await result.current.handleStartRide();
    });

    expect(DefaultService.postStartRide).toHaveBeenCalled();
    expect(result.current.error).toBe('');
    expect(mockNavigate).toHaveBeenCalledWith('/start-ride');
  });

  it('should set error on failure', async () => {
    const apiError = new Error('Not all passengers handled');
    vi.mocked(DefaultService.postStartRide).mockRejectedValue(apiError);
  
    const { result } = renderHook(() => useStartRide());
  
    await act(async () => {
      await result.current.handleStartRide();
    });
  
    expect(result.current.error).toBe('Not all passengers handled');
  });
  
});
