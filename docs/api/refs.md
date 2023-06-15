# Refs

Refs have two stages, the definitions - which go inside your component definition, and the resolved
items - which you receive in your setup function, and use for bindings.

## Ref definition

The shape of the definition that you pass to the component is the following:

```ts
// refs definition
type ComponentRefItem =
  // shortcut for element ref, will internally be turned into a `refElement()`
  | string
  | {
      // Different refs have their own type, to execute slightly different logic on them.
      type: 'element' | 'collection' | 'component' | 'componentCollection';
      // The value of the `data-ref` attribute on the html element(s).
      ref: string;
      // Only used for element/component, and when true, it will log an error if the element
      // doesn't exist in the DOM. Nothing will break, it's just that the bindings will not
      // be executed.
      isRequired?: boolean;
      // A function that will find the right HTMLElement(s) that should be used for the refs.
      // When `type` is element or component, it returns a single HTMLElement or null.
      queryRef: (parent: HTMLElement) => HTMLElement | null | Array<HTMLElement>;
    }
```

However, you would never pass this by hand, but instead make use of the available helper 
functions described below.

**ignoreGuard**

By default, only refs directly within a component can be selected. Refs from child components 
are not accessible. All `ref` functions have an `ignoreGuard` option.

When setting `ignoreGuard` to true, it disables the guarding behaviour, and allows 
you to query any ref.

### refElement

`refElement` selects a single DOM element that has the `data-ref` attribute set.

```ts
declare function refElement(
  refIdOrQuery: string | ((parent: HTMLElement) => HTMLElement | null),
  options?: {
    isRequired?: boolean;
    ignoreGuard?: boolean;
  },
): ComponentRefItemElement;
```

#### refIdOrQuery

`refId: string`

`refQuery: (parent: HTMLElement) => HTMLElement | null)`

When passing a `string`, it's the value of the `data-ref` attribute on one of the HTMLElements 
in the DOM.

When passing a `function`, you can query your elements by using `parent.querySelector(...)` to 
return a single element. 

Any elements that are queried are filtered against the component guard unless `options.
ignoreGuard` is set to `true`.

#### options.isRequired

`isRequired?: boolean = true`

By default, all refs are marked as **required**, and will log errors in the console when they cannot
be found. If elements are optional, you can set `isRequired` to `false`, and by doing that, the type
becomes optional as well.

#### options.ignoreGuard

`ignoreGuard?: boolean = false`

When set to `true`, it disables the guarding behaviour, and allows you to query any ref of any child 
component.


**Example**

<code-group>
<code-block title="Component">
```ts{4-9}
defineComponent({
  // ...
  refs: {
    // the easiest way to use this, when not providing options
    shortcut: 'single-element',
    // being more explicit, by default ref is required
    requiredElement: refElement('single-element'),
    // making this ref optional
    optionalElement: refElement('single-element', { isRequired: false }),
  },
  // ...
})
```
</code-block>

<code-block title="Template">
```html{2}
<div>
  <div data-ref="single-element">item</div>
</div>
```
</code-block>
</code-group>


::: tip Shortcut
Passing `'string'` is a quick shortcut for `refElement('string')`.
:::

### refCollection

`refCollection` selects one or more DOM elements that have the `data-ref` attribute set. If no
elements are found, the collection will be empty.

```ts
declare function refCollection(
  refIdOrQuery: string | ((parent: HTMLElement) => Array<HTMLElement>),
  options?: {
    minimumItemsRequired?: number;
    ignoreGuard?: boolean;
  },
): ComponentRefItemCollection;
```

In the `setup` function, a collection can be used to apply the same binding to multiple items,
or to loop over in a mapping function and specify a different binding based on each individual
element or index in the collection.


#### refIdOrQuery

`refId: string`

`refQuery: (parent: HTMLElement) => Array<HTMLElement>)`

When passing a `string`, it's the value of the `data-ref` attribute on one or multiple HTMLElements
in the DOM.

