/* eslint-disable prefer-rest-params */
import { Maker } from './maker';
import { IMap } from './map';
import { ArgumentsCounter } from './arguments-counter';
import { exception } from 'console';
import { MakeItKey } from './make-it';
import { ClassType } from './class-type';

export function MakeItMap(map: IMap) {
    return (target: unknown, key: string): void => {
        if (ArgumentsCounter(arguments) > 2) {
            throw exception(`Decorator '${MakeItKey}' is for properties only.`);
        }
        const constructor = target.constructor;
        let maker: Maker = Reflect.getMetadata(MakeItKey, constructor);
        if (!maker) {
            maker = new Maker();
        }
        if (maker.has(key)) {
            throw exception(`Decorator '${MakeItKey}' can only be applied once to '${key.toString}'`);
        } else {
            maker.set(key, map);
            Reflect.defineMetadata(MakeItKey, maker, constructor);
        }
    };
}

export function MakeItStrict<T extends ClassType<unknown>>(constructor: T): T {
    let maker: Maker = Reflect.getMetadata(MakeItKey, constructor);
    if (!maker) {
        maker = new Maker();
    }
    maker.strict();
    Reflect.defineMetadata(MakeItKey, maker, constructor);
    return constructor;
}
