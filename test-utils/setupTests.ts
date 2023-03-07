import '@testing-library/jest-dom';

let promise: Promise<void> | undefined;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare const global: any;

if (typeof queueMicrotask !== 'function') {
  global.queueMicrotask = (callback: () => void) => {
    (promise || (promise = Promise.resolve())).then(callback).catch((error) =>
      setTimeout(() => {
        throw error;
      }, 0),
    );
  };
}
