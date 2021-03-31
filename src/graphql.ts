
/*
 * ------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */
export interface AutomobileInput {
    car_make?: string;
    car_model?: string;
    created?: string;
    email?: string;
    first_name?: string;
    last_name?: string;
    manufactured_date?: string;
    age_of_vehicle?: number;
    vin_number?: string;
}

export interface Automobile {
    id: number;
    car_make: string;
    car_model: string;
    created: string;
    email: string;
    first_name: string;
    last_name: string;
    manufactured_date: string;
    age_of_vehicle: number;
    vin_number: string;
}

export interface IQuery {
    automobiles(page?: number): Automobile[] | Promise<Automobile[]>;
    automobilesSearch(matchStr: string): Automobile[] | Promise<Automobile[]>;
}

export interface IMutation {
    update(id: number, automobileInput: AutomobileInput): Automobile | Promise<Automobile>;
    delete(id: number, automobileInput: AutomobileInput): Automobile | Promise<Automobile>;
}
