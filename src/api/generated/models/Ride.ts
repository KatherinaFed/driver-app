/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Location } from './Location';
import type { Passenger } from './Passenger';
export type Ride = {
    rideId?: string;
    shiftId?: string;
    pickupLocation?: Location;
    dropoffLocation?: Location;
    rideStarted?: boolean;
    rideStartTime?: string;
    rideEndTime?: string;
    passengers?: Array<Passenger>;
};