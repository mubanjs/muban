/* eslint-disable @typescript-eslint/no-explicit-any,@typescript-eslint/naming-convention */
type Bucket = { slots: Array<Slot<any>>; currentPos: number; maxCount?: number };
const bucketStack: Array<Bucket> = [];

class Slot<T> {
  public value!: T;
  public isInitialized: boolean = false;

  public setInitialValue(value: T) {
    if (!this.isInitialized) {
      this.value = value;
      this.isInitialized = true;
    }
  }
  public setValue(value: T) {
    this.value = value;
  }
}

const getSlot = <T>(): Slot<T> => {
  const bucket = bucketStack[bucketStack.length - 1];
  ++bucket.currentPos;
  if (!bucket.maxCount) {
    bucket.slots.push(new Slot<T>());
  }
  return bucket.slots[bucket.slots.length - 1];
};

const useState = <T>(initialValue: T | (() => T)): [T, (value: T) => void] => {
  const slot = getSlot<T>();
  if (!slot.isInitialized) {
    slot.setInitialValue(
      typeof initialValue === 'function' ? (initialValue as any)() : initialValue,
    );
  }
  return [slot.value, (value) => slot.setValue(value)];
};

const wrap = <T extends Array<any>>(fn: (...args: T) => any) => {
  const bucket: Bucket = {
    slots: [],
    currentPos: 0,
    maxCount: undefined,
  };
  return (...args: T) => {
    bucketStack.push(bucket);
    fn(...args);
    bucket.maxCount = bucket.currentPos;
    bucketStack.pop();
  };
};

const Foo = (count: number) => {
  const [value, setValue] = useState(() => count);
  console.log(value);
  setValue(value + 10);
};

const foo = wrap(Foo);
foo(1);
foo(2);
foo(3);
