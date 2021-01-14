import { exception } from 'console';
import { ClassType } from './class-type';
import { MakeItArray, MakeIt } from './make-it';
import { IMap } from './map';

export class Maker {
    private readonly _maps: Map<string, IMap> = new Map<string, IMap>();
    private _strict = false;

    set(key: string, map: IMap): void {
        this._maps.set(key, map);
    }

    get(key: string): IMap | undefined {
        return this._maps.get(key);
    }

    strict(): void {
        this._strict = true;
    }

    has(key: string): boolean {
        return this._maps.has(key);
    }

    make<T>(constructor: ClassType, pool: unknown, ...args: unknown[]): T {
        if (!constructor) {
            throw exception(`the 'constructor' parameter is required.`);
        }
        if (constructor instanceof Array) {
            throw exception(
                `the 'constructor' parameter should not be 'Array' type. please set 'constructor' to type of array items.`,
            );
        }
        if (constructor === String || constructor === Number || constructor === Boolean) {
            return <T>pool;
        }
        const made: T = <T>new constructor(...args);
        if (typeof pool !== 'object') {
            return made;
        }
        const keys: string[] = [];
        keys.push(...this._maps.keys());
        if (pool && !this._strict) {
            keys.push(...Object.keys(pool).filter((k) => !keys.includes(k)));
        }
        keys.forEach((key) => {
            const map = this._maps.get(key);
            const property = map?.property ? map.property : key;
            let value = pool ? pool[property] : undefined;
            switch (map?.nested) {
                case 'array': {
                    if (Array.isArray(value) && map?.type) {
                        value = MakeItArray(map.type, value);
                    }
                    break;
                }
                case 'object': {
                    if (typeof value === 'object' && map?.type) {
                        value = MakeIt(map.type, value);
                    }
                    break;
                }
            }
            if (map?.default && !value) {
                value = map.default;
            }
            if (value === undefined && map?.optional === true) {
                return;
            }
            made[key] = value;
        });

        return made;
    }

    makeArray<T>(constructor: ClassType, pool: unknown, ...args: unknown[]): T[] {
        if (Array.isArray(pool)) {
            if (constructor === String || constructor === Number || constructor === Boolean) {
                return pool;
            }
            return pool.map((p) => {
                return <T>this.make(constructor, p, ...args);
            });
        } else {
            throw exception(`the 'pool' data does not match to array signature.`);
        }
    }
}
