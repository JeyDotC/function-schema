import is from "is";
import { TypeCheck, TypeCheckError } from "./typeCheck.js";

export const Any = new TypeCheck("any", () => true);

export const Void = Any;
Void.name = 'void';

export function Optional(Type) {
  return new TypeCheck(
    `Optional<${Type.name}>`,
    (entry) => (entry.value === undefined || entry.value === null || typeCheckFactory(Type).isValid(entry))
  );
}

export function OneOf(...types) {
  const expectedTypeName = `OneOf<${types.map(t => t.name).join(', ')}>`;
  return new TypeCheck(
    expectedTypeName,
    (entry) => types.some((T) => typeCheckFactory(T).isValid(entry))
  );
}

export function PromiseOf(Type) {
  return new TypeCheck(
    `Promise<${Type.name}>`,
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

export function InstanceOf(Type) {
  return new TypeCheck(
    Type.name,
    ({ value }) => value instanceof Type
  );
}

const InstanceOfStringCheck = new TypeCheck(
  'string',
  ({ value }) => is.string(value)
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
      if(value === null || value === undefined){
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

      if (validationResults.length === 0) {
        return true;
      }

      throw new TypeCheckError({
        kind, 
        index, 
        expectedTypeName: `{\n${structure}\n}`,  
        receivedTypeName: `object with these errors: \n - ${validationResults.join(',\n - ')}\n`
      })
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
  if(spec === Boolean){
    return InstanceOfBooleanCheck;
  }

  return InstanceOf(spec);
}