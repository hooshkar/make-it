import { ClassType } from "basecript";

export interface IMap<T = any> {
  property?: string | symbol;
  type?: ClassType<T>;
  default?: T;
  nested?: boolean;
  undefined?: boolean;
}
