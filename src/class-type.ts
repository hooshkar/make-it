/* eslint-disable @typescript-eslint/no-explicit-any */
export interface ClassType<T = unknown> {
    new (...args: any[]): T;
    readonly prototype: T;
}
