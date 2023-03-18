// const names: Array<string | number> = ['Max', 'Manuel'];
//
// const promise = new Promise((resolve, reject) => {
//     setTimeout(() => {
//         resolve(`This is done!`);
//     }, 2000);
//     reject();
// });

function merge<T extends object, U extends object>(objA: T, objB: U) {
  return Object.assign(objA, objB);
}

const mergedObj = merge({ name: 'Max' }, { age: 30 });
console.log(mergedObj);

interface Lengthy {
  length: number;
}

function countAndDescribe<T extends Lengthy>(element: T): [T, string] {
  let descriptionText = 'Got no value.';
  if (element.length === 1) {
    descriptionText = `Got 1 elements.`;
  } else if (element.length > 1) {
    descriptionText = `Got ${element.length} elements.`;
  }
  return [element, descriptionText];
}

console.log(countAndDescribe(`Hi there!`));

function extraAndConvert<T extends object, U extends keyof T>(
  obj: T,
  key: U,
) {
  return `Value: ${obj[key]}`;
}

extraAndConvert({ name: 'Yonghun' }, 'name');

class DataStorage<T extends string | number | boolean> {
  private data: T[] = [];

  addItem(item: T) {
    this.data.push(item);
  }

  removeItem(item: T) {
    if (this.data.indexOf(item) === -1) {
      return;
    }
    this.data.splice(this.data.indexOf(item), 1);
  }

  getItem() {
    return [...this.data];
  }
}

const textStorage = new DataStorage<string>();
textStorage.addItem('Park');
textStorage.addItem('Yonghun');
textStorage.removeItem('Yonghun');
console.log(textStorage.getItem());

const numberStorage = new DataStorage<number>();

// const objStorage = new DataStorage<object>();
// objStorage.addItem({name: 'Park'});
// objStorage.addItem({name: 'Yonghun'});
// objStorage.removeItem({name: 'Park'});
// console.log(objStorage.getItem());

interface CourseGoal {
  title: string;
  description: string;
  completeUntil: Date;
}

function createCourseGoal(
  title: string,
  description: string,
  date: Date): CourseGoal {
  let courseGoal: Partial<CourseGoal> = {};
  courseGoal.title = title;
  courseGoal.description = description;
  courseGoal.completeUntil = date;
  return courseGoal as CourseGoal;
}