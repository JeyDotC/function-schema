
export type TypeCheckImplementation = (value: any) => boolean | ValidationResult;

export type ValidationResult = {
  isValid: boolean,
  receivedTypeName?: string,
}
export declare class TypeCheck<TargetType = any> {

  constructor(name: string, implementation: TypeCheckImplementation);

  isValid(value: any): ValidationResult;

  perform(value: any): void;
}

export declare type TypeCheckSpec<T> = TypeCheck<T> | Function | string | number | boolean | null | undefined;

export declare type TypeChecksMeta = {
  paramChecks: TypeCheck[],
  returnCheck: TypeCheck,
}

export declare type TypeCheckedFunctionMeta = {
  name: string,
  signature: SetReturnTypeCheck,
}

export declare interface TypeCheckedFunction {
  (...params: any): any,
  meta: TypeCheckedFunctionMeta,
  toString(): string,
}

export declare interface SetImplementation {
  (implementation: Function): TypeCheckedFunction,
  meta: TypeChecksMeta,
  toString(): string,
}

export declare interface SetReturnTypeCheck {
  (returnTypeCheck: TypeCheckSpec): SetImplementation,
}

export declare function signature(...params: TypeCheckSpec[]): SetReturnTypeCheck;

export declare function typeCheckFactory(spec: TypeCheckSpec): TypeCheck;

// Typechecks

export declare function OneOf(...typeSpecs: TypeCheckSpec[]): TypeCheck;

export declare function Optional<T>(spec: TypeCheckSpec<T>): TypeCheck<T>;

export declare function Struct(spec: Record<string, TypeCheckSpec>): TypeCheck<Record<string, any>>;

export declare function PromiseOf<T>(spec: TypeCheckSpec<T>): TypeCheck<Promise<T>>;

export declare function Matches(expression: RegExp): TypeCheck<string>;

export declare function Variadic<T>(spec: TypeCheckSpec<T>): TypeCheck<T[]>;

export declare function ArrayOf<T>(spec: TypeCheckSpec<T>): TypeCheck<T[]>;

export declare function Tuple(...spec: TypeCheckSpec[]): TypeCheck;

export { TypeCheckError, ValidationParam, ValidationResult, ValueKind } from './src/typeCheck';

export declare const Any: TypeCheck<any>;
export declare const Int: TypeCheck<number>;
export declare const Void: TypeCheck<any>;
export declare const Truthy: TypeCheck<any>;
export declare const Falsy: TypeCheck<false|0|-0|0n|''|null|undefined>;

export declare const Email: TypeCheck<string>;
export declare const Url: TypeCheck<string>;
export declare const BooleanString: TypeCheck<string>;
export declare const IntString: TypeCheck<string>;
export declare const NumericString: TypeCheck<string>;