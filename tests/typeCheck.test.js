const { TypeCheck, ValueKind } = require("../src/typeCheck");

describe(`${TypeCheck.name}.isValid`, () => {
  it.each([
    { implementation: () => true, expectedResult: true },
    { implementation: () => false, expectedResult: false },
  ])('Should return true/false depending on implementation', ({implementation, expectedResult}) => {
    // Arrange
    const typeCheck = new TypeCheck('boolean', implementation);

    // Act
    const { isValid } = typeCheck.isValid({});

    // Assert
    expect(isValid).toBe(expectedResult);
  });
});

describe(`${TypeCheck.name}.perform`, () => {
  it('Should succeed when valid', () => {
    // Arrange
    const implementation = jest.fn().mockReturnValue(true);
    const typeCheck = new TypeCheck('boolean', implementation);

    // Act
    typeCheck.perform({});

    // Assert
    expect(implementation).toBeCalled();
  });

  it.each([
    { kind: ValueKind.Parameter, expectedMessage: 'Parameter 0 must be an instance of boolean' },
    { kind: ValueKind.ReturnValue, expectedMessage: 'Return value must be an instance of boolean' },
  ])('Should throw when is not valid', ({kind, expectedMessage}) => {
    // Arrange
    const implementation = () => false;
    const typeCheck = new TypeCheck('boolean', implementation);

    // Act
    const act = () => typeCheck.perform({
      kind,
      index: 0,
      value: 0
    });

    // Assert
    expect(act).toThrow(expectedMessage);
  });
});

describe(`${TypeCheck.name}`, () => {
  it.each(['name', 'implementation'])('Should be readonly', (property) => {
    'use strict';
    // Arrange
    const check = new TypeCheck('foo', () => true);

    // Act
    const act = () => check[property] = 'bar';

    // Assert
    expect(act).toThrow(`Cannot assign to read only property '${property}'`);
  });
})