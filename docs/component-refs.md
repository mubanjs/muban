# component-refs

This document explores how to select elements from the DOM that are needed in your component code.

In muban, components are mounted on existing DOM elements, instead of the component rendering it itself. This means that
in order to interact with the DOM, the component needs access to those DOM elements. The most simple way is just use
`querySelctor` on the component element; `element.querySelector('.child-item')`.

While the above works fine for basic scenarios, we can do a lot of things to improve the Developer Experience.

## Scoping

In general, a component should only interact with the DOM within its own scope - not above it, and not in the DOM of its
child components. This means that `querySelector`/`querySelectorAll` should always be called on the element, or a child
DOM element thereof. But, it should not select anything into a child component. These restrictions and boundaries can
be enforced when query-selection happens through a util function. For example;

```js
function select(query) {
  // forces selection on the component element, never higher
  const item = element.querySelector(query);

  // check if one of the parents of the selected item (up until the own element) is a component
  if (getParents(item, element).some(el => Boolean(el.dataset.component))) {
    throw new Error('Cannot select within child component boundaries');
  } 
  return el;
}

select('.child-item');
```

## NodeList

When using `querySelectorAll`, a `NoteList` is returned, which is not an Array. There are ways to iterate over it, but
there are also things you can't do, but that people expect. While TypeScript guards against these situations, most
people will convert a `NodeList` into an `Array` most of the times, so it's something we can do ourselves already.

```js
const list = Array.from(element.querySelectorAll('.list.item'));
```

## Marking

How should we mark elements in the DOM that we want to select? Should we specifically mark them for JS interaction?
That might be more work, and would require more template updates when only the JS would need to change, but the intents
are more clear. A few options:

1. Using existing CSS `class`es
    ```html
    <ul class="list theme-foo">
        <li class="list-item active">foo</li>
        <li class="list-item">bar</li>
    </ul>
    ```
   Most elements have CSS classes applied anyway, so we can just re-use them.
   
2. using `js-`prefixed CSS classes
    ```html
    <ul class="list theme-foo js-list">
        <li class="list-item active js-list-item">foo</li>
        <li class="list-item js-list-item">bar</li>
    </ul>
    ```
   This makes it super clear that certain elements are linked to JS, so should not be (re)moved without changing the JS
   as well.
  
3. Using a `data-ref` attribute
    ```html
    <ul class="list theme-foo" data-ref="list">
        <li class="list-item active" data-ref="list-item">foo</li>
        <li class="list-item" data-ref="list-item">bar</li>
    </ul>
    ```
  Similar to the js-prefixes above, but moving it to a `data-`attribute, decoupling it from the CSS.
  
Reusing existing CSC classes might be easier and faster, but being more explicit about the intent allows for more
 features:
* auto-populating the component with all the refs in the DOM
* validation opportunities

However, being explicit comes with a few disadvantages:
* When selecting elements, should all element in the selection query contain the `js-` or `data-ref`? Conceptually they
  probably should, since that's the reason they are separated. This might mean they need to be added on more places.
* Using `data-ref` in selectors result in more typing (`.list .list-item` vs `[data-ref="list"] [data-ref="list-item
"]`). This step can be mitigated by only allowing data-ref values as an input array, and building the query ourselves).
* `data-ref`s are only useful if they are the only way to query something, and can be made unique enough to query what
  we want. The auto-populating feature above is only possible if refs are outputted in a way that their collection
  groupings are uniquely identified.

## Definition

Having the component specify which DOM elements are needed for your JS interaction allows for some nice features:

1. It moves query selection to a dedicated place in the component

2. It allows you to specify which elements are required for your JS to work, and which can be omitted in the HTML for
 different variations or use cases. Missing required elements could result in clear component errors, or used in tests
 to validate the CMS rendered HTML.

3. It allows the "refs" to become reactive, automatically executing the linked code once an optional element becomes
 available in the DOM.
 
4. It could allow to additionally select child components, being typed as such.

It could look something like this:

