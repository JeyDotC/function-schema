import { TypeCheck } from "./typeCheck";

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
  static toString(): string,
}

export declare interface SetImplementation {
  (implementation: Function): CheckedImplementation,
  meta: TypeChecksMeta,
  static toString(): string,
}

export declare interface SetReturnTypeCheck {
  (returnTypeCheck: TypeCheckSpec): SetImplementation,
}

export declare function signature(...params: TypeCheckSpec[]): SetReturnTypeCheck;