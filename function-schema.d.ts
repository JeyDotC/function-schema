import { TypeCheck } from "./src/typeCheck";

export declare type TypeCheckSpec = TypeCheck | Function | string | number | boolean | null | undefined;

export declare type TypeChecksMeta = {
  paramChecks: TypeCheck[],
  returnCheck: TypeCheck,
}

export declare type TypeCheckedFunctionMeta = {
  name: string,
  signature: SetReturnTypeCheck,
}

export declare interface CheckedImplementation {
  (...params: any): any,
  meta: TypeCheckedFunctionMeta,
  toString(): string,
}

export declare interface SetImplementation {
  (implementation: Function): CheckedImplementation,
  meta: TypeChecksMeta,
  toString(): string,
}

export declare interface SetReturnTypeCheck {
  (returnTypeCheck: TypeCheckSpec): SetImplementation,
}

export declare function signature(...params: TypeCheckSpec[]): SetReturnTypeCheck;

export declare function typeCheckFactory(spec: TypeCheckSpec): TypeCheck;

export declare function OneOf(...typeSpecs: TypeCheckSpec[]): TypeCheck;

export declare function Optional(spec: TypeCheckSpec): TypeCheck;

export declare function Struct(spec: Record<string, TypeCheckSpec>): TypeCheck;

export declare function PromiseOf(spec: TypeCheckSpec): TypeCheck;

export declare function Matches(expression: RegExp): TypeCheck;

export { TypeCheck, TypeCheckError, ValidationParam, ValidationResult, ValueKind, TypeCheckImplementation } from './src/typeCheck';

export { Any, Int, Void, Truthy, Falsy } from "./src/typeChecks";

export { Email, Url, BooleanString, IntString, NumericString } from "./src/stringTypeChecks";