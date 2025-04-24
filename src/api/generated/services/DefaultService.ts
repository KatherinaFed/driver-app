/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { DriverShift } from '../models/DriverShift';
import type { Ride } from '../models/Ride';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class DefaultService {
    /**
     * Get driver shift
     * @param driverId
     * @returns DriverShift Driver shift found
     * @throws ApiError
     */
    public static getDriverShift(
        driverId: string,
    ): CancelablePromise<DriverShift> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/driver-shift',
            query: {
                'driverId': driverId,
            },
            errors: {
                404: `No shift found`,
            },
        });
    }
    /**
     * Submit vehicle check
     * @param requestBody
     * @returns any Vehicle check completed
     * @throws ApiError
     */
    public static postVehicleCheck(
        requestBody: {
            carOk: boolean;
            licenseOk: boolean;
            lightsWorking: boolean;
            brakesWorking: boolean;
        },
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/vehicle-check',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Vehicle check failed`,
            },
        });
    }
    /**
     * Get assigned ride
     * @returns Ride Ride assigned
     * @throws ApiError
     */
    public static getRideRequest(): CancelablePromise<Ride> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/ride-request',
            errors: {
                404: `No ride assigned yet`,
            },
        });
    }
    /**
     * Check in or reject a passenger
     * @param requestBody
     * @returns any Passenger updated
     * @throws ApiError
     */
    public static postCheckInPassenger(
        requestBody: {
            passengerId: string;
            action: 'check-in' | 'reject';
        },
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/check-in-passenger',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                404: `Passenger or ride not found`,
            },
        });
    }
    /**
     * Start the ride
     * @returns any Ride started
     * @throws ApiError
     */
    public static postStartRide(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/start-ride',
            errors: {
                400: `Not all passengers handled`,
                404: `Ride not found`,
            },
        });
    }
}
