# Component

The Component API consists of a single function, which is responsible for defining your components.

Most other APIs are used "inside" the component definition.

## defineComponent

`defineComponent` is a factory function, taking in a configuration object, and returning a function
that can be used to initialize your component when receiving the right HTML element.

```ts
// definition
declare function defineComponent(options: DefineComponentOptions): ComponentFactory;
```

In short, the usage looks like this:

```ts
// usage
const MyComponent = defineComponent({ ... });
const instance = MyComponent(element);
```

The options you can pass to the component are the `name`, `props` and `refs`, and the `setup`
function that should return a list of `Binding` definitions.

```ts
// options defintion
type DefineComponentOptions<
  P extends Record<string, PropTypeDefinition>,
  R extends Record<string, ComponentRefItem>
> = {
  name: string;
  props?: P;
  refs?: R;
  setup: (
    props: TypedProps<P>,
    refs: TypedRefs<R>,
    context: { element: HTMLElement },
  ) => undefined | null | Array<Binding>;
};
```

The return type of the `defineComponent` is the object that your application will interact with,
since it's the thing that will be exported from your source file.

If you call it with an HTML element that has a `data-component` attribute that matches up with the
component's configured name, it will create a component instance and returns an "instance API" to
interact with.

```ts
// Factory return definition
type ComponentFactory =
  // the "constructor" function, returning the "instance API"
  ( element: HTMLElement) => {
    // component name on the instance
    readonly name: string;
    // API to update the component props from the outside
    setProps: (props: P) => void;
    // object to read the component props
    readonly props: P;
    // reference to the component's HTML element
    readonly element: HTMLElement;
    // a dispose function, if you want to manually remove this component
    // otherwise it will automatically get disposed when removing the HTML element from the DOM
    dispose: () => void;
  } 
  // and the display name available on the function
  & { displayName: string };
```

A simple usage would look like this:

```ts
// usage
defineComponent({
  name: 'my-component',
  props: {
    activeIndex: { type: Number, default: 0 }, 
  },
  refs: {
    container: { type: 'element', ref: 'container', optional: true},
  },
  setup({ props, refs, element }) {
    return [
      bind(refs.container, { text: props.activeIndex }),
    ];
  }
});
```

### props

```ts
// props definition
type PropTypeDefinition<T = any> = {
  // the property type, used to convert the property to the right datatype
  type: typeof Number | typeof String | typeof Boolean | typeof Date | typeof Array | typeof Object | typeof Function;
  // an optional default value for when the property is not available
  default?: T extends Primitive ? T : () => T;
  // an optional predicate that will reject the prop if not valid
  validator?: Predicate<T>;
  // when present, mark this prop as optional, so it doesn't have to be available in the HTML
  isOptional?: boolean;
  // when present, mark this prop as potentially having a missing value, typing it as `| undefined`
  missingValue?: boolean;
  // provide the shape of any prop when it's a function
  shapeType?: Function;
};
```

Luckily there are helper functions available to easily define the properties without having to
provide these objects yourself.

You can find more info at the [Props API](./props.md)

### refs

```ts
// refs definition
type ComponentRefItem =
  // shortcut for element ref
  | string
  | {
      // different refs have their own type, to execute slightly different logic on them
      type: 'element' | 'collection' | 'component' | 'componentCollection';
      // the value of the `data-ref` attribute on the html element(s)
      ref: string;
      // only used for element/component, and when true, it will log an error if the element
      // doesn't exist in the DOM. Nothing will break, it's just that the bindings will not
      // be executed  
      isRequired?: boolean;
      // A function that will find the right HTMLElement(s) that should be used for the refs.
      // When `type` is element or component, it returns a single HTMLElement or null.
      queryRef: (parent: HTMLElement) => HTMLElement | null | Array<HTMLElement>;
}
```

Luckily there are helper functions available to easily define the refs without having to provide
these complex objects yourself.

You can find more info at the [Refs API](./refs.md)

### setup

::: warning Readonly 
The `props` object passed to the `setup` function is **readonly**, so it cannot be used to
communicate back to the parent component or as initial state.
:::

### lifecycle

[See hooks](./hooks.md)

### bindings

## lazy

Allows async loading of components when they are actually used, to be used in the
`components` option of `defineComponent`.

```ts
declare function lazy(
  displayName: string,
  getComponent: () => Promise<{ lazy: { component: ComponentFactory } }>,
): () => Promise<ComponentFactory>;
```

See below for how to use it, and what makes it tick.

```ts
// in the component that you want to lazy load
import { supportLazy } from '@muban/muban';

export const lazy = supportLazy(MyLazyComponent);
```
```ts
// in your "parent" component
import { defineComponent, lazy } from '@muban/muban';

defineComponent({
  name: 'main',
  components: [
    // sync
    SomeSyncComponent,
    // lazy async
    lazy('my-lazy-component', () => import(/* webpackExports: "lazy" */ './MyLazyComponent'))
  ],
  setup() {
    return [];
  }
});
```

::: tip lazy export
To make importing lazy components consistent, we require a `lazy` export with a set structure.
Using the `supportLay` helper makes sure it can be properly imported. 
:::

::: tip `'my-lazy-component'`
To know if the component should be loaded, the first `'my-lazy-component'` is needed to detect
any `data-component` usages in the HTML. Only then the component is actually loaded.
:::

::: tip webpackExports
The `/* webpackExports: "lazy" */` comment is needed to _only_ leave the lazy component
in the code-splitted bundle. Any other exports like templates will be stripped out that way.

**Note** This is a webpack 5 feature. If you can't use webpack 5 yet and care about bundle size,
consider splitting up your templates and component code into separate files.
:::

