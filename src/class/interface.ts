// type AddFn = (a: number, b: number) => number;
interface AddFn {
  (a: number, b: number): number;
}

// let add: AddFn;

let add: AddFn = (n1: number, n2: number) => {
  return n1 + n2;
};

console.log(add(1, 2));

interface Person {
  readonly name?: string;
  outputName?: string;
  age: number;
}

interface Greetable extends Person {
  greet(phrase: string): void;
}

class PersonClass implements Greetable {
  name?: string;
  age = 30;

  constructor(n?: string) {
    if (n) {
      this.name = n;
    }
  }

  greet(phrase: string) {
    if (this.name) {
      console.log(`${phrase} ${this.name}`);
    } else {
      console.log('Hi!');
    }
  }
}

let user1: Greetable;
user1 = new PersonClass();

// user1 = {
//     name: 'Max',
//     age: 30,
//     greet(phrase: string) {
//         console.log(`${phrase} ${this.name}`);
//     }
// };

user1.greet('Hello');