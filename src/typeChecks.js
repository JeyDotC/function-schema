const { TypeCheck } = require("./typeCheck");

const InstanceOfStringCheck = new TypeCheck(
  'string',
  ({ value }) => typeof value === 'string'
);

const InstanceOfNumberCheck = new TypeCheck(
  'number',
  ({ value }) => Number.isFinite(value)
);

const InstanceOfBooleanCheck = new TypeCheck(
  'boolean',
  ({ value }) => value === true || value === false || toString.call(value) === '[object Boolean]'
);

const Int = new TypeCheck(
  'int',
  ({ value }) => Number.isInteger(value)
);

const Any = new TypeCheck("any", () => true);

const Void =  new TypeCheck("void", () => true);

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
    Type?.name || typeof Type,
    ({ value }) => value instanceof Type
  );
}


function Optional(Type) {
  const innerTypeCheck = typeCheckFactory(Type);
  return new TypeCheck(
    `Optional<${innerTypeCheck.name}>`,
    (entry) => (entry.value === undefined || entry.value === null || innerTypeCheck.isValid(entry))
  );
}

function OneOf(...types) {
  const innerTypeChecks = types.map(typeCheckFactory);
  const expectedTypeName = `OneOf<${innerTypeChecks.map(t => t.name).join(', ')}>`;
  return new TypeCheck(
    expectedTypeName,
    (entry) => innerTypeChecks.some((check) => check.isValid(entry).isValid)
  );
}

function PromiseOf(Type) {
  const innerTypeCheck = typeCheckFactory(Type);
  return new TypeCheck(
    `Promise<${innerTypeCheck.name}>`,
    (entry) => {
      const isPromise = entry.value instanceof Promise;
      if (isPromise) {
        // Do a type check on the promise's returned value.
        entry.value.then((value) => {
          innerTypeCheck.perform({
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
function Struct(objectSpec) {
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

function typeCheckFactory(spec) {
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

module.exports = {
  Int,
  Any,
  Void,
  Optional,
  OneOf,
  PromiseOf,
  Struct,
  typeCheckFactory,
};