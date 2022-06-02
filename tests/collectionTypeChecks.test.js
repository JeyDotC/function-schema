const { Optional } = require("../src");
const { ArrayOf, Tuple } = require("../src/collectionTypeChecks");

describe(`${ArrayOf.name}`, () => {
  it.each([
    { Type: String, value: [], expectedResult: true, },
    { Type: String, value: ['b'], expectedResult: true, },
    { Type: String, value: ['a', 'z'], expectedResult: true, },

    { Type: String, value: null, expectedResult: false, },
    { Type: String, value: undefined, expectedResult: false, },
    { Type: String, value: [100], expectedResult: false, },
    { Type: String, value: ['a', 100, 'c'], expectedResult: false, },
    { Type: String, value: '', expectedResult: false, },
    { Type: String, value: 100, expectedResult: false, },
    { Type: String, value: {}, expectedResult: false, },
    { Type: String, value: '1', expectedResult: false, },
  ])('Should accept arrays of the given type', ({Type, value, expectedResult}) => {
    // Act
    const { isValid } = ArrayOf(Type).isValid({ value });

    // Assert
    expect(isValid).toBe(expectedResult);
  });
});

describe(`${Tuple.name}`, () => {
  it.each([
    { Types: [String, Number], value: ['a', 1], expectedResult: true, },
    { Types: [String, Number], value: ['b', 2, 'Ignored value'], expectedResult: true, },
    { Types: [String, Optional(Number)], value: ['a', 1], expectedResult: true, },
    { Types: [String, Optional(Number)], value: ['a'], expectedResult: true, },

    { Types: [String, Number], value: null, expectedResult: false, },
    { Types: [String, Number], value: undefined, expectedResult: false, },
    { Types: [String, Number], value: [100], expectedResult: false, },
    { Types: [String, Number], value: [100, 'a'], expectedResult: false, },
    { Types: [String, Optional(Number)], value: ['a', 'b'], expectedResult: false, },
    { Types: [String, Number], value: '', expectedResult: false, },
    { Types: [String, Number], value: 100, expectedResult: false, },
    { Types: [String, Number], value: {}, expectedResult: false, },
    { Types: [String, Number], value: '1', expectedResult: false, },
  ])('Should accept tuples with the given structure', ({Types, value, expectedResult}) => {
    // Act
    const { isValid } = Tuple(...Types).isValid({ value });

    // Assert
    expect(isValid).toBe(expectedResult);
  });
});