When passing a `function`, you can query your elements by using `parent.querySelectorAll(...)` 
to return one or multiple elements.

Any elements that are queried are filtered against the component guard unless `options.
ignoreGuard` is set to `true`.

#### options.minimumItemsRequired

`minimumItemsRequired?: number = 0`

By default, the returned collection can be empty, and is thus optional by default. By setting
`minimumItemsRequired` to a specific value, an error is thrown when the collection contains fewer 
items. 

#### options.ignoreGuard

`ignoreGuard?: boolean = false`

When set to `true`, it disables the guarding behaviour, and allows you to query any ref of any child
component.


**Example**

<code-group>
<code-block title="Component">
```ts{4-7}
defineComponent({
  // ...
  refs: {
    // select all `data-ref=item`, the resulting collection contains 0 or more items
    items: refCollection('item'),
    // expect at least 3 items to be available in the DOM, otherwise an error is thrown
    items: refCollection('item', { minimumItemsRequired: 3 }),
  },
  // ...
})
```
</code-block>

<code-block title="Template">
```html{3-5}
<div>
  <ul>
    <li data-ref="item">item 1</li>
    <li data-ref="item">item 2</li>
    <li data-ref="item">item 3</li>
  </ul>
</div>
```
</code-block>
</code-group>

### refComponent

`refComponent` selects a single DOM element that either has the `data-component` attribute match
the one from the passed Component, or has the `data-ref` attribute set when that is provided in
the options.

After selecting the DOM element, it will create a new component instance for that element.

```ts
declare function refComponent(
  component: ComponentFactory | Array<ComponentFactory>,
  options?: {
    ref: string | ((parent: HTMLElement) => HTMLElement | null);
    isRequired?: boolean;
    ignoreGuard?: boolean;
  },
): ComponentRefItemComponent;
```

#### component

`component: ComponentFactory | Array<ComponentFactory>`

One or multiple components that will be created for this ref. In addition to almost all HTML 
bindings, a component ref also allows you to bind against child component props, updating their
values when things change, or providing callback functions that can be called.

If `options.refIdOrQuery` is not passed, it will search for the first occurrence of the 
`data-component` matching the passed component(s).

If you pass an `Array` of multiple components, it will use the first one it finds. The most 
common use case is by having one element with a specific `data-ref` that should match one of the 
passed components.

When doing that, only the component props that exists on all the passed components can be used 
to bind against.

#### options.ref

`ref: string`

`ref: (parent: HTMLElement) => HTMLElement | null)`

If you have multiple component elements, and the ref should target a specific one, the 
`ref` can be used. Or if you just want to be more strict about things, to make sure it 
doesn't break in the future. Otherwise, if you just have a single child component, you can omit 
the ref, and it still will be able to find the element based on the `data-component` attribute.

When passing a `string`, it's the value of the `data-ref` attribute on one of the HTMLElements
in the DOM.

When passing a `function`, you can query your elements by using `parent.querySelector(...)` to
return a single element.

Any elements that are queried are filtered against the component guard unless `options.
ignoreGuard` is set to `true`.

Any elements that are queried are also filtered with the `data-component` attribute against the 
`displayName` of the passed `ComponentFactory`.


#### options.isRequired

`isRequired?: boolean = true`

By default, all refs are marked as **required**, and will log errors in the console when they cannot
be found. If elements are optional, you can set `isRequired` to `false`, and by doing that, the type
becomes optional as well.

#### options.ignoreGuard

`ignoreGuard?: boolean = false`

When set to `true`, it disables the guarding behaviour, and allows you to query any ref of any child
component.


**Example**