```typescript
defineComponent({
  refs: {
    // select a required list element
    list: required<HTMLUListElement>('.list'),
    // select a collection of list items, nested in the list element
    listItems: collection<HTMLLIElement>('.list', 'list'),

    // select an optional button element
    button: optional<HTMLButtonElement>('.button'),
    // select optional label element, is only selected when the 'button' exists
    buttonLabel: optional<HTMLSpanElement>('.button-label', 'button'),
    
    // select optional icon component
    icon: component.optional<Icon>('.icon', 'button'),
  },
  setup(props, refs) {
    // do something with refs
    bind(refs.button, {
      click: () => icon.setProp('name', 'expanded'),
    })
  }
});
```
```typescript
// the refs parameter in the setup is implicitly typed as:
type Props = {
  list: HTMLUListElement;
  listItems: Array<HTMLLIElement>;
  button?: HTMLButtonElement;
  buttonLabel?: HTMLSpanElement;
  icon?: ComponentWrapper<Icon>;
};
```

#### Only refs

Along with the `required` validation, we could also check if the `data-ref` value matches with the `refs.` key.

We might not even need the xpath selector string in the definition if we make sure our `data-ref` values are unique.
However, I don't think we can force that, an element with the same ref might show up in multiple places in the DOM if
it's used as dynamic partial, without being a child component:

```html
<div class="foo">
  <ul class="list theme-foo" data-ref="list">
    <li class="list-item active" data-ref="list-item">foo</li>
    <li class="list-item" data-ref="list-item">bar</li>
  </ul>
</div>
<div class="bar">
  <ul class="list theme-foo" data-ref="list">
    <li class="list-item active" data-ref="list-item">foo</li>
    <li class="list-item" data-ref="list-item">bar</li>
  </ul>
</div>
```

If we would automatically apply all `list` (as refs) instead of `.foo.list` (as selector), we would get both lists,
where we might want a specific one.
Similar with the `list-item` refs, it would group all of them in the same array.

If we don't interact with the `.foo` and `.bar` element, and only use them to make the query selection more specific,
I don't think we should force them to also have a `data-ref`.

We could "force" the HTML to always have unique refs in cases where we want to use them separately, and allow the setup
to become easier with less configuration. But it would require more strain on the template rendering, and passing data
down as context for possibly multiple levels. Then it could look like this:

```html
<div class="foo">
  <ul class="list theme-foo" data-ref="list-one">
    <li class="list-item active" data-ref="list-one-item">foo</li>
    <li class="list-item" data-ref="list-one-item">bar</li>
  </ul>
  <span data-ref="apply-button">
    <span data-component="icon">Apply</span>
    <span data-ref="apply-button-label">Apply</span>
  </span>
</div>
<div class="bar">
  <ul class="list theme-foo" data-ref="list-two">
    <li class="list-item active" data-ref="list-two-item">foo</li>
    <li class="list-item" data-ref="list-two-item">bar</li>
  </ul>
</div>
```
```typescript
defineComponent({
  refs: {
    // matches data-ref="list-one"
    listOne: required<HTMLUListElement>(),
    // matches data-ref="list-one-item" - but doens't feel good that the name is singular now: listOneItem (while it
    // are multiple items
    listOneItem: collection<HTMLLIElement>(),

    applyButton: optional<HTMLButtonElement>(),
    applyButtonLabel: optional<HTMLSpanElement>(),
    
    // this still feels a bit weird
    // we're selecting on data-componet instead, which is never unique
    // so we need some kind of selector, which should probably still be a normal CSS class selector 
    // maybe this should live in a `components` definition instead, since it's cleary a bit different
    applyButtonIcon: component.optional<Icon>('icon', '.apply-button'),
  },
  setup(props, refs) {
  }
});
```

#### More options

We could also support multiple selector types, giving users more choice and freedom to select whatever they want:
```ts
defineComponent({
  refs: {
    // some way to not specify a ref, would instead use the attribute name ('menu' in this case)
    menu: refElement().required,

    // select a single item
    list: refElement('list').required,
    // select a collection
    listItems: refCollection('listItem').required,
    
    // select a nested path
    otherList: refElement(['container-a', 'list']).optional,
    
    // using a querySelector
    specificutton: queryElement('.foo .bar .button').optional,
    specificInputs: queryCollection('.foo .bar input'),
    
    // an option to execute any query logic on the page to fetch the element
    customItem: customRef((element) => element.querySelector('.foo').closest('.item')).required,
  }
});
```

Above, the `refElement`/`refCollection` would transform `'list'` in `'[data-ref="list"]'` to use as query-selector, and 
`['container-a', 'list']` would turn into `'[data-ref="container-a"] [data-ref="list"]'`.

