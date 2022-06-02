## Install

```bash
npm install function-schema
```

## Usage

```javascript
import { signature } from 'function-schema';

const myFunction = signature(...ParamTypeChecks)(ReturnValueCheck)(functionDefinition);
```

## Examples:

Define your function signature

```javascript
import { signature, Void } from 'function-schema';

// myFunction(name: string): void
const myFunction = signature(String)(Void)(
  (name) => console.log(`Hello, ${name}`),
)
```

Invoke your function:

```javascript
myFunction('Stan'); // "Hello, Stan"

myFunction(300); // TypeCheckError: Parameter 0 must be an instance of string, received number instead
```

Return value:

```javascript
import { signature } from 'function-schema';

// myFunction(name: string): string
const myFunction = signature(String)(String)(
  (name) => `Hello, ${name}`,
)
```

Optional parameters

```javascript
import { signature, Optional, Int } from 'function-schema';

// myFunction(name: string, age: Optional<int>): string
const myFunction = signature(String, Optional(Int))(String)(
  (name, age) => `I'm ${name}, and I'm ${age !== undefined ? age : 'infinite'} years old`,
);

myFunction('John', 17); // "I'm John, and I'm 17 years old"
myFunction('Duncan'); // "I'm John, and I'm infinite years old"
myFunction('Didact', null); // "I'm Didact, and I'm infinite years old"
myFunction('Zima', undefined); // "I'm Zima, and I'm infinite years old"

myFunction('Josh', 'Foo'); // TypeCheckError: Parameter 1 must be an instance of Optional<int>, received string instead
```

Instance Of

```javascript
import { signature, InstanceOf } from 'function-schema';

class MyClass {
  constructor(name){
    this.name = name;
  }
};

// myFunction(param: MyClass): void
const myFunction = signature(InstanceOf(MyClass))()(
  (param) => console.log(param),
);

// This would have the exact same effect since InstanceOf is the default type check.
const myFunction = signature(MyClass)()(
  (param) => console.log(param),
);

myFunction(new MyClass('John')); // MyClass { name: 'John' }

myFunction(); // TypeCheckError: Parameter 0 must be an instance of MyClass, received undefined instead
myFunction({ name: 'John' }); // TypeCheckError: Parameter 0 must be an instance of MyClass, received object instead
```

Any

```javascript
import { signature, Any } from 'function-schema';

// myFunction(name: any): void
const myFunction = signature(Any)()(
  (something) => console.log(something),
)

// myFunction Accepts anything!

myFunction(); // undefined
myFunction(null); // null
myFunction(500); // 500
myFunction('Steve'); // 'Steve'
myFunction({ x: 0, y: 0 }); // { x: 0, y: 0 }
```

One Of

```javascript
import { signature, OneOf } from 'function-schema';

const myFunction = signature(OneOf(String, Number))()(
  (value) => console.log(value);
);

myFunction('A string!'); // 'A string!'
myFunction(600); // 600

myFunction(); // TypeCheckError: Parameter 0 must be an instance of OneOf<string, number>, received undefined instead
myFunction(null);  // TypeCheckError: Parameter 0 must be an instance of OneOf<string, number>, received object instead
myFunction(undefined);  // TypeCheckError: Parameter 0 must be an instance of OneOf<string, number>, received undefined instead
myFunction({});  // TypeCheckError: Parameter 0 must be an instance of OneOf<string, number>, received object instead
myFunction(() => 'Boom!');  // TypeCheckError: Parameter 0 must be an instance of OneOf<string, number>, received function instead
```

Struct

```javascript
import { signature, Struct } from 'function-schema';

// Define your structure:
const MyType = Struct({
  name: String,
  age: Int,
  favoriteGame: Optional(String),
});

// Define your function
const myFunction = signature(MyType)(String)(
  ({ name, age, favoriteGame}) 
    => `This is ${name}, I'm ${age} years old and ${favoriteGame ? `my favorite game is ${favoriteGame}` : 'have no favorite game'}`;
);

myFunction({
  name: 'John',
  age: 17,
  favoriteGame: 'Halo'
}); // "This is John, I'm 17 years old and my favorite game is Halo"

myFunction({
  name: 'Albert',
  age: 98,
}); // "This is Albert, I'm 94 years old and I have no favorite game"

myFunction({ }); 
// TypeCheckError: Parameter 0 must be an instance of {
// name: string,
// age: int,
// favoriteGame: Optional<String>
// }, received object with these errors: 
//  - name: Parameter 0 must be an instance of string, received undefined instead,
//  - age: Parameter 0 must be an instance of int, received undefined instead
//  instead
```

Promise Of

```javascript
import { signature, PromiseOf } from 'function-schema';

