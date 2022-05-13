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

Any

One Of

Struct

Promise Of

Generics (sort of)

