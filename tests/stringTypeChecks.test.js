const { Matches } = require("../src/stringTypeChecks");

describe(`${Matches.name}`, () => {
  it('Should accept strings matching the given regular expression', () => {
    // Arrange
    const regex = /[a-z]/i;
    const value = "a";

    // Act
    const { isValid } = Matches(regex).isValid({ value });

    // Assert
    expect(isValid).toBe(true);
  });

  it('Should reject strings not matching the given regular expression', () => {
    // Arrange
    const regex = /[a-z]/i;
    const value = "1";

    // Act
    const { isValid } = Matches(regex).isValid({ value });

    // Assert
    expect(isValid).toBe(false);
  });
});