const { TypeCheck } = require("./typeCheck");

function Matches(pattern) {
  return new TypeCheck(`Matches(${pattern.toString()})`, ({value}) => pattern.test(value));
}

module.exports = {
  Matches
}