<code-group>
<code-block title="Component">
```ts{4-16}
defineComponent({
  // ...
  refs: {
    // there is just one button
    requiredComponent: refComponent(Button),
    optionalComponent: refComponent(Button, { isRequired: false }),
    // there are multiple buttons, target specific one
    acceptButton: refComponent(Button, { ref: 'accept-button' }),
    cancelButton: refComponent(Button, { ref: 'cancel-button', isRequired: false }),
    // the component can either be a Button or a Link
    someButton: refComponent([Button, Link], { ref: 'some-button' }),
    // select the icon _inside_ the Button, using a custom querySelector and the ignoreGuard
    buttonIcon: refComponent(Icon, {
      ref: parent => parent.querySelector('[data-ref="some-button"] [data-ref="icon"]'),
      ignoreGuard: true,
    }),
  },
  // ...
})
```
</code-block>

<code-block title="Template">
```html{2-4}
<div>
  <button data-component="button">click me</button>
  <button data-component="button" data-ref="accept-button">accept</button>
  <button data-component="button" data-ref="cancel-button">cancel</button>
</div>
```
</code-block>
</code-group>

### refComponents

`refComponents` selects one or more DOM elements that either have the `data-component` attribute
match the one from the passed Component, or have the `data-ref` attribute set when that is
provided in the options. If no elements are found, the collection will be empty.

After selecting the DOM elements, it will create a new component instance for each of them.

```ts
declare function refComponents(
  component: ComponentFactory,
  options?: {
    ref: string | ((parent: HTMLElement) => Array<TMLElement>);
    minimumItemsRequired?: number;
    ignoreGuard?: boolean;
  },
): ComponentRefItemComponentCollection;
```

#### component

`component: ComponentFactory`

The component that will be created for this ref. In addition to almost all HTML bindings, a 
component ref also allows you to bind against child component props, updating their values when 
things change, or providing callback functions that can be called.

If `options.ref` is not passed, it will search for the first occurrence of the
`data-component` matching the passed component.

#### options.ref

`ref: string`

`ref: (parent: HTMLElement) => HTMLElement | null)`

If you have multiple component elements, and the ref should target specific ones, the
`ref` can be used. Or if you just want to be more strict about things, to make sure it
doesn't break in the future. Otherwise, if you just want to target all elements of this component, 
you can omit the ref, and it still will use all element based on the `data-component` attribute.

When passing a `string`, it's the value of the `data-ref` attribute on the HTMLElements in the DOM.

When passing a `function`, you can query your elements by using `parent.querySelectorAll(...)` to
return multiple elements.

Any elements that are queried are filtered against the component guard unless `options.
ignoreGuard` is set to `true`.

Any elements that are queried are also filtered with the `data-component` attribute against the
`displayName` of the passed `ComponentFactory`.

#### options.minimumItemsRequired

`minimumItemsRequired?: number = 0`

By default, the returned collection can be empty, and is thus optional by default. By setting
`minimumItemsRequired` to a specific value, an error is thrown when the collection contains fewer
items.

#### options.ignoreGuard

`ignoreGuard?: boolean = false`

When set to `true`, it disables the guarding behaviour, and allows you to query any ref of any child
component.

**Example**

<code-group>
<code-block title="Component">
```ts{4-6}
defineComponent({
  // ...
  refs: {
    allCards: refComponents(Card),
    heroCards: refComponent(Card, { ref: 'card-hero' }),
    normalCards: refComponent(Card, { ref: 'card-normal' }),
  },
  // ...
})
```
</code-block>

<code-block title="Template">
```html{2-4,6-8}
<div>
  <div data-component="card" data-ref="card-hero">hero card 1</div>
  <div data-component="card" data-ref="card-hero">hero card 2</div>
  <div data-component="card" data-ref="card-hero">hero card 3</div>
  
  <div data-component="card" data-ref="card-normal">card 1</div>
  <div data-component="card" data-ref="card-normal">card 2</div>
  <div data-component="card" data-ref="card-normal">card 3</div>
</div>
```
</code-block>
</code-group>

## Ref item

Ref items are "container objects" around the resolved ref definitions to be used in the `setup`
function of the component.

They are mainly used in the different binding helpers, but contains some additional information
about the specific refs that could be useful in some situations.

The `type` of each `ref` is inferred from the input you pass, so the properties you can access
is different between elements and components, or single items vs collections.

