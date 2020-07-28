# Exploring reactivity

When dealing with state and DOM updates within components, there are two main methods of approaching this;

1. Re-render everything as a pure function, and compare the outcome to detect what DOM updates are needed.
   This is how React approaches it.

2. Make your state reactive, and only apply specific updates when that specific data changes.
   This is how Vue/Mobx/Knockout and others approach it.

The advantage of the pure approach is that it's relatively easy to reason about; the same input will always give the
same output, and your state are just primitive values that are passed around.

However, it becomes more tricky once you need to react to changes in your data, or user input, and produce side effects.
At this point, you would have to manually specify dependencies for your side-effects. And to keep things
performant, memoizing computations or non-primitive references should be applied, adding further need to use manual
dependencies to update them when needed.

This is where reactivity can make things simpler, by tracking dependencies automatically when used. However, it comes
with it own rules that you have to follow, mostly related to passing around those observables in a way that dependency
tracking can do its job.

## value vs reference

In Javascript, you have primitives (like string, number, boolean) that represent single values. When you pass them
around, you always pass their value. Reassigning them does nothing to earlier variables.
 
```js
const a = 1;
const b = a; // becomes 1, but is not connected to a
b = 2;
// a = 1
// b = 2
a = 3;
// a = 3
// b = 2
```
```js
function foo(value) {
  value++;
  // "value" becomes 2
}
const a = 1;
foo(a);
// "a" still is 1
```

When you deal with references (like objects and arrays), you pass them around by reference. And changes to the object
in one place, will update the object in other places.

```js
const a = {
  count: 1,
};
const b = a; // they now point to the same object
b.count = 2;
// a.count = 2
// b.count = 2
```
```js
function foo(value) {
  value.count++;
  // "value.count" becomes 2
}
const a = {
  count: 1,
};
foo(a);
// "a.count" also is 2
```

However, once you disconnect the "count" from the object, it becomes a primitive again:
```js
function foo(value) {
  value++;
  // "value" becomes 2
}
const a = {
  count: 1,
};
foo(a.count); // passing a primitive, you disconnect it from the object
// "a.count" still is 1
```

Reactivity works in the same way. It works as long as you keep passing references (to objects) around, but as soon as
you use destructuring, or pass along an object property that is primitive value, it stops working.

## Observable core concept

The core concept of reactivity is to be able to observe reads and writes to objects. If I **change** an observable,
it should "reexecute" everything where I **used** that variable before.

There are 2 main ways of reacting to changes:

1. explicitly subscribing to changes on an observable
2. reading observables in functions that "tracks" them while executing the function, and re-execute the function when
 one of them changes. This can be split up in two different use cases as well.
    1. Using a function to produce a new value that is returned - often called a "computed" or a "selector".
    2. Using a function to produce side effects (like logging, doing API calls, etc). Which is similar manually
     subscribing, but in this case the subscription happens automatically, and on multiple observables at the same time.

Examples:
```js
const state = observable({ count: 1});

// 1. explicitly subscribe
state.subscribe('count', (newValue) => {
  newValue; // 2
  state.count; // 2
});

// 2.i create a computed value
// double changes every time that "state.count" is updated
const double = computed(() => state.count * 2);
// currently is still "2"

// 2.ii create a side effect
watchEffect(() => {
  // this log will be fired whenever the count or the double will update
  console.log(state.count, double.get());
});

function onClick() {
  state.count++; // this will change the count, and notify that it has changed;
  
  double.get(); // this is now 4
}
```
**Note**: In the above code, the `double` computed returned is not a number itself, but rather an observable object
that has a `get` method to get the latest value. This is explained further below, and has to do with the primitives.

Objects and primitives should be handled a bit differently from each other; primitives should be "boxed" inside an
object to be passed around as reference, and to track its reads and writes:

```js
const counter = boxed(1);

console.log(counter.get()); // outputs 1

watchEffect(() => {
  // this log will be fired whenever the counter updates
  console.log(counter.get());
});

function onClick() {
  counter.set(counter.get() + 1);
  // will trigger the watchEffect above, and log "2"

  console.log(counter.get()); // outputs 2
}
```

With observable objects the tracking happens through `state.count`, while with boxed primitives, the tracking happens
through the `counter.get` and `counter.set`.

