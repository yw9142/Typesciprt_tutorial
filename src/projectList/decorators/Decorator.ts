function Logger(logString: string) {
  console.log('LOGGER FACTORY');
  return function(constructor: Function) {
    console.log(logString);
    console.log(constructor);
  };
}

function withTemplate(template: string, hookId: string) {
  console.log('TEMPLATE FACTORY');
  return function <T extends { new(...args: any[]): { name: string } }>(originalConstructor: T) {
    return class extends originalConstructor {
      constructor(..._args: any[]) {
        super();
        console.log(`Rendering template`);
        const hookEl = document.getElementById(hookId);
        // const p = new originalConstructor();
        if (hookEl) {
          hookEl.innerHTML = template;
          hookEl.querySelector('h1')!.textContent = this.name;
        }
      }
    };
  };
}

@Logger('LOGGING')
@withTemplate('<h1>My Person Object</h1>', 'app') // Decorator 실행순서 Bottom-Up but function is Top-down
class Person {
  name = 'Yonghun';

  constructor() {
    console.log('Creating person object...');
  }
}

const per = new Person();
console.log(per);

// --

function Log(target: any, propertyName: string | Symbol) { // Property Decorators
  console.log('Property decorator!');
  console.log(target, propertyName);
}

function Log2(target: any, name: string, descriptor: PropertyDescriptor) { // Accessor Decorators
  console.log('Accessor decorator!');
  console.log(target);
  console.log(name);
  console.log(descriptor);
}

function Log3(target: any, name: string | Symbol, descriptor: PropertyDescriptor) { // Method Decorators
  console.log('Method decorator!');
  console.log(target);
  console.log(name);
  console.log(descriptor);
}

function Log4(target: any, name: string | Symbol, position: number) { // Parameter decorator
  console.log('Parameter decorator!');
  console.log(target);
  console.log(name);
  console.log(position);
}

class Product {
  @Log
  title: string;
  private _price: number;

  @Log2
  set price(val: number) {
    if (val > 0) {
      this._price = val;
    } else {
      throw new Error('Invalid price - should be positive!');
    }
  }

  constructor(t: string, p: number) {
    this.title = t;
    this._price = p;
  }

  @Log3
  getPriceWithTax(@Log4 tax: number) {
    return this._price * (1 + tax);
  }
}

const p1 = new Product('Book', 19);
const p2 = new Product('Book2', 29);

function Autobind(_target: any, _name: string | Symbol, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value;
  const adjDescriptor: PropertyDescriptor = {
    configurable: true,
    enumerable: false,
    get() {
      const boundFn = originalMethod.bind(this);
      return boundFn;
    },
  };
  return adjDescriptor;
}

class Printer {
  message = 'This works!';

  @Autobind
  showMessage() {
    console.log(this.message);
  }
}

const p = new Printer();

const button = document.querySelector('button')!;
button.addEventListener('click', p.showMessage);

// --

interface ValidatorConfig {
  [property: string]: {
    [validatableProp: string]: string[] // ['required', 'positive'];
  };
}

const registeredValidators: ValidatorConfig = {};

function Required(target: any, propName: string) {
  registeredValidators[target.constructor.name] = {
    ...registeredValidators[target.constructor.name],
    [propName]: [...(registeredValidators[target.constructor.name]?.[propName] ?? []), 'required']
  };
}

function PositiveNumber(target: any, propName: string) {
  registeredValidators[target.constructor.name] = {
    ...registeredValidators[target.constructor.name],
    [propName]: [...(registeredValidators[target.constructor.name]?.[propName] ?? []), 'positive']
  };
}

function Validate(obj: any) {
  const objValidatorConfig = registeredValidators[obj.constructor.name];

  if (!objValidatorConfig) {
    return true;
  }
  let isValid = true;
  for (const prop in objValidatorConfig) {
    for (const validator of objValidatorConfig[prop]) {
      switch (validator) {
        case 'required':
          isValid = isValid && !!obj[prop];
          break;
        // return !!obj[prop];
        case 'positive':
          // return obj[prop] > 0;
          isValid = isValid && obj[prop] > 0;
          break;
      }
    }
  }
  return true;
}

class Course {
  @Required
  title: string;
  @PositiveNumber
  price: number;

  constructor(t: string, p: number) {
    this.title = t;
    this.price = p;
  }
}

const courseForm = document.querySelector('form')!;
courseForm.addEventListener('submit', event => {
    event.preventDefault();
    const titleEl = document.getElementById('title') as HTMLInputElement;
    const priceEl = document.getElementById('price') as HTMLInputElement;

    const title = titleEl.value;
    const price = +priceEl.value;

    const createdCourse = new Course(title, price);

    if (!Validate(createdCourse)) {
      alert(`Invalid input, please try again!`);
      return;
    }
    console.log(createdCourse);
  },
);