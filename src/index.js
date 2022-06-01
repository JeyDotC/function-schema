const { signature } = require('./signature');
const { TypeCheck, ValueKind } = require("./typeCheck");
const { Any, Int, OneOf, Optional, PromiseOf, Struct, typeCheckFactory, Void, Falsy, Truthy } = require("./typeChecks");

module.exports = {
  signature,
  TypeCheck, ValueKind,
  Any, Int, OneOf, Optional, PromiseOf, Struct, typeCheckFactory, Void, Falsy, Truthy,
}