# Bindings

## Binding Factories

Binding factories are helper functions to create the binding definitions that must be returned
from the component's `setup` function. These definitions are later used to apply these bindings
when the component is mounted, or when any of the reactive data changes.

While it is technically possible to manually create those binding definitions yourself, these
binding factories make sure the correct information is passed, and is fully typed based on the ref
you provide as the first parameter.

### bind

`bind` lets you update any selected ref (element or component, single or collection) to any data,
making sure it updates automatically whenever the data changes.

If you bind to a collection, each item in the collection will receive the same bindings.

```ts
declare function bind(
  target: AnyRef,
  props: BindProps | ComponentSetPropsParam<ComponentApi>,
): Binding;
```

If you want more control over the bindings for each individual item in a collection, you can use
the [`bindMap`](#bindmap) function.

Bindings to elements use [DOM bindings](#dom-bindings). Bindings to components use the
[Component bindings](#component-bindings) to update its props.

::: warning
Make sure your bindings stay reactive by passing a reactive `ref`, or by wrapping
it in a `computed` when accessing the direct values or any `reactive` object.
:::

**Example**

```ts
return [

  // bind to a DOM element
  bind(refs.button, {
    click: () => console.log('clicked'),
    text: computed(() => isLoading.value ? 'loading...' : 'submit')
  }),

  // bind to a component, setting props or passing callbacks
  bind(refs.filter, {
    // selectedIndex is the name of the component prop, but also a reactive `ref`
    selectedIndex,
    onChange: (newValue) => setNewValue(newValue),
  }),

]
```

### bindMap

```ts
declare function bindMap(
  target: CollectionRef | ComponentsRef,
  getProps: (ref: ElementRef | ComponentRef, index: number) => 
    BindProps | ComponentSetPropsParam<ComponentApi>,
): Array<Binding>;
```

**Example**

```ts
return [

  // bind to multiple dom elements
  ...bindMap(refs.items, (ref, index) => ({
    // use the `index` in each individual binding
    css: computed(() => ({ active: index === selectedIndex.value })),
    click: () => (selectedIndex.value = index),
  })),

  // bind to multiple components, setting props or passing callbacks
  ...bindMap(refs.slides, (ref, index) => ({
    onChange: (isExpanded) => {
      activeIndex.value = isExpanded ? index : null;
      // you could use `ref.component?.props` to access the individual component's props
    },
    expanded: computed(() => activeIndex.value === index),
  })),

]
```

### bindTemplate

```ts
declare function bindTemplate<P extends Record<string, unknown>>(
  target: ElementRef,
  data: Ref<P>,
  template: (props: P) => TemplateResult | Array<TemplateResult>,
  extract?: {
    config: any;
    onData: (data: any) => void;
  },
): Binding;
```

**Example**

```ts
return [
  
  // set up a template binding
  bindTemplate(
    // control the contents of this container, clearing it on each re-render
    refs.productsContainer,
    // this is the data being passed, keeping track of when it changes
    computed(() => ({ products: filteredProducts.value })),
    // render this template each time, passing the received data
    productList,
    {
      // optionally extract any exiting data from the HTML that was rendered on the server
      extract: { config: extractConfig, onData: (products) => productData.push(...products) },
      // configure if you want to update the UI based on client side template immediately,
      // or only when the data changes afterwards
      renderImmediate: true, // default = false
    },
  ),

]
```

::: tip html-extract-data
The data extraction makes use of the [html-extract-data](https://www.npmjs.com/package/html-extract-data)
npm module, check their documentation to all the possibilities and configuration.
:::

## DOM bindings

### text

The `text` binding sets the `textContent` property of the associated DOM element.

```ts
Ref<string>
```

**Examples**

```ts
const firstName = ref('John');
const lastName = ref('Doe');
const fullName = computed(() => `${firstName.value} ${lastName.value}`);

// pass a ref
bind(refs.firstName, { text: firstName });

// pas a computed (which is a ref)
bind(refs.fullName, { text: fullName });

// or inline
bind(refs.fullName, { text: computed(() => `${firstName.value} ${lastName.value}`) });
```

### html

The `html` binding sets the `innerHTML` property of the associated DOM element.

```ts
Ref<string>
```

**Examples**

```ts
const firstName = ref('<strong>John</strong>');
const lastName = ref('<em>Doe</em>');
const fullName = computed(() => `${firstName.value} ${lastName.value}`);

// pass a ref
bind(refs.firstName, { html: firstName });

// pas a computed (which is a ref)
bind(refs.fullName, { html: fullName });

// or inline
bind(refs.fullName, { html: computed(() => `${firstName.value} ${lastName.value}`) });
```

### css

The `css` binding adds or removes one or more CSS classes to the associated DOM element.

```ts
Ref<string> | Ref<Record<string, boolean>> | Record<string, Ref<boolean>>
```

**Examples**

```ts
const ballance = ref(10);
const isPositive = computed(() => ballance.value > 0);
const isNegative = computed(() => ballance.value < 0);

// sets either the `is-negative` or `is-positive` css class based on the ballance
bind(refs.item, { css: computed(() => ballance.value < 0 ? 'is-negative' : 'is-positive') });

// sets the classes if the respective value is truthy
bind(refs.item, { css: {
  'is-positive': isPositive,
  'is-negative': isNegative,
} });

// sets multiple classes at the same time when `isActive` ref value is truthy
bind(refs.fullName, { css: { 'foo bar': isActive } });
```

### style

The `style` binding sets the style properties of the associated DOM element, similarly to inline
styles.

```ts
Ref<Record<string, boolean>> | Record<string, Ref<boolean>>
```

**Examples**

```ts
const isActive = ref(true);

// sets the `display` style on either `block` or `none`
bind(refs.item, { style: {
  display: computed(() => isActive.value ? 'block' : 'none')
} });
```

### attribute

The attribute binding sets the attributes of the associated DOM element.

```ts
Ref<Record<string, Ref<any>>
```

**Examples**

```ts
const isActive = ref(true);

// sets the `disabled` style on either `true` or `false`
bind(refs.item, { attr: {
  disabled: computed(() => isActive.value),
} });
```

### click

The `click` binding calls the passed callback whenever the user clicks on the associated DOM element.

```ts
(event: HTMLElementEventMap['click']) => void;
```

**Examples**

```ts
// executes the callback whenever clicked
bind(refs.item, { click: (event) => console.log(event.currentTarget) });

// if your function expects the `event` as the first parameter, or has no parameters, you can
// just pass it directly
bind(refs.item, { click: toggleActive });
```

### checked

The `checked` binding is a two-way binding, connecting the state with the associated checkbox
or radio button DOM element.

```ts
Ref<boolean | Array<string>>
```

If passed a single `boolean` value, it will sync the passed `ref` and the `checked ` state of the
element, updating one if the other changes.

If passed an `Array`, it will add or remove the item in that array that corresponds with the `value`
attribute of the DOM element. If the checkbox is checked, it will add the item with that value,
and when unchecked, it will remove it from the array again. Or when the array updates, it will
check or uncheck the DOM element depending on the presence in the array.  

**Examples**

```ts

const isSelected = ref(false);
const selectedItems = ref(['foo']);

// binds the `isSelected` with the `accept` checkbox, and updates the other if one of them changes
bind(refs.accept, { checked: isSelected });

// initially selects the checkbox that has `foo` as value, and will update the array whenever
// toggling any of the checkboxes in the collection. Or updating the checkboxes if the array changes.
bind(refs.checkboxes, { checked: selectedItems });

```

## registerDomBinding

`registerDomBinding` and the `DomBindings` allow you to add your own DOM bindings to Muban without
having to dig into the Muban code itself.

```ts
declare function registerDomBinding(
  name: string,
  fn: (target: HTMLElement, value: any) => void | (() => void),
): void
```

If you have created your binding function - which always receives a `target` (the DOM element 
your binding is added to) and a `value` (that you pass in your component) - you just simple 
register it through `registerDomBinding` with the proper binding name, and update the `DomBindings`
interface to add it to the types.

After that, you can use this new binding in any component you write in your project.

```ts
// your binding function
const debugBinding = (target: HTMLElement, value: any | Ref<any>) => {
  // return the dispose function returned by watchEffect so your binding gets cleaned up properly
  return watchEffect(() => {
    console.log('[debug]', unref(value));
  });
};

// register it so you can use it in your `bind` functions
registerDomBinding('debug', debugBinding);

// update the DomBindings interface so it's available in your `bind` functions
declare global {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface DomBindings {
    debug: typeof debugBinding;
  }
}
```

```ts
defineComponent({
  setup({ refs }) {
    const isActive = ref(false);
    return [
      bind(refs.button, {
        click: () => isActive.value = !isActive.value,
        // this will log the value each time it changes
        debug: isActive,
      })
    ]
  }
})
```

## Component bindings

Component bindings will set the props of the targeted component(s) whenever the related state
changes. The allowed props are typed based on the component attached to the passed ref.

```ts
ComponentSetPropsParam<ComponentApi>
```

This is useful for two main use cases:

1. Update child component props whenever state in the parent changes. This will let the parent
 component control the child component.
2. Passing callback functions to listen to changes in the child component. These mostly apply to
 any user interaction that can happen in child component that deals with the intricate logic there,
 and updates the parent component with just the information it needs when it's needed.

**Example**

```ts
// the `filter` component has an `onChange` prop that gets executed when a filter changes
// passing the filter id and filter value
bind(refs.filter, {
  onChange: (filter, value) => {
    const activeFilter = activeFilters.find((f) => f.id === filter);
    if (activeFilter) {
      activeFilter.active = value;
    }
  }
});

// the `items` components have an `onChange` prop that gets called when any of the items change,
// and an `expanded` prop to dictate of the slide should be expanded
// they use the `index` prameter in the "loop" to use in each prop binding
...bindMap(refs.items, (ref, index) => ({
  onChange: (isExpanded) => {
    activeIndex.value = isExpanded ? index : null;
  },
  expanded: computed(() => activeIndex.value === index),
}));
```

::: tip Callback bindings
Callback bindings are usually **not reactive**, since you only have to specify them once, and child
components can just call them whenever needed.
:::

::: tip Reactive prop bindings
Other prop bindings should be **reactive**, since you want to update these props whenever something
changes in your parent component. In turn, the child component can use `watch` or `watchEffect` to
listen to changes on any of these props, and in turn update their internal state or bindings.
:::
