# App

## createApp

```ts
declare function createApp(
  rootComponent: ComponentFactory,
): App;
```

```ts
import { createApp } from '@muban/muban';

const app = createApp(MyComponent);
```

## mount

```ts
declare function mount<P extends Record<string, unknown>>(
  container: HTMLElement,
  template?: (props: P) => string | Array<string>,
  data?: P,
): ComponentApi | undefined;
```

```ts
const app = createApp(MyComponent);
const appRoot = document.getElementById('app');

// mount the app into the container
const myComponentInstance = app.mount(appRoot);
```

```ts
const app = createApp(MyComponent);
const appRoot = document.getElementById('app');

// mount the app into the container
// it will also render the `myComponentTemplate` in the dom using the values passed
const myComponentInstance = app.mount(appRoot, myComponentTemplate, { title: 'Hello World!' });
```

## unmount

```ts
declare function unmount(): void;
```

The `unmount` method will unmount and dispose all created components, and when the app is mounted
with a development template it will also clean up the DOM.

```ts
const app = createApp(MyComponent);
const appRoot = document.getElementById('app');

// mount the app into the container
const myComponentInstance = app.mount(appRoot);

// unmount again
app.unmount();
```

## components

Registering components globally will make sure that those components will be initialized if they
exist in the DOM, and are not explicitly configured in any other "parent" component.

```ts
declare function components(
  ...components: Array<ComponentFactory | LazyComponent>
): App;
```

Global components follow the same "creation order" as normal components, and will inherit the
context if they are nested (in the DOM) in any parent component that provides the context.


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


## provide

```ts
declare function provide<T>(key: InjectionKey<T> | string, value: T): App;
```

In most cases your root component will `provide` objects to the rest of your app, but you can also
provide the values directly to your `App` itself.

```ts
const app = createApp(MyComponent);

// provides an instance of an `SomeGlobalState` object under the `some-key`
app.provide('some-key', new SomeGlobalState())


// in any other component, just inject the value to use it
const value = inject('some-key');
```
