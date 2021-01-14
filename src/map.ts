import { ClassType } from './class-type';

export interface IMap<T = unknown> {
    property?: string;
    default?: T;
    nested?: 'object' | 'array';
    type?: ClassType<T>;
    optional?: boolean;
}