The `customRef()` could be a way to add ultimate freedom, used as an escape hatch when default selection methods are not
sufficient.

## Using

After configuring and fetching all the refs, we need to use them in our component. The refs can be made available the
same way as props, most likely as a function param.

```ts
defineComponent({
  refs: {
    button: refElement('button'),
  },
  setup(props, refs) {
    console.log(refs.button); // HTMLButtonElement
  }
})
```

### Reactivity

In most cases, the rendered DOM won't change (at least, no items will be added or removed) after the page on the
server has been rendered. In most cases `display:none` would be used to (temporarily) hide something. 

However, let's explore in what situations reactivity could be useful, and how we need to design our API to deal with
this.

#### Scenarios

1. Dynamic lists, where new items are created/appended on interaction, and the collection array should be updated.

2. A new block of content is (lazy) loaded and placed into the DOM. Selectors that were optional and previously still
   undefined, can be linked up after that happens.
   
   Or combined with option 1, a collection of results from the backend could be loaded onto the page, replacing the
   previous items in that collection.

3. That new content can be removed from the DOM again, making the selectors undefined again, and cleanup should happen
   on added DOM bindings.
  
4. A complete piece of the UI is fully managed clientside from JS, and needs super dynamic DOM interactions, with loops
   and conditional rendering. In this case we might want to involve client-side templates anyway.

#### APIs

Let's start with the following scenario, with a single optional button that has a text and click binding:

```ts
defineComponent({
  refs: {
    button: refElement('button').optional,
  },
  setup(props, refs) {
    const counter = ref(1);
    bind(refs.button, {
      text: () => `Count ${counter.value}`,
      click: () => counter.value++,
    });
  }
})
```

If `refs.button` is the selected DOM node, only the link between `refs` and `button` is reactive (if `refs` itself is
an observable). When passed to the `bind` function, the reactivity it has is lost, so the `bind` function cannot
re-execute its logic (again).

I think we have these options;

1. Make the individual refs observable as well, and pass that observable to functions that require reactivity.

    ```typescript
    defineComponent({
      refs: {
        button: refElement('button').optional,
      },
      setup(props, refs) {
        // access the value from a ref ref
        console.log(refs.button.value); // HTMLButtonElement
   
        const counter = ref(1);
        // passing a `ref`, which is observable
        bind(refs.button, {
          text: () => `Count ${counter.value}`,
          click: () => counter.value++,
        });
      }
    })
    ```

2. Convert to a ref before passing (like we do in other cases as well).

    ```typescript
    defineComponent({
      refs: {
        button: refElement('button').optional,
      },
      setup(props, refs) {   
        const counter = ref(1);
   
        // passing a `ref`, which is observable
        bind(toRef(refs, 'button'), {
          text: () => `Count ${counter.value}`,
          click: () => counter.value++,
        });
      }
    })
    ```

3. Pass the ref element within a function, which can internally be used as computed.

    ```typescript
    defineComponent({
      refs: {
        button: refElement('button').optional,
      },
      setup(props, refs) {
        const counter = ref(1);
        // passing a function, so `refs.button` can be tracked when executed from a computed
        bind(() => refs.button, {
          text: () => `Count ${counter.value}`,
          click: () => counter.value++,
        });
      }
    })
    ```

4. Connect `bind` more closely to the component by passing a ref name as string. 

    ```typescript
    defineComponent({
      refs: {
        button: refElement('button').optional,
      },
      setup(props, refs) {
        const counter = ref(1);
        // passing the name of the ref, so `bind` can do the interactions
        bind('button', {
          text: () => `Count ${counter.value}`,
          click: () => counter.value++,
        });
      }
    })
    ```
    
Of course, functions like `bind` can support multiple options at the same time by checking what is passed (a string,
element, ref or function), and do the right thing. The question here is, what do we feel has the best DX, and should
be the documented default.

The bigger question is how we should expose the refs itself. Should they be just HTML elements inside a reactive object,
or should they be observable themselves as well? In frameworks like Vue and React, when refs are linked to elements
within the template, they always are a boxed value, so they can be passed around as reference. While our current idea
by exposing all refs on a single object, because they are configured in a single place, doesn't have to follow the same
logic, it might make more sense when we think about how we pass around those refs to elements to other util functions
and our own hooks. Not having to convert them to refs ourselves might be the convenient option.