const myPromiseProducingFunction = signature()(PromiseOf(String))(
  () => new Promise((accept) => accept('Some Text'))
);

// Or

const myAsyncFunction = signature()(PromiseOf(String))(
  async () => {
    const result = await somePromiseFunction();
    return result;
  }
);
```

Any

```javascript
import { signature, Any } from 'function-schema';

// myFunction(name: any): void
const myFunction = signature(Any)()(
  (something) => console.log(something),
)

// myFunction Accepts anything!

myFunction(); // undefined
myFunction(null); // null
myFunction(500); // 500
myFunction('Steve'); // 'Steve'
myFunction({ x: 0, y: 0 }); // { x: 0, y: 0 }
```

Variadic

```javascript
import { signature, Variadic } from 'function-schema';

const myFunction = signature(Number, Variadic(String))()(
  (numericValue, ...variadicValues) => console.log(numericValue, variadicValues);
);

myFunction(600); // 600, []
myFunction(600, 'String1'); // 600, ['String1']
myFunction(600, 'String1', 'String2'); // 600, ['String1', 'String2']

myFunction(600, null); // TypeCheckError: Parameter 1 must be an instance of ...string[], received null@1 instead
myFunction(600, 'String1', undefined); // TypeCheckError: Parameter 1 must be an instance of ...string[], received undefined@2 instead
myFunction(600, 'String1', 100, 'String2', 300); // TypeCheckError: Parameter 1 must be an instance of ...string[], received number@2, number@4 instead
```

> **Warning** For the sake of clarity, only use Variadic as _last parameter_, it can technically be used in the middle, but that'd be confusing and, at certain circumstances, cause unpredictable behaviors.

ArrayOf

```javascript
import { signature, ArrayOf } from 'function-schema';

const myFunction = signature(ArrayOf(String))()(
  (arrayOfStrings) => console.log(arrayOfStrings);
);

myFunction([]); // []
myFunction(['String1']); // ['String1']
myFunction(['String1', 'String2']); // ['String1', 'String2']

myFunction(null); // TypeCheckError: Parameter 0 must be an instance of string[], received null instead
myFunction(['String1', undefined]); // TypeCheckError: Parameter 0 must be an instance of string[], received [..., undefined@1] instead
myFunction(['String1', 100, 'String2', 300]); // TypeCheckError: Parameter 0 must be an instance of string[], received [..., number@1, ...] instead
```

> **Note:** Since arrays could potentially be big, this check will stop at the first invalid entry, all subsequent elements will be ignored.

Tuple

```javascript
import { signature, Tuple } from 'function-schema';

const myFunction = signature(Tuple(String, Number))()(
  (tuple) => console.log(tuple);
);

myFunction(['String1', 100]); // ['String1', 'String2']
myFunction(['String1', 100, 'Ignored Value']); // ['String1', 100, 'Ignored Value']

myFunction(null); // TypeCheckError: Parameter 0 must be an instance of (string, number), received null instead
myFunction(['String1', undefined]); // TypeCheckError: Parameter 0 must be an instance of (string, number), received (string, undefined) instead
myFunction(['String1', 'String2', 300]); // TypeCheckError: Parameter 0 must be an instance of (string, number), received (string, string) instead
```

Use signatures as function factories

```javascript
import { signature } from 'function-schema';

const RequestHandler = signature(MyRequestClass)(MyResponseClass);

const listUsers = RequestHandler((request) => new MyResponseClass());
const createUser = RequestHandler((request) => new MyResponseClass());
```

Define custom type checks

```javascript
// A simple type check
const Email = new TypeCheck('email', (entry) => is.email(entry.value));

// A type check with parameters
const NumberRange = (lowerRange, upperRange) => new TypeCheck(`number(from ${lowerRange} to ${upperRange})`, ({value}) => {
  return is.number(value) && value >= lowerRange && value <= upperRange;
});
```

Generics (sort of)

```javascript
const MapDelegate = (T, R) => signature(T)(R);

const numbersToString = MapDelegate(Number, String)((n) => n.toString());

[1, 2, 3, 4].map(numbersToString); // ['1', '2', '3', '4'];

