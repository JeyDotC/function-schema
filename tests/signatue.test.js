const { signature } = require("../src/signature");

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
})