Computed properties often return a value that should be observable, and can be a primitive. That is why the computed
in the first code example also uses `double.get()`. If the `computed(...)` function just returned a number, you could
not use it in any other place.

Some libraries choose to expose a `.value` property on a boxed/computed to replace the `get/set` functions, so it can
be used in a similar way as other observables (e.g. `counter.value++` and `console.log(counter.value)`).

## Dependency tracking

When using `counter.set()`, it's pretty clear that a function is called, and that internal logic can be executed to
notify the usages of the `counter`. Similarly, `counter.value++` or `state.count++` internally use an ES5 getter/setter
that is exposed as a function, or by using an es6 proxy which also executes a function internally.

For `counter.get()` / `counter.value` / `state.count` this happens in a similar way. The underlying code knows when you
are reading the value. Keep this in mind.

Dependency tracking is not used just everywhere. If I just create an observable, and log its value, it won't
automatically happen again when I change its value:
```js
const state = observable({ count: 1});
console.log(state.count);
state.count = 2; // besides changing the value, nothing happens here
```

However, when I'm in a `watch` function, something does happen:
```js
const state = observable({ count: 1});

watchEffect(() => {
  // this log will be fired whenever the counter updates
  console.log(state.count);
});

state.count = 2; // now, the watchEffect gets executed again
```

So, how does this work? Whenever the `watchEffect` function is executing its passed callback function, it keeps track
of every observable that's being read while executing this function. It than subscribes to each of them, and re-executes
the passed callback function again if something changes. It looks similar to this:
```js
// pseudo code - this is not how it actually works
function watchEffect(callback) {
  const tracked = [];

  reportReadsTo(tracked);
  callback();
  stopReportingReads();

  tracked.forEach(t => t.subscrube(() => watchEffect(callback)));
}
```

This not only happens for `watchEffect`, but also for a `computed`:
```js
const state = observable({ count: 1});

// the computed function gets executed, because `state.count` is tracked.
const double = computed(() => state.count * 2);
 
watchEffect(() => {
  // this log will be fired whenever the counter updates
  // or whenever double changes 
  console.log(state.count, double.value);
});

state.count = 2; // now, both `double` computed, and the `watchEffect` will be called
```

## Losing reactivity

There are common pitfalls when passing reactive data around where you loose reactivity. The most common ones within
a component context is passing to, and returning from, helper functions:
```js
function duplicate(value) {
  const state = observable({
    double: 0,
  });
  
  watchEffect(() => {
    state.double = value * 2;
  })
  
  return state;
}

const state = observable({ count: 1});

// we loose reactivity twice.
// 1. When passing the value, we just pass the primitive '1'
// 2. When destructuring the return, double ust contains the primitive '2'
const { double } = duplicate(state.count);

watchEffect(() => {
  console.log(double);
})

state.count++;
```

We have 2 `watchEffect` functions in the above example. The first in the `duplicate` function, that should execute when
the `value` changes. It doesn't because it receives a primitive. The second should log `double` whenever it changes.
It doesn't, because it's destructured in a primitive. Let's fix it:

```js
function duplicate(value) {
  const state = observable({
    double: 0,
  });
  
  watchEffect(() => {
    // we now use `value.get();
    state.double = value.get() * 2;
  })
  
  // we convert the return value to a boxed primitve, that's kept in sync with the state observable
  return { double: toBoxed(state, 'double')};
}

const state = observable({ count: 1});

// we convert the passed argument to a boxed primitive, that's kept in sync with the state observable
const { double } = duplicate(toBoxed(state, 'count'));

watchEffect(() => {
  // we use `double.get()` to log it 
  console.log(double.get());
})

state.count++;
```

As you can see, every time we need to pass primitives from and to functions, we wrap them in a boxed object to pass them
as reference, which keeps the reactivity alive.

This necessity is the biggest "downside" of reactivity.

## Different libraries

Below we will explore how different libraries deal with the reactivity concepts above. We'll look at Vue 3, where this
is used in the composition API. We'll have al ook at MobX, where this is the core part of their library. Lastly,
we take a look at Knockout JS, which has been around for a while and currently still used in Muban for DOM binding.

### Vue Composition

```js
// --- primitive
const counter = ref(1); // create

counter.value; // read
counter.value++; // write


// --- objects
const state = reactive({ count: 1 }); // create

state.count; // read
state.count++; // write


// --- convert to ref
const count = toRef(state, 'count'); // single value

