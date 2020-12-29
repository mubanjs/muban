
let promise;

if (typeof queueMicrotask !== 'function') {
  global.queueMicrotask = (cb) =>
    (promise || (promise = Promise.resolve())).then(cb).catch((err) =>
      setTimeout(() => {
        throw err;
      }, 0),
    );
}
