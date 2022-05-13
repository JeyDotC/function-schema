/**
 * @enum
 */
export const ValueKind = {
  Parameter: 0,
  ReturnValue: 1,
}

export class TypeCheckError extends Error {
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

export class TypeCheck {
  constructor(name, implementation) {
    this.implementation = implementation;
    this.name = name;
  }

  /**
   * 
   * @param {ValidationParam} value
   * @returns {boolean}
   */
  isValid(value){
    return this.implementation(value);
  }
  
  /**
   * @param {ValidationParam} value 
   */
  perform(value) {
    const isValid = this.isValid(value);
    if(!isValid){
      throw new TypeCheckError({
        kind: value.kind,
        index: value.index,
        expectedTypeName: this.name,
        receivedTypeName: typeof value.value,
      })
    }
  }
}