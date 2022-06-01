const { signature } = require('./signature');
const { TypeCheck, ValueKind } = require("./typeCheck");
const { Any, Int, OneOf, Optional, PromiseOf, Struct, typeCheckFactory, Void, Falsy, Truthy } = require("./typeChecks");
const { Matches, Email, Url, NumericString, BooleanString, IntString } = require("./stringTypeChecks");


module.exports = {
  signature,
  TypeCheck, ValueKind,
  Any, Int, OneOf, Optional, PromiseOf, Struct, typeCheckFactory, Void, Falsy, Truthy,
  Email, Url, NumericString, BooleanString, IntString, Matches,
}