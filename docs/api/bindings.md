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
    // optionally extract any exiting data from the HTML that was rendered on the server
    { config: extractConfig, onData: (products) => productData.push(...products) },
  ),

]
```

::: tip html-extract-data
The data extraction makes use of the [html-extract-data](https://www.npmjs.com/package/html-extract-data)
npm module, check their documentation to all the possibilities and configuration.
:::

## DOM bindings

### text

### html

### css

### style

### attr

### click

### checked

## Component bindings
