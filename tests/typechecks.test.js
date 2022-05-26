const { Any, Int, OneOf, Optional, PromiseOf, Struct, typeCheckFactory, Void } = require("../src/typeChecks");

const listOfAnyValues = [
  null,
  undefined,
  '',
  'Some Value',
  0,
  1,
  true,
  false,
  new Date(),
  {},
  [],
  [500]
];

describe(`${Any.name}`, () => {
  it.each(listOfAnyValues)('Should accept any value', (value) => {
    // Act
    const { isValid } = Any.isValid({
      value
    });
    // Assert
    expect(isValid).toBe(true);
  })
});

describe(`${Void.name} (Alias of Any)`, () => {
  it.each(listOfAnyValues)('Should accept any value', (value) => {
    // Act
    const { isValid } = Void.isValid({
      value
    });
    // Assert
    expect(isValid).toBe(true);
  })
});

describe(`${Optional.name}`, () => {
  it.each([
    { Type: String, value: '', expectedResult: true },
    { Type: String, value: null, expectedResult: true },
    { Type: String, value: undefined, expectedResult: true },
    { Type: String, value: 500, expectedResult: false },

    { Type: Number, value: 500, expectedResult: true },
    { Type: Number, value: null, expectedResult: true },
    { Type: Number, value: undefined, expectedResult: true },
    { Type: Number, value: '', expectedResult: false },

    { Type: Int, value: 500, expectedResult: true },
    { Type: Int, value: null, expectedResult: true },
    { Type: Int, value: undefined, expectedResult: true },
    { Type: Int, value: 12.6, expectedResult: false },

    { Type: Boolean, value: true, expectedResult: true },
    { Type: Boolean, value: false, expectedResult: true },
    { Type: Boolean, value: null, expectedResult: true },
    { Type: Boolean, value: undefined, expectedResult: true },
    { Type: Boolean, value: 0, expectedResult: false },
    { Type: Boolean, value: 1, expectedResult: false },
    { Type: Boolean, value: '', expectedResult: false },
  ])('Should accept a value of the given type, or null, or undefined', ({ Type, value, expectedResult }) => {
    // Arrange
    const OptionalOf = Optional(Type);

    // Act
    const { isValid } = OptionalOf.isValid({
      value
    });

    // Assert
    expect(isValid).toBe(expectedResult);
  });
});

describe('Equality Check', () => {
  it.each([
    { valueCheck: '', value: '', expectedResult: true },
    { valueCheck: null, value: null, expectedResult: true },
    { valueCheck: undefined, value: undefined, expectedResult: true },
    { valueCheck: 500, value: 500, expectedResult: true },
    { valueCheck: 'a', value: 'b', expectedResult: false },
    { valueCheck: 'a', value: null, expectedResult: false },
    { valueCheck: 'a', value: undefined, expectedResult: false },
    { valueCheck: null, value: 'a', expectedResult: false },
    { valueCheck: undefined, value: 'a', expectedResult: false },
    { valueCheck: 500, value: '500', expectedResult: false },
    { valueCheck: OneOf('a', 'b'), value: 'a', expectedResult: true },
    { valueCheck: OneOf('a', 'b'), value: 'b', expectedResult: true },
    { valueCheck: OneOf('a', 'b'), value: 'c', expectedResult: false },
    { valueCheck: OneOf('a', 'b', null), value: null, expectedResult: true },
    { valueCheck: OneOf(5, undefined), value: null, expectedResult: false },
  ])('Should check if value is equals when provided with a value-check', ({ valueCheck, value, expectedResult }) => {
    // Arrange
    const Check = typeCheckFactory(valueCheck);

    // Act
    const { isValid } = Check.isValid({
      value
    });

    // Assert
    expect(isValid).toBe(expectedResult);
    //console.log(Check.name, value)
  });
});

describe('Instance Of Check', () => {
  it.each([
    { Type: Array, value: [], expectedResult: true },
    { Type: Date, value: new Date(), expectedResult: true },

    { Type: Array, value: new Date(), expectedResult: false },
    { Type: Date, value: [], expectedResult: false },
  ])('Should check with typeof when check is not a primitive or an instance of TypeCheck', ({ Type, value, expectedResult }) => {
    // Arrange
    const Check = typeCheckFactory(Type);

    // Act
    const { isValid } = Check.isValid({
      value
    });

    // Assert
    expect(isValid).toBe(expectedResult);
  });
});

describe(`${PromiseOf.name}`, () => {
  it.each([
    { Type: Array, implementation: () => new Promise((resolve) => resolve([])), expectedResult: true },
    { Type: String, implementation: () => new Promise((resolve) => resolve('Hello')), expectedResult: true },
    {
      Type: String, implementation: async () => {
        const result = await new Promise((resolve) => resolve('Hello'));
        return result;
      }, expectedResult: true
    },
    { Type: Array, implementation: () => [], expectedResult: false },
  ])('Should check if the value is a Promise', async ({ Type, implementation, expectedResult }) => {
    // Arrange
    const Check = typeCheckFactory(PromiseOf(Type));
    const value = implementation();

    // Act
    const { isValid } = Check.isValid({
      value
    });
    await value;

    // Assert
    expect(isValid).toBe(expectedResult);
  });
});

describe(`${Struct.name}`, () => {
  const PersonType = Struct({ 
    name: String, 
    age: Int, 
    status: OneOf('active', 'suspended'),  
    address: Optional(String),
  });
  it.each([
    { value: { name: "John", age: 15, status: 'active' }, expectedResult: true },
    { value: { name: "Jane", age: 12, status: 'suspended', address: '123 Street' }, expectedResult: true },
    { value: { name: "Joseph", age: 12, status: 'suspended', address: '123 Street', unknownProperty: 15 }, expectedResult: true },

    { value: { age: 12, status: 'suspended', address: '123 Street' }, expectedResult: false },
    { value: { name: "Jane", status: 'suspended', address: '123 Street' }, expectedResult: false },
    { value: { name: "Jane", age: 12, address: '123 Street' }, expectedResult: false },
    { value: { name: 500, age: 12, status: 'suspended', address: '123 Street' }, expectedResult: false },
    { value: { name: "Jane", age: '12', status: 'suspended', address: '123 Street' }, expectedResult: false },
    { value: { name: "Jane", age: 12, status: 'assigned', address: '123 Street' }, expectedResult: false },
    { value: { name: "Jane", age: 12, status: 'suspended', address: 500 }, expectedResult: false },
    { value: { name: "Jane", age: 12, status: 'suspended', address: 500 }, expectedResult: false },
    { value: null, expectedResult: false },
    { value: undefined, expectedResult: false },
  ])('Should accept entries which structure complies with the given struct.', ({value, expectedResult}) => {
    // Act
    const { isValid } = PersonType.isValid({
      value
    });

    // Assert
    expect(isValid).toBe(expectedResult);
  })
});