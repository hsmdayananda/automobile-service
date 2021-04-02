
/*
 * ------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */
export interface AutomobileInput {
    carMake?: string;
    carModel?: string;
    created?: string;
    email?: string;
    firstName?: string;
    lastName?: string;
    manufactured_date?: string;
    ageOfVehicle?: number;
    vinNumber?: string;
}

export interface Automobile {
    id: number;
    car_make: string;
    car_model: string;
    created: string;
    email: string;
    firstName: string;
    lastName: string;
    manufacturedDate: string;
    ageOfVehicle: number;
    vinNumber: string;
}

export interface IQuery {
    automobiles(page?: number): Automobile[] | Promise<Automobile[]>;
    automobilesSearch(matchStr: string): Automobile[] | Promise<Automobile[]>;
}

export interface IMutation {
    update(id: number, automobileInput: AutomobileInput): Automobile | Promise<Automobile>;
    delete(id: number, automobileInput: AutomobileInput): Automobile | Promise<Automobile>;
}
