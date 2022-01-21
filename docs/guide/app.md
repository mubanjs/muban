# App

Although components can be initialized individually, in most cases you want to start by creating a
Muban app first.

## createApp

The `createApp` is the default starting point for almost all Muban applications, allowing you to:

- specify the root component
- `mount` the app into the DOM
- register global `components` that should be instantiated automatically whenever they are found 
  in the DOM
- `provide` global "context" values

### mount

The basic app creation is as follows:

```ts
import { createApp } from '@muban/muban';

// create your App with your root component
const app = createApp(MyComponent);

// query your container in the DOM
const appRoot = document.getElementById('app');

// mount the app into the container
app.mount(appRoot);
```


#### Development templates

During development, when a server is not available yet to render your templates, you can choose to
render your templates in the container as part of the mounting process.

```ts
import { createApp } from '@muban/muban';

// create your App with your root component
const app = createApp(MyComponent);

// query your container in the DOM
const appRoot = document.getElementById('app');

// mount the app into the container
// it will also render the `myComponentTemplate` in the dom using the values passed
app.mount(appRoot, myComponentTemplate, { title: 'Hello World!' });
```

### components

If you have global components that should be instantiated automatically without explicitly providing
them as part of any other components, you can register them on the `App`.

```ts
const app = createApp(MyComponent);

// register a single component
app.component(ToggleExpand);

// register a lazy component
app.component(
  lazy('lazy-test', () => import('./LazyTest'))
);

// or register multiple at the same time
app.component(
  ToggleExpand,
  lazy(
    'product-card',
    () => import('../filter-products/FilterProducts.card'),
  ),
  lazy('lazy-test', () => import('./LazyTest')),
);
```

### provide

In most cases your root component will `provide` objects to the rest of your app, but you can also
provide the values directly to your `App` itself.

```ts
const app = createApp(MyComponent);

// provides an instance of an `SomeGlobalState` object under the `some-key`
app.provide('some-key', new SomeGlobalState())


// in any other component, just inject the value to use it
const value = inject('some-key');
```

