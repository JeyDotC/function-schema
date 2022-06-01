const { typeCheckFactory, Void } = require('./typeChecks');
const { ValueKind, TypeCheck } = require('./typeCheck');

function functionSignature(...parameterTypeSpecs) {
  const lastParameterCheck = parameterTypeSpecs[parameterTypeSpecs.length - 1];
  const variadicCheck = lastParameterCheck instanceof TypeCheck && lastParameterCheck.name.startsWith('...') ? lastParameterCheck : undefined;
  const paramChecks = (
      variadicCheck !== undefined ? parameterTypeSpecs.slice(0, -1) : parameterTypeSpecs
    ).map(typeCheckFactory);

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

        // Perform variadic check if applicable
        if(variadicCheck !== undefined && params.length > paramChecks.length){
          const index = Math.max(paramChecks.length - 1, 0);
          const variadicParams = params.slice(index);
          variadicCheck.perform({
            value: variadicParams,
            kind: ValueKind.Parameter,
            index,
          })
        }

        // Perform action.
        const result = functionImplementation(...params);

        // Perform return type checks.
        returnCheck.perform({
          value: result,
          kind: ValueKind.ReturnValue,
        });

        return result;
      }

      checkedImplementation.meta = Object.freeze({
        name: functionImplementation.name,
        signature: setImplementation,
      });

      checkedImplementation.toString = () => `${checkedImplementation.meta.name}${checkedImplementation.meta.signature}`;

      return checkedImplementation;
    }

    setImplementation.meta = Object.freeze({
      paramChecks: paramChecks.map(c => c.name),
      returnCheck: returnCheck.name,
    });
    setImplementation.toString = () => {
      const {
        paramChecks,
        returnCheck
      } = setImplementation.meta;
      return `(${paramChecks.join(', ')}): ${returnCheck}`;
    };

    return setImplementation;
  }

  return setReturnCheck;
}

module.exports = {
  signature: functionSignature,
}