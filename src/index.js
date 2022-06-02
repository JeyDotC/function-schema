const { signature } = require('./signature');
const { TypeCheck, ValueKind } = require("./typeCheck");
const { Any, Int, OneOf, Optional, PromiseOf, Struct, typeCheckFactory, Void, Falsy, Truthy, Variadic } = require("./typeChecks");
const { Matches, Email, Url, NumericString, BooleanString, IntString } = require("./stringTypeChecks");
const { ArrayOf, Tuple } = require("./collectionTypeChecks");


module.exports = {
  signature,
  TypeCheck, ValueKind,
  Any, Int, OneOf, Optional, PromiseOf, Struct, typeCheckFactory, Void, Falsy, Truthy, Variadic,
  Email, Url, NumericString, BooleanString, IntString, Matches,
  ArrayOf, Tuple,
}