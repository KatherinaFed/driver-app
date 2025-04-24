/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type Passenger = {
    id?: string;
    name?: string;
    status?: Passenger.status;
};
export namespace Passenger {
    export enum status {
        PENDING = 'pending',
        CHECKED_IN = 'checked-in',
        REJECTED = 'rejected',
    }
}