[1, '!', 3, 4].map(numbersToString); // TypeCheckError: Parameter 0 must be an instance of number, received string instead.
```

## All type checks so far

| Type Check | Description | Usage |
|------------|-------------|-------|
| **Primitive types** | | |
| String     | Check if the given value is a string. (Uses typeof value === 'string') | `const myFunction = signature(String)(String)` |
| Number     | Checks if the given value is a number. Numeric strings wont pass | `const myFunction = signature(Number)(Number)` |
| Boolean    | Checks if the given value is a boolean. Boolean strings wont pass | `const myFunction = signature(Boolean)(Boolean)` |
| Any        | Accepts any value | `const myFunction = signature(Any)(Any)` |
| Int        | Accept int numbers only | `const myFunction = signature(Int)(Int)` |
| Void       | Alias for Any, useful to give clarity on return types when no value is expected | `const myFunction = signature()(Void)` |
| Truthy     | Checks if the given value has any non-falsy value | `const myFunction = signature(Truthy)(Truthy)` |
| Falsy      | Checks if the given value has a [falsy value](https://developer.mozilla.org/en-US/docs/Glossary/Falsy) | `const myFunction = signature(Falsy)(Falsy)` |
| **Implicit checks** |||
| Equality Check | If what you provide is a value (not a type or type check), the parameter/return value will be compared to the given value | `const myFunction = signature('Param 0 will be compared to this string')('Return value will be compared to this string')` |
| Type-Of Check | If what you provide is a type (function/class) that doesn't match with the above criteria, the value will be checked with `value instanceof Type` | `const myFunction = signature(MyCustomType)(SomeOtherCustomType)` |
| **Compound Checks** |||
| Optional\<Type\> | Checks if the value is either of the given type, null or undefined | `const myFunction = signature(Optional(String))(Optional(Number))` |
| OneOf\<Type1, Type2, ...\> | Checks if the value is of one of the given types | `const myFunction = signature(OneOf(String, Number))(OneOf(Number, Boolean))`  <br /> Or as an enum:<br /> `const myFunction = signature(OneOf('a', 'b'))(OneOf(0, 1))` |
| PromiseOf\<Type\> | Ensures the value is a promise, and once resolved, it checks the promise has returned the correct type | `const myFunction = signature()(PromiseOf(String))` |
| Struct | Checks if the value complies with the given structure. The object must at least have the same properties and each property should validate against its type, extra properties will be ignored. | `const myFunction = signature(Struct({ name: String, age: Int, status: OneOf('active', 'suspended') }))(Void)` |
| **String Checks** |||
| Matches(regex) | Checks if the value matches the given regular expression  | `const myFunction = signature(Matches(/[a-z]/i))(Matches(/[0-9]/))` |
| Email | Checks if the value is a string representing a valid email | `const myFunction = signature(Email)(Email)` |
| Url   | Checks if the value is a string representing a valid Url | `const myFunction = signature(Url)(Url)` |
| NumericString | Checks if the value is a string representing a number | `const myFunction = signature(NumericString)(NumericString)` |
| IntString | Checks if the value is a string representing an integer | `const myFunction = signature(IntString)(IntString)` |
| BooleanString | Checks if the value is a string representing a boolean, accepts `true` or `false` case-insensitive | `const myFunction = signature(BooleanString)(BooleanString)` |
| **Collection Checks** |||
| Variadic\<Type\> | Receives all remaining parameters in a function and check those all are of the given type | `const myFunction = (Variadic(String))()` Or `const myFunction = (Int, Variadic(String))()`  |
| ArrayOf\<Type\> | Checks that all elements in an array are of the given type | `const myFunction = (ArrayOf(String))(ArrayOf(String))` |
| Tuple\<Type1, Type2, ...\> | Checks if the value is an array complies with the given structure. | `const myFunction = (Tuple(String, Int))(Tuple(String, Int, Boolean))` |


## Thanks to:

* @arasatasaygin - For the [is.js](https://github.com/arasatasaygin/is.js) library from which I'm actively stealing checks for this library. 

## TODO

### ~~Get rid of `is.js` dependency.~~

### ~~Future Checks:~~

- [*] Truthy
- [*] Falsy

String Checks

- [*] Matches
- [*] Email
- [*] Url
- [*] NumericString
- [*] IntString
- [*] BooleanString: Case insensitive version of OneOf('true', 'false')

Collection Checks

- [*] Variadic
- [*] ArrayOf
- [*] Tuple: Understanding tuple as `[TypeCheck1, TypeCheck2, ...]`

### Type Constraints? 

(This one looks tricky, might not be a good idea)

```javascript
Constrained(TypeCheck, Constraint1, Constraint2)
// Or...
TypeCheck.where(Constraint1, Constraint2);
````

- [ ] Min
- [ ] Max
- [ ] Range
- [ ] MinLength
- [ ] MaxLength
- [ ] RangeLength
- [ ] (value) => boolean