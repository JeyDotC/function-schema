import is from "is";
import { TypeCheck } from "./typeCheck.js";

function guessTypeName(Type){
  if (Type === null) {
    return 'null';
  }

  if (Type === undefined) {
    return 'undefined';
  }

  const name = Type.name;
  if(name !== undefined){
    return name;
  }

  if (typeof Type === 'string') {
    return `'${Type}'`;
  }
  
  return Type;
}

const InstanceOfStringCheck = new TypeCheck(
  'string',
  ({ value }) => typeof value === 'string'
);

const InstanceOfNumberCheck = new TypeCheck(
  'number',
  ({ value }) => is.number(value)
);

const InstanceOfBooleanCheck = new TypeCheck(
  'boolean',
  ({ value }) => is.boolean(value)
);

export const Int = new TypeCheck(
  'int',
  ({ value }) => is.integer(value)
);

export const Any = new TypeCheck("any", () => true);

export const Void = Any;
Void.name = 'void';

function EqualityCheck(valueToCompare) {
  let name = valueToCompare;
  if (valueToCompare === null) {
    name = 'null'
  }
  if (typeof valueToCompare === 'string') {
    name = `'${valueToCompare}'`;
  }
  return new TypeCheck(
    `${name}`,
    ({ value }) => value === valueToCompare
  );
}

function InstanceOf(Type) {
  return new TypeCheck(
    guessTypeName(Type),
    ({ value }) => value instanceof Type
  );
}


export function Optional(Type) {
  return new TypeCheck(
    `Optional<${guessTypeName(Type)}>`,
    (entry) => (entry.value === undefined || entry.value === null || typeCheckFactory(Type).isValid(entry))
  );
}

export function OneOf(...types) {
  const expectedTypeName = `OneOf<${types.map(guessTypeName).join(', ')}>`;
  return new TypeCheck(
    expectedTypeName,
    (entry) => types.some((T) => typeCheckFactory(T).isValid(entry).isValid)
  );
}

export function PromiseOf(Type) {
  return new TypeCheck(
    `Promise<${guessTypeName(Type)}>`,
    (entry) => {
      const isPromise = entry.value instanceof Promise;
      if (isPromise) {
        // Do a type check on the promise's returned value.
        entry.value.then((value) => {
          typeCheckFactory(Type).perform({
            ...entry,
            value
          });
          return value;
        });
      }
      return isPromise;
    });
}

// TODO: This is violating Liskov substitution principle!! I must create a TypeCheckSubclass for this.
export function Struct(objectSpec) {
  const entries = Object.entries(objectSpec).map(([prop, type]) => [prop, typeCheckFactory(type)]);
  const structure = entries.map(([prop, typeCheck]) => `${prop}: ${typeCheck.name}`).join(',\n');

  return new TypeCheck(
    `{\n${structure}\n}`,
    ({
      value,
      index,
      kind
    }) => {
      if (value === null || value === undefined) {
        return false;
      }
      const validationResults = entries.map(
        ([prop, typeCheck]) => {
          try {
            typeCheck.perform({
              value: value[prop],
              index,
              kind
            });
          } catch (e) {
            return `${prop}: ${e.message}`;
          }
          return undefined;
        }).filter(e => e !== undefined);

      const isValid = validationResults.length === 0;
      const receivedTypeName = `object with these errors: \n - ${validationResults.join(',\n - ')}\n`;

      return { isValid, receivedTypeName };
    }
  );
}

export function typeCheckFactory(spec) {
  if (spec instanceof TypeCheck) {
    return spec;
  }
  if (spec === String) {
    return InstanceOfStringCheck;
  }
  if (spec === Number) {
    return InstanceOfNumberCheck;
  }
  if (spec === Boolean) {
    return InstanceOfBooleanCheck;
  }
  if (typeof spec !== 'function') {
    return EqualityCheck(spec);
  }

  return InstanceOf(spec);
}