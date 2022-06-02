const { Matches, Email, Url, BooleanString, IntString, NumericString } = require("../src/stringTypeChecks");

describe(`${Matches.name}`, () => {
  it.each([
    { value: 'a', expectedResult: true, },
    { value: 'b', expectedResult: true, },
    { value: 'z', expectedResult: true, },

    { value: null, expectedResult: false, },
    { value: undefined, expectedResult: false, },
    { value: '', expectedResult: false, },
    { value: [], expectedResult: false, },
    { value: {}, expectedResult: false, },
    { value: '1', expectedResult: false, },
  ])('Should accept only strings matching the given expression', ({value, expectedResult}) => {
    // Arrange
    const regex = /[a-z]/i;

    // Act
    const { isValid } = Matches(regex).isValid({ value });

    // Assert
    expect(isValid).toBe(expectedResult);
  });
});

describe(`${Email.name}`, () => {
  it.each([
    { value: 'test@test.com', expectedResult: true, },
    { value: 'test-1@test.com.co', expectedResult: true, },
    { value: 'test+123@test.co', expectedResult: true, },

    { value: null, expectedResult: false, },
    { value: undefined, expectedResult: false, },
    { value: '', expectedResult: false, },
    { value: [], expectedResult: false, },
    { value: {}, expectedResult: false, },
    { value: 'test@test', expectedResult: false, },
  ])('Should accept valid emails', ({value, expectedResult}) => {
    // Act
    const { isValid } = Email.isValid({ value });

    // Assert
    expect(isValid).toBe(expectedResult);
  });
});

describe(`${Url.name}`, () => {
  it.each([
    { value: 'http://www.test.com', expectedResult: true, },
    { value: 'http://www.test.com:8080', expectedResult: true, },
    { value: 'http://www.test.com/#hash', expectedResult: true, },
    { value: 'http://www.test.com/path', expectedResult: true, },
    { value: 'http://www.test.com/?value=x', expectedResult: true, },
    { value: 'http://www.test.com/?value=x+spaced', expectedResult: true, },
    { value: 'http://www.test.com/?value=x+spaced&other=somewhere%20over%20the%20rainbow', expectedResult: true, },
    { value: 'http://www.test.com:8080/?value=x&value2=2#hash', expectedResult: true, },
    { value: 'www.test.com:8080/?value=x&value2=2#hash', expectedResult: true, },

    { value: null, expectedResult: false, },
    { value: undefined, expectedResult: false, },
    { value: '', expectedResult: false, },
    { value: [], expectedResult: false, },
    { value: {}, expectedResult: false, },
    { value: 50, expectedResult: false, },
    { value: 'test@test', expectedResult: false, },
  ])('Should accept valid URLs', ({value, expectedResult}) => {
    // Act
    const { isValid } = Url.isValid({ value });

    if(isValid !== expectedResult){
      console.log(value);
    }

    // Assert
    expect(isValid).toBe(expectedResult);
  });
});

describe(`${BooleanString.name}`, () => {
  it.each([
    { value: 'true', expectedResult: true, },
    { value: 'True', expectedResult: true, },
    { value: 'TRUE', expectedResult: true, },
    { value: 'truE', expectedResult: true, },
    { value: 'false', expectedResult: true, },
    { value: 'False', expectedResult: true, },
    { value: 'FALSE', expectedResult: true, },
    { value: 'falsE', expectedResult: true, },

    { value: true, expectedResult: false, },
    { value: false, expectedResult: false, },
    { value: null, expectedResult: false, },
    { value: undefined, expectedResult: false, },
    { value: '', expectedResult: false, },
    { value: [], expectedResult: false, },
    { value: {}, expectedResult: false, },
    { value: '1', expectedResult: false, },
  ])('Should accept only case insensitive true or false', ({value, expectedResult}) => {
    // Act
    const { isValid } = BooleanString.isValid({ value });

    // Assert
    expect(isValid).toBe(expectedResult);
  });
});

describe(`${NumericString.name}`, () => {
  it.each([
    { value: '0', expectedResult: true, },
    { value: '1', expectedResult: true, },
    { value: '1.2', expectedResult: true, },
    { value: '8.5', expectedResult: true, },
    { value: '-500', expectedResult: true, },
    { value: '6000', expectedResult: true, },

    { value: null, expectedResult: false, },
    { value: undefined, expectedResult: false, },
    { value: '', expectedResult: false, },
    { value: 'Hello World', expectedResult: false, },
    { value: [], expectedResult: false, },
    { value: {}, expectedResult: false, },
    { value: 500, expectedResult: false, },
  ])('Should accept only number strings', ({value, expectedResult}) => {
    // Act
    const { isValid } = NumericString.isValid({ value });

    // Assert
    expect(isValid).toBe(expectedResult);
  });
});

describe(`${IntString.name}`, () => {
  it.each([
    { value: '0', expectedResult: true, },
    { value: '1', expectedResult: true, },
    { value: '-500', expectedResult: true, },
    { value: '6000', expectedResult: true, },

    { value: '1.2', expectedResult: false, },
    { value: '-8.5', expectedResult: false, },
    { value: null, expectedResult: false, },
    { value: undefined, expectedResult: false, },
    { value: '', expectedResult: false, },
    { value: 'Hello World', expectedResult: false, },
    { value: [], expectedResult: false, },
    { value: {}, expectedResult: false, },
    { value: 500, expectedResult: false, },
  ])('Should accept only int strings', ({value, expectedResult}) => {
    // Act
    const { isValid } = IntString.isValid({ value });

    if(isValid !== expectedResult){
      console.log(value, Number.parseInt(value));
    }

    // Assert
    expect(isValid).toBe(expectedResult);
  });
});