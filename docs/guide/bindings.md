# Bindings

Since we're not rendering the full DOM from our components - we make existing HTML interactive - but
do want a way to easily update some HTML whenever our component's state changes, we've added
`bindings` as a feature in Muban - heavily inspired by [Knockout.js](https://knockoutjs.com/documentation/).

As a concept, a component follows this flow:

1. In your **template**, "tag" all elements you want to use in your JS with `data-ref` attributes.

2. In your **component definition**, specify these `data-ref` id's, combined with the ref type you
 want to use them at (element, collection, component, etc).
3. Set up your initial **component state** using `ref` and `reactive` data structures.
4. Define your **bindings**, linking up the configured `refs` with your component state.
5. Whenever any of the component state **updates**, our bindings automatically update the HTML
 accordingly - or visa versa, when user interacts with the HTML, the component state updates. 

As an example, the important parts of this flow are:

```ts{7-8,11-12,15-18}
export default defineComponent({
  name: 'toggle-expand',
  props: {
    isExpanded: propType.boolean.validate(optional(isBoolean)),
  },
  refs: {
    expandButton: refElement('expand-button'),
    expandContent: 'expand-content',
  },
  setup({ props, refs }) {
    const [isExpanded, toggleExpanded] = useToggle(props.isExpanded ?? false);
    const expandButtonLabel = computed(() => getButtonLabel(isExpanded.value));

    return [
      bind(refs.expandButton, { text: expandButtonLabel, click: () => toggleExpanded() }),
      bind(refs.self, {
        css: { isExpanded },
      }),
    ];
  },
});
```

The setup function should return an array of bindings, and the different binding helpers return
those definitions.

All binding helpers should at least receive a ref item - the DOM element to bind to - and a set
of properties. What those properties are, depends on the binding helper called, and the ref item
you have passed.

## Binding helpers

Let's go over the different binding helpers we have, `bind`, `bindMap` and `bindTemplate`.

### bind

```ts
bind(anyRef, props)
```

The `bind` helper works for all refs that you give it, and has 2 modes:
1. For DOM refs, it will accept the DOM bindings
2. For Component refs, it will accept the exposed component props

When passing a collection of either one, it will apply the bindings to all items in the collection.


#### DOM bindings

TODO

**Example**

```ts
// bind to a DOM element
bind(refs.button, {
  click: () => console.log('clicked'),
  text: computed(() => isLoading.value ? 'loading...' : 'submit')
})
```

::: tip API
Read more on the [DOM bindings API](../api/bindings.html#dom-bindings) page.
:::

#### Component bindings

TODO 

**Example**

```ts
// bind to a component, setting props or passing callbacks
bind(refs.filter, {
  // selectedIndex is the name of the component prop, but also a reactive `ref`
  selectedIndex,
  onChange: (newValue) => setNewValue(newValue),
})
```

::: tip API
Read more on the [Component bindings API](../api/bindings.html#component-bindings) page.
:::

### bindMap

```ts
bindMap(refCollection, (ref?, index?) => props)
```

The `bindMap` helper is specifically designed for ref collections that require slightly
different binding values for each of the items within the collection.

Instead of accepting a props-object directly, it expects a function that returns those props,
passing the individual item ref and its index in the collection as parameters.

**Example**

```ts
// bind to multiple dom elements
bindMap(refs.items, (ref, index) => ({
  // use the `index` in each individual binding
  css: computed(() => ({ active: index === selectedIndex.value })),
  click: () => (selectedIndex.value = index),
}))

// bind to multiple components, setting props or passing callbacks
bindMap(refs.slides, (ref, index) => ({
  onChange: (isExpanded) => {
    activeIndex.value = isExpanded ? index : null;
    // you could use `ref.component?.props` to access the individual component's props
  },
  expanded: computed(() => activeIndex.value === index),
}))
```

### bindTemplate

```ts
bindTemplate(refContainer, onUpdate, { extractConfig?, forceImmediateRender? })
```

The `bindTemplate` is slightly different from the ones above, and is specifically designed to
control the complete content of a DOM element by rendering templates client-side - getting as close
to a SPA as we get in Muban.

Besides the container ref, have to pass an update function that returns the output to be placed 
in the DOM. Any observables that are referenced in the `onUpdate` functions will be watched, and 
when they change, the `onUpdate` will be called again to update the container with new HTML.

Optionally, you can pass some configuration to extract existing HTML from the server-rendered
template, to populate your observable as initial data.

By default, muban will detect if an initial render is needed by checking if the container 
element is empty or not – if there is already HTML in it, the initial render is omitted.
If you do want to do an initial render based on changed client-side information, you can pass
`forceImmediateRender` as `true`.

::: tip Note
Keep in mind that this binding completely removes and replaces the HTML on the page with what has
been passed in your components.
:::

**Example**

```ts
return [
  
  // set up a template binding
  bindTemplate(
    // control the contents of this container, clearing it on each re-render
    refs.productsContainer,
    // render this template each time when the used observables update
    (onlyWatch) => filteredProducts.value.map(item => renderItem(item)),
    {
      // optionally extract any exiting data from the HTML that was rendered on the server
      extract: { config: extractConfig, onData: (products) => productData.push(...products) },
      // by default muban will check if the container is empty from the server, and ignore updating
      // it initially when it's not. Set this to true if you want to update the initial HTML anyway.
      forceImmediateRender: true,
    },
  ),

]
```

::: tip html-extract-data
The data extraction makes use of the [html-extract-data](https://www.npmjs.com/package/html-extract-data)
npm module, check their documentation to all the possibilities and configuration.
:::

## Reactivity tips

::: tip Reactive bindings
The binding are just set up once, and they rely on passing the reactive state to do their updates.
So make sure to always pass a reference, never a primitive.
:::
