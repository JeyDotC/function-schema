import { typeCheckFactory, Void } from './typeChecks.js';
import { ValueKind } from './typeCheck.js';

function functionSignature(...typeSpecs) {
  const paramChecks = typeSpecs.map(typeCheckFactory);

  return (returnType) => {
    const returnCheck = typeCheckFactory(returnType || Void);

    const signature = (target) => {
      const func = (...params) => {
        // perform type checks.
        paramChecks.forEach((check, index) => check.perform({
          value: params[index],
          kind: ValueKind.Parameter,
          index,
        }));

        // Perform action.
        const result = target(...params);

        // Perform return type checks.
        returnCheck.perform({
          value: result,
          kind: ValueKind.ReturnValue,
        });

        return result;
      }

      func.meta = {
        name: target.name,
        signature,
      };

      func.toString = () => `${func.meta.name}${func.meta.signature}`;

      return func;
    }

    signature.meta = {
      paramChecks,
      returnCheck,
    };
    signature.toString = () => {
      const {
        paramChecks,
        returnCheck
      } = signature.meta;
      return `(${paramChecks.map(c => c.name).join(', ')}): ${returnCheck.name}`;
    };

    return signature;
  }
}

export { functionSignature as signature }