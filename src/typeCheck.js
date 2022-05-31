/**
 * @enum
 */
const ValueKind = Object.freeze({
  Parameter: 0,
  ReturnValue: 1,
});

class TypeCheckError extends Error {
  constructor({
    kind,
    index,
    expectedTypeName,
    receivedTypeName
  }) {
    super(`${kind === ValueKind.Parameter ? `Parameter ${index}` : 'Return value'} must be an instance of ${expectedTypeName}, received ${receivedTypeName} instead`);
  }
}

/**
 * @typedef {Object} ValidationParam
 * @property {ValueKind} kind
 * @property {number} index
 * @property {*} value
 */

/**
 * @typedef {Object} ValidationResult
 * @property {boolean} isValid
 * @property {string?} receivedTypeName
 */

/**
 * @callback TypeCheckImplementation
 * @param {ValidationParam} entry
 * @returns {boolean|ValidationResult}
 */

class TypeCheck {
  /**
   * 
   * @param {string} name 
   * @param {TypeCheckImplementation} implementation 
   */
  constructor(name, implementation) {
    this.implementation = implementation;
    this.name = name;
    Object.freeze(this);
  }

  /**
   * 
   * @param {ValidationParam} value
   * @returns {ValidationResult}
   */
  isValid(value) {
    const result = this.implementation(value);
    if (typeof result === "boolean") {
      return { isValid: result };
    }

    return result;
  }

  /**
   * @param {ValidationParam} value 
   */
  perform(value) {
    const { isValid, receivedTypeName } = this.isValid(value);
    if (!isValid) {
      throw new TypeCheckError({
        kind: value.kind,
        index: value.index,
        expectedTypeName: this.name,
        receivedTypeName: receivedTypeName || typeof value.value,
      })
    }
  }
}

module.exports = {
  ValueKind,
  TypeCheckError,
  TypeCheck,
}