The public API for each type of ref can be seen below (note that some internal fields have been
 omitted here).

```ts
type ElementRef = {
  element: HTMLElement | undefined;
};

type CollectionRef<> = {
  // this is a function, and has refs inside, so causes `watch` or `watchEffect` to re-execute 
  // when the DOM updates and the items inside the collection change 
  getElements: () => Array<HTMLElement>;
  // nested refs for each single individual element
  getRefs: () => Array<ElementRef>;
};

type ComponentRef = {
  component: ComponentApi | undefined;
};

type ComponentsRef = {
  // this is a function, and has refs inside, so causes `watch` or `watchEffect` to re-execute 
  // when the DOM updates and the items inside the collection change 
  getComponents: () => Array<ComponentApi>;
  // nested refs for each single individual component
  getRefs: () => Array<ComponentRef>;
};
```

As you can see, all 4 have a reference to the actual item(s) that they have selected as `element`, 
`getElements()`, `component` or `getComponents()`. The two collection refs have access to the 
"item" `refs`, a list of "container refs" around each item in the collection, which could be 
useful when applying  the individual bindings to each item.

**Example**

```ts
defineComponent({
  refs: {
    singleElement: refElement('single-element'),
    elementCollection: refCollection('element-collection'),
    singleComponent: refElement(Component, 'single-element'),
    componentCollection: refElement(Component, 'element-collection'),
  },
  setup({ props, refs }) {
    refs.singleElement.element; // HTMLElement
    refs.elementCollection.getElements(); // Array<HTMLElement>

    refs.singleComponent.component; // ComponentApi
    refs.singleComponent.component.props; // Access the component props, useful for intial state
    refs.componentCollection.getComponents(); // Array<ComponentApi>
    
    return [
      bind(refs.singleElement, { text: 'label' }), // bind to single element
      bind(refs.elementCollection, { text: 'label' }), // bind to all elements in the collection
      
      // bind to each ref individually
      ...refs.elementCollection.refs.map((ref, index) => bind(ref, { text: `item ${index}` })),
      // but simpler
      ...bindMap(refs.elementCollection, (ref, index) => ({ text: `item ${index}` })),
      

      // bind to single component, or to all components int the collection
      bind(refs.component, { someProps: 'value', onSomethingHappens: () => console.log('Yo') }),
      bind(refs.elementCollection, { someProps: 'value', onSomethingHappens: () => console.log('Yo') }),
      
      // bind to each ref individually
      ...refs.singleComponent.refs.map((ref, index) => bind(ref, { itemIndex: index })),
      // but simpler
      ...bindMap(refs.componentCollection, (ref, index) => ({ itemIndex: index })),
    ];
  },
});
```

## Wrapper component

Wrapper Components can be described as components that render content that is passed down from above, and is owned by a parent.

Examples are:

- A Form wrapper
- Content components, like Tabs, Accordions, Carousels, etc
- Layout components
- Context components

```html
<div data-component="my-component">
  <div data-component="some-wrapper">
    <span data-ref="foo">label</span>
  </div>
</div>
```

In this example, the `data-ref="foo"` wants to be managed by `the data-component="my-component"`, but `data-component="some-wrapper"` is in the way (unless ignoreGuard is passed).

To indicate `data-component="some-wrapper"` as a wrapper use the `data-wrapper-boundary`attribute

```html
<div data-component="my-component">
  <div data-component="some-wrapper" data-wrapper-boundary>
    <span data-ref="foo">label</span>
  </div>
</div>
```

Marking a component as wrapper make its "children" resolve to its parent.

```html
<div data-component="my-component">
  <div data-component="some-wrapper" data-wrapper-boundary>
    <div data-component="some-wrapper-2" data-wrapper-boundary>
      <div data-component="some-wrapper-3" data-wrapper-boundary>
        <span data-ref="foo">label</span>
      </div>
    </div>
  </div>
</div>
```

In this example, the `data-ref="foo"` will be managed by `data-component="my-component"`, the three surrounding wrappers will be skipped
