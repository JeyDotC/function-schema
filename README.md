Define your function signature

```javascript
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
// myFunction(name: string): string
const myFunction = signature(String)(String)(
  (name) => `Hello, ${name}`,
)
```

Optional parameters

```javascript
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

Use signatures as function factories

```javascript
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
