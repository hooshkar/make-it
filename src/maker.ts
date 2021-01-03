/* eslint-disable @typescript-eslint/no-explicit-any */
import { ClassType } from './class-type';
import { MakeItKey } from './make-it';
import { IMap } from './map';

export class Maker {
    private readonly _maps: Map<string | symbol, IMap> = new Map<string | symbol, IMap>();

    has(key: string | symbol): boolean {
        return this._maps.has(key);
    }

    set(key: string | symbol, map: IMap): void {
        this._maps.set(key, map);
    }

    get(key: string | symbol): IMap | undefined {
        return this._maps.get(key);
    }

    make<T>(constructor?: ClassType<T>, pool?: unknown): T {
        const made: T | any = constructor === null || constructor === undefined ? {} : new constructor();
        const keys: (string | symbol)[] = [];
        keys.push(...this._maps.keys());
        if (pool) keys.push(...Object.keys(pool).filter((k) => !keys.includes(k)));

        keys.forEach((key) => {
            const map = this._maps.get(key);
            const property = map && map.property ? map.property : key;
            let type: ClassType<any> = map && map.type ? map.type : Reflect.getMetadata('design:type', made, key);
            if (!type && pool) {
                type = Reflect.getMetadata('design:type', pool, key);
            }
            let value = pool ? pool[key] : undefined;
            if (!value && map && map.default) {
                value = map.default.prototype ? new map.default() : map.default;
            }
            if (value !== undefined || (map && map.undefined)) {
                made[property] = type && map && map.nested && value ? this.makeNested(type, value) : value;
            }
        });

        return made;
    }

    private makeNested<T>(constructor: ClassType<T>, pool?: any): T {
        let maker: Maker | undefined =
            pool && pool.constructor ? Reflect.getMetadata(MakeItKey, pool.constructor) : undefined;
        if (maker === undefined)
            maker = constructor ? Reflect.getMetadata(MakeItKey, (new constructor() as any).constructor) : undefined;
        if (maker === undefined) maker = new Maker();
        return maker.make(constructor, pool);
    }
}
