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

export { TypeCheck, TypeCheckError, ValidationParam, ValidationResult, ValueKind, TypeCheckImplementation } from './src/typeCheck';

export { Any, Int, OneOf, Optional, PromiseOf, Struct, Void, typeCheckFactory } from "./src/typeChecks";