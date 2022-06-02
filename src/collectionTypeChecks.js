const { TypeCheck } = require('./typeCheck');
const { typeCheckFactory } = require('./typeChecks');

function ArrayOf(spec) {
  const check = typeCheckFactory(spec);
  return new TypeCheck(
    `${check.name}[]`,
    ({ value }) => {
      if (!Array.isArray(value)) {
        return false;
      }

      let firstInvalidIndex = 0;
      let firstInvalidType = '';

      const hasInvalidElement = value.some((v, index) => {
        const { isValid, receivedTypeName } = check.isValid({ value: v });
        firstInvalidIndex = index;
        firstInvalidType = receivedTypeName;

        return !isValid;
      });

      return ({
        isValid: !hasInvalidElement,
        receivedTypeName: `[${firstInvalidIndex > 0 ? '..., ' : ''}${firstInvalidType}@${firstInvalidIndex}${firstInvalidIndex < value.length - 1 ? ', ...' : ''}]`
      })
    }
  )
}

function Tuple(...specs) {
  const checks = specs.map(typeCheckFactory)
  return new TypeCheck(
    `(${checks.map(c => c.name).join(', ')})`,
    ({ value }) => {
      if (!Array.isArray(value)) {
        return false;
      }

      const { invalidCount, validationResults } = checks.reduce(({ invalidCount, validationResults }, check, index) => {
        const { isValid, receivedTypeName } = check.isValid({
          value: value[index]
        });
        return ({
          invalidCount: invalidCount + (isValid ? 0 : 1),
          validationResults: [...validationResults, isValid ? check.name : receivedTypeName]
        })
      }, { invalidCount: 0, validationResults: [] });

      return ({
        isValid: invalidCount === 0,
        receivedTypeName: `(${validationResults.join(',')})`
      })
    });
}

module.exports = {
  Tuple,
  ArrayOf,
}