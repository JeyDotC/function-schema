const { signature } = require("../src/signature");
const { Optional, PromiseOf, OneOf } = require("../src/typeChecks");

describe('signature', () => {
  it.each([
    { params: [], returnType: undefined, expectedSignature: '(): void' },
    { params: [String], returnType: undefined, expectedSignature: '(string): void' },
    { params: [String, Number], returnType: undefined, expectedSignature: '(string, number): void' },
    { params: [], returnType: String, expectedSignature: '(): string' },
    { params: [String], returnType: String, expectedSignature: '(string): string' },
    { params: [String, Number], returnType: String, expectedSignature: '(string, number): string' },
  ])('Should create a signature spec when provided params and return specs', ({ params, returnType, expectedSignature }) => {
    // Act
    const resultSignature = signature(...params)(returnType);

    // Assert
    expect(resultSignature.toString()).toBe(expectedSignature);
  });

  it.each([
    { params: [], returnType: undefined, expectedSignature: '(): void' },
    { params: [String], returnType: undefined, expectedSignature: '(string): void' },
    { params: [String, Number], returnType: undefined, expectedSignature: '(string, number): void' },
    { params: [], returnType: String, expectedSignature: '(): string' },
    { params: [String], returnType: String, expectedSignature: '(string): string' },
    { params: [String, Number], returnType: String, expectedSignature: '(string, number): string' },
  ])('Should create a checked type when provided params specs, return specs and an implementation', ({ params, returnType, expectedSignature }) => {
    // Act
    const resultSignature = signature(...params)(returnType)(() => { });

    // Assert
    expect(resultSignature.toString()).toBe(expectedSignature);
  });

  it.each([

    { params: [String], returnType: undefined, badParameters: [500], badReturn: undefined, expectedFailure: "Parameter 0 must be an instance of string, received number" },

    { params: [String, Number], returnType: undefined, badParameters: [500], badReturn: undefined, expectedFailure: "Parameter 0 must be an instance of string, received number" },

    { params: [String, Number], returnType: undefined, badParameters: ["Valid", "Invalid"], badReturn: undefined, expectedFailure: "Parameter 1 must be an instance of number, received string" },

    // Not enough parameters
    { params: [String, Number], returnType: undefined, badParameters: ["Valid"], badReturn: undefined, expectedFailure: "Parameter 1 must be an instance of number, received undefined" },

    { params: [], returnType: String, badParameters: [], badReturn: 500, expectedFailure: "Return value must be an instance of string, received number" },

    { params: [String], returnType: String, badParameters: ["Valid"], badReturn: 500, expectedFailure: "Return value must be an instance of string, received number" },

  ])('Should perform checks when checked implementation is invoked', ({ params, returnType, badParameters, badReturn, expectedFailure }) => {
    // Arrange
    const checkedFunction = signature(...params)(returnType)(() => badReturn);

    // Act
    const act = () => checkedFunction(...badParameters);

    // Assert
    expect(act).toThrow(expectedFailure);
  });

  it.each([

    { params: [String], returnType: undefined, invokeParameters: ["Valid"], invokeReturn: undefined },

    { params: [String, Number], returnType: undefined, invokeParameters: ["Valid", 500], invokeReturn: undefined },

    { params: [], returnType: String, invokeParameters: [], invokeReturn: "Valid Return" },

    { params: [String], returnType: String, invokeParameters: ["Valid"], invokeReturn: "Valid Return" },

  ])('Should Succeed when parameters and return types are correct', ({ params, returnType, invokeParameters, invokeReturn }) => {
    // Arrange
    const implementation = jest.fn().mockReturnValue(invokeReturn);

    const checkedFunction = signature(...params)(returnType)(implementation);

    // Act
    const result = checkedFunction(...invokeParameters);

    // Assert
    expect(result).toBe(invokeReturn);
    expect(implementation).toBeCalledWith(...invokeParameters);
    expect(implementation).toHaveReturnedWith(invokeReturn);
  });
});

describe('signature.meta', () => {
  it.each([
    { paramChecks: [], returnCheck: undefined, expectedMeta: { paramChecks: [], returnCheck: 'void' } },
    { paramChecks: [String], returnCheck: undefined, expectedMeta: { paramChecks: ['string'], returnCheck: 'void' } },
    { paramChecks: [String, Number], returnCheck: undefined, expectedMeta: { paramChecks: ['string', 'number'], returnCheck: 'void' } },

    { paramChecks: [], returnCheck: String, expectedMeta: { paramChecks: [], returnCheck: 'string' } },
    { paramChecks: [String], returnCheck: String, expectedMeta: { paramChecks: ['string'], returnCheck: 'string' } },
    { paramChecks: [String, Number], returnCheck: String, expectedMeta: { paramChecks: ['string', 'number'], returnCheck: 'string' } },

    { paramChecks: [Optional(String)], returnCheck: PromiseOf(Number), expectedMeta: { paramChecks: ['Optional<string>'], returnCheck: 'Promise<number>' } },
    { paramChecks: [OneOf('', undefined, null)], returnCheck: undefined, expectedMeta: { paramChecks: ["OneOf<'', undefined, null>"], returnCheck: 'void' } },
    { paramChecks: [Array], returnCheck: undefined, expectedMeta: { paramChecks: ["Array"], returnCheck: 'void' } },
    { paramChecks: [() => { }], returnCheck: undefined, expectedMeta: { paramChecks: ["function"], returnCheck: 'void' } },
  ])('Should contain a metadata object', ({ paramChecks, returnCheck, expectedMeta }) => {
    // Act
    const FuncType = signature(...paramChecks)(returnCheck);

    // Assert
    expect(FuncType.meta).toEqual(expectedMeta);
  });

  it.each([
    'paramChecks',
    'returnCheck',
  ])('Properties should be read only', (property) => {
    'use strict';
    // Arrange
    const FuncType = signature(String, Number)();

    // Act
    const act = () => FuncType.meta[property] = "";

    // Assert
    expect(act).toThrow(`Cannot assign to read only property '${property}'`);
  })
});

describe('checkedImplementation.meta', () => {
  it.each([
    { paramChecks: [String], returnCheck: String, implementation: () => {}, expectedName: 'implementation' },
    { paramChecks: [String, Number], returnCheck: String,  implementation: () => {}, expectedName: 'implementation' },

    { paramChecks: [String], returnCheck: String, implementation: function Foo() {}, expectedName: 'Foo' },
    { paramChecks: [String, Number], returnCheck: String,  implementation: function Foo() {}, expectedName: 'Foo' },
  ])('Should contain a metadata object', ({ paramChecks, returnCheck, implementation, expectedName }) => {
    // Act
    const FuncType = signature(...paramChecks)(returnCheck);
    const Func = FuncType(implementation);

    // Assert
    expect(Func.meta).toEqual({
      name: expectedName,
      signature: FuncType
    });
  });

  it('Should produce function with empty name whe given anonymous function', () => {
    // Arrange
    const Func = signature()()(() => {});

    // Act
    const name = Func.meta.name;

    // Assert
    expect(name).toBe('');
  })

  it.each([
    'name',
    'signature',
  ])('Properties should be read only', (property) => {
    'use strict';
    // Arrange
    const Func = signature(String, Number)()(() => {});

    // Act
    const act = () => Func.meta[property] = "";

    // Assert
    expect(act).toThrow(`Cannot assign to read only property '${property}'`);
  })
});