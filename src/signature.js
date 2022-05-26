const { typeCheckFactory, Void } = require('./typeChecks');
const { ValueKind } = require('./typeCheck');

function functionSignature(...parameterTypeSpecs) {
  const paramChecks = parameterTypeSpecs.map(typeCheckFactory);

  const setReturnCheck = (returnTypeSpec) => {
    const returnCheck = typeCheckFactory(returnTypeSpec || Void);

    const setImplementation = (functionImplementation) => {
      const checkedImplementation = (...params) => {
        // perform type checks.
        paramChecks.forEach((check, index) => check.perform({
          value: params[index],
          kind: ValueKind.Parameter,
          index,
        }));

        // Perform action.
        const result = functionImplementation(...params);

        // Perform return type checks.
        returnCheck.perform({
          value: result,
          kind: ValueKind.ReturnValue,
        });

        return result;
      }

      checkedImplementation.meta = {
        name: functionImplementation.name,
        signature: setImplementation,
      };

      checkedImplementation.toString = () => `${checkedImplementation.meta.name}${checkedImplementation.meta.signature}`;

      return checkedImplementation;
    }

    setImplementation.meta = {
      paramChecks,
      returnCheck,
    };
    setImplementation.toString = () => {
      const {
        paramChecks,
        returnCheck
      } = setImplementation.meta;
      return `(${paramChecks.map(c => c.name).join(', ')}): ${returnCheck.name}`;
    };

    return setImplementation;
  }

  return setReturnCheck;
}

module.exports = {
  signature: functionSignature,
}