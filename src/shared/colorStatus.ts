import { Passenger } from "./types";

export const statusColorMap: Record<
  Passenger['status'],
  'success' | 'error' | 'default'
> = {
  'checked-in': 'success',
  rejected: 'error',
  pending: 'default',
};

export const statusLabelMap: Record<
  Passenger['status'],
  'Checked-in' | 'Rejected' | 'Waiting'
> = {
  'checked-in': 'Checked-in',
  rejected: 'Rejected',
  pending: 'Waiting',
};

export const statusColorLeftBorder: Record<
  Passenger['status'],
  '#2ecc71' | '#e74c3c' | '#bdc3c7'
> = {
  'checked-in': '#2ecc71',
  rejected: '#e74c3c',
  pending: '#bdc3c7',
};