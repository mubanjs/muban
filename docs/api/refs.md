# Refs

Refs have two stages, the definitions - which go inside your component definition, and the resolved
refs - which you receive in your setup function.

### Ref definition

The shape of the definition that you pass to the component is the following:

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
    }
```

If you don't want to pass this by hand, you can make use of the available helper functions

## refElement

`refElement` selects a single DOM element that has the `data-ref` attribute set.

```ts
declare function refElement(
  refId: string,
  options?: { isRequired?: boolean },
): ComponentRefItemElement;
```

By default, all refs are marked as required, and will log errors in the console when they cannot
be found. If elements are optional, you can set `isRequired` to `false, and by doing that, the type
becomes optional as well.

::: tip Shortcut
Passing `'string'` is a quick shortcut for `refElement('string')`.
:::

**Example**

<code-group>
<code-block title="Component">
```ts{4-6}
defineComponent({
  // ...
  refs: {
    shortcut: 'single-element',
    requiredElement: refElement('single-element'),
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

## refCollection

`refCollection` selects one or more DOM elements that have the `data-ref` attribute set. If no
elements are found, the collection will be empty.

```ts
declare function refCollection(refId: string): ComponentRefItemCollection;
```

In the `setup` function, a collection can be used to apply the same binding to multiple items,
or to loop over in a mapping function and specify a different binding based on each individual
element or index in the collection.

**Example**

<code-group>
<code-block title="Component">
```ts{4}
defineComponent({
  // ...
  refs: {
    items: refCollection('item'),
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

## refComponent

`refComponent` selects a single DOM element that either has the `data-component` attribute match
the one from the passed Component, or has the `data-ref` attribute set when that is provided in
the options.

After selecting the DOM element, it will create a new component instance for that element.

```ts
declare function refComponent(
  component: ComponentFactory,
  options?: { ref?: string; isRequired?: boolean },
): ComponentRefItemComponent;
```


By default, all refs are marked as required, and will log errors in the console when they cannot
be found. If elements are optional, you can set `isRequired` to `false, and by doing that, the type
becomes optional as well.

If you only have a single child component of the passed type, providing a `ref` is optional, since
it just select that one component based on the `data-component` attribute.

However, if you have multiple instance of the same child component, and want to target each one
individually (e.g. having multiple buttons that need different bindings), you have to use the
`data-ref` attribute to make each one uniquely targetable.

**Example**

<code-group>
<code-block title="Component">
```ts{4-9}
defineComponent({
  // ...
  refs: {
    // there is just one button
    requiredComponent: refComponent(Button),
    optionalComponent: refComponent(Button, { isRequired: false }),
    // there are multiple buttons, target specific one
    acceptButton: refComponent(Button, { ref: 'accept-button' }),
    cancelButton: refComponent(Button, { ref: 'cancel-button', isRequired: false }),
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

## refComponents

`refComponents` selects one or more DOM elements that either have the `data-component` attribute
match the one from the passed Component, or have the `data-ref` attribute set when that is
provided in the options. If no elements are found, the collection will be empty.

After selecting the DOM elements, it will create a new component instance for each of them.

```ts
declare function refComponents(
  component: ComponentFactory,
  options?: { ref?: string},
): ComponentRefItemComponentCollection;
```

If all the components in the dom are the ones you want to query, providing a `ref` is optional,
since it just select those components based on the `data-component` attribute.

However, if you have other instances of that components that you don't want in this collection,
you have to use the `data-ref` attribute to target the ones you want specifically.

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
