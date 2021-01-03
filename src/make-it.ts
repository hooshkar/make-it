/* eslint-disable prefer-rest-params */
/* eslint-disable @typescript-eslint/no-explicit-any */
import 'reflect-metadata';
import { Maker } from './maker';
import { IMap } from './map';
import { ClassType } from './class-type';
import { ArgumentsCounter } from './arguments-counter';

export const MakeItKey = 'MAKE-IT';

export function mapping(map: IMap) {
    return (target: unknown, key: string | symbol): void => {
        if (ArgumentsCounter(arguments) > 2) {
            throw new Error(`Decorator '${MakeItKey}' is for properties only.`);
        }
        const constructor = (target as any).constructor;
        let maker: Maker | undefined = Reflect.getMetadata(MakeItKey, constructor);
        if (maker === undefined) maker = new Maker();
        if (maker.has(key)) {
            throw new Error(`Decorator '${MakeItKey}' can only be applied once to '${key.toString}'`);
        } else {
            maker.set(key, map);
            Reflect.defineMetadata(MakeItKey, maker, constructor);
        }
    };
}

export function makeIt<T>(constructor?: ClassType<T>, pool?: unknown): T {
    let maker: Maker | undefined = pool ? Reflect.getMetadata(MakeItKey, (pool as any).constructor) : undefined;
    if (maker === undefined) maker = new Maker();
    return maker.make(constructor, pool);
}