const { count } = toRefs(state); // all object keys


// --- use refs in reactive
const state = reactive({ count: counter}); // refs auto-unwrap and keep their 2-way binding

state.count++; // also updates the `counter` ref


// --- computed - readonly
const double = computed(() => count.value * 2); // returned `double` is a `ref`

double.value; // read


// --- computed - read and write
const double = computed({
  get: () => count.value * 2,
  set: val => count.value = val / 2,
}); // writes back to the `count` ref

double.value; // read
double.value++; // write


// --- watchEffect - implicit dependecies
watchEffect(() => console.log(state.count));
// executes immediately to start tracking used dependencies,
// and executes again whenever they cnage


// --- watch - explicit dependencies
watch(
  () => state.count, // from reactive objects, as a function
  (count, prevCount) => {
    /* ... */
  }
);
watch(
  counter, // or directly for a single ref
  (count, prevCount) => {
    /* ... */
  }
);

// can also return an array or object to watch multiple values at the same time
watch(() => [foo, bar], ([foo, bar]) => { /* ... */ });

```


### MobX

```js
// --- primitive
const counter = observable.boxed(1); // create

counter.get(); // read
counter.set(2); // write


// --- objects
const state = observable({ count: 1 }); // create

state.count; // read
state.count++; // write


// --- convert to ref
// not natively possible, but can be doen by using a writable computed
const toRef = (obj, field) => {
  return computed(() => (obj[field]), (value) => obj[field] = value);
}

const count = toRef(state, 'count'); // single value

const { count } = toRefs(state); // all object keys


// --- use boxed in observable - only by value
const state = observable({ count: counter.get()}); // loses reactivity

state.count++; // doesn't update original boxed value


// --- computed - readonly
const double = computed(() => count.value * 2); // returned `double` is a `ref`

double.value; // read


// --- computed - read and write
const double = computed(
  () => counter.get() * 2,
  val => counter.set(val / 2),
); // writes back to the `count` ref

double.get(); // read
double.set(2); // write


// --- autorun - implicit dependecies
autorun(() => console.log(state.count));
// executes immediately to start tracking used dependencies,
// and executes again whenever they cnage


// --- reaction - explicit dependencies
reaction(
  () => state.count, // from reactive objects, as a function
  (count) => {
    /* ... */
  }
);

// can also return an array or object to watch multiple values at the same time
reaction(() => [foo, bar], ([foo, bar]) => { /* ... */ });
```



### Knockout JS

```js
// --- primitive
const counter = ko.observable(1); // create

counter(); // read
counter(2); // write


// --- objects - are shallow/ref by default
const state = ko.observable({ count: ko.obsevable(1) }); // create

state().count(); // read
state().count(2); // write


// --- convert to ref
// primitives and objects are all observable, so need for conversion


// --- next obsevables 
const state = ko.observable({ count: counter}); // auto reactivity

state().count(2); // also updates the counter observable


// --- computed - readonly
const double = ko.computed(() => count.value * 2); // returned `double` is a `ref`

double(); // read


// --- computed - read and write
const double = ko.computed({
  read: () => counter() * 2,
  write: val => counter(val / 2),
}); // writes back to the `count` ref

double(); // read
double(2); // write


// --- subscribe - to a single obsevable or computed
counter.subscribe((newValue) => console.log(newValue));

// not possible to listen to multiple at the same time, but a computed + subscription can be abused for that
function watchEffect(fn) {
  const comp = ko.computed(fn);
  comp(); // fire immediately to start tracing dependencies
  return comp;
}
watchEffect(() => console.log(counter()));

```

### Verdict

Knockout JS is the simplest, both in usage and in features. It doesn't have the issues with passing around primitives,
since everything is always an observable itself. The downside is that everything requires `()` to access, and that
deep observable initialisation is not done by the library itself.
Of course, knockout already has DOM bindings that work perfectly with the observables, so that's a big plus.

MobX has a lot more options and utils not shown above, which the others don't have. However, it's missing some critical
features for managing primitives in an easy and reactive way. MobX is mostly used as objects/classes where this is
less of an issue, but within component state, when passing around al lot of primitive values, it loses a bit of its
power.

Vue Composition API is tailored for use in components, so that is where it shines. The downside is that the current
reactive API is tied into the Vue component system, so a fork of that part of the library would be needed to use it
within muban components.
