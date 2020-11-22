# Provide / Inject

The `provide` and `inject` APIs allow you to pass information from parents to child outside of the
normal component APIs, and works on any deeply nested child component instead of only on direct
children.

It's highly inspired by the [provide / inject in the new Vue Composition API](https://v3.vuejs.org/guide/composition-api-provide-inject.html#scenario-background)
with some additional utils, so please read up their documentation first!.

## Provide

Provides a value to any child component.

```ts
declare function provide<T>(key: InjectionKey<T> | string, value: T): void;
```

**Example**

```ts
defineComponent({
  setup() {
    const location = ref('here');
    provide('location', location);

    return [];
  }
})
```

## Inject

Injects a provided value from the parent into a child component. 

```ts
// no default value
declare function inject<T>(
  key: InjectionKey<T> | string
): T | undefined;

// default value
declare function inject<T>(
  key: InjectionKey<T> | string,
  defaultValue: T,
  treatDefaultAsFactory?: false,
): T;

// factory function generates default value
declare function inject<T>(
  key: InjectionKey<T> | string,
  defaultValue: T | (() => T),
  treatDefaultAsFactory: true,
): T;
```

**Example**

```ts
defineComponent({
  setup() {
    const location = inject('location');
    // location.value contains 'here'

    return [];
  }
})
```

## createContext

A helper function to create a typed provide/inject pair sharing the same key.

```ts
declare function createContext<T>(key: InjectionKey<T> | string, defaultValue?: T): [
  provideContext: (value?: T) => void,
  useContext: (defaultValue?: T | (() => T), treatDefaultAsFactory?: boolean) => T
];
```

**Example**

```ts

const [provideLocation, useLocation] = createContext<string>('location');

// parent
defineComponent({
  setup() {
    const location = ref('here');
    provideLocation(location);

    return [];
  }
})

// child
defineComponent({
  setup() {
    const location = useLocation(); // typed as string
    // location.value contains 'here'

    return [];
  }
})
```
