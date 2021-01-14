import 'reflect-metadata';
import { Maker } from './maker';
import { ClassType } from './class-type';

export const MakeItKey = 'MAKE-IT';

export function MakeIt<T, P>(constructor: ClassType<T>, pool: P, ...args: unknown[]): T {
    let maker: Maker = Reflect.getMetadata(MakeItKey, constructor);
    if (!maker) {
        maker = new Maker();
    }
    return <T>maker.make(constructor, pool, ...args);
}

export function MakeItArray<T>(constructor: ClassType, pool: unknown, ...args: unknown[]): T[] {
    let maker: Maker = Reflect.getMetadata(MakeItKey, constructor);
    if (!maker) {
        maker = new Maker();
    }
    return maker.makeArray(constructor, pool, ...args);
}
