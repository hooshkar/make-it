/* eslint-disable @typescript-eslint/no-explicit-any */
import { ClassType } from './class-type';

export interface IMap<T = any> {
    property?: string | symbol;
    type?: ClassType<T>;
    default?: T;
    nested?: boolean;
    undefined?: boolean;
}
