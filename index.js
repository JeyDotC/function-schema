import { Any, Optional, signature, Void } from './src/index.js';
import { Int, Struct } from './src/typeChecks.js';

const ResponseType = Struct({
  name: String,
  age: Int,
  favoriteGame: Optional(String),
});

const MyMethodSignature = signature(String, Number)(Void);

const myFunction = MyMethodSignature(function myFunction(name, age) {
  console.log(`My name is ${name}, and I'm ${age} years old.`);
});

const myFunctionWithOptionalParameter = signature(String, Optional(Number))(String)
  ((name, age) => {
    return `My name is ${name} and I'm ${age !== undefined ? age : 'infinite'} years old.`;
  });

const iReceiveFunction = signature(Function)(Any)((f) => f());

console.log(MyMethodSignature.toString());
console.log(myFunction.toString());

myFunction('John', 117);

console.log(myFunctionWithOptionalParameter('', 12));

console.log(myFunctionWithOptionalParameter('Mileena'));

iReceiveFunction(() => console.log('Wiiiii'));

const IReceiveObjectWithCertainStructure = signature(ResponseType)()(
  ({ name, age, favoriteGame }) => console.log(`This is ${name}, I'm ${age} old and my favorite game is ${favoriteGame}`)
);

IReceiveObjectWithCertainStructure({
  name: 'Juanito',
  age: 117,
  favoriteGame: 'Halo'
});

IReceiveObjectWithCertainStructure({
});

IReceiveObjectWithCertainStructure({ name: 200, age: 300 });