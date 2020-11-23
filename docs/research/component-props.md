# Component Props

[[toc]]

This document explores how to integrate "outside" props into the component.

In muban, components are mounted on existing DOM elements, instead of rendered by a parent.
This means that passing of props happens through the HTML, at least initially. The most straight-forward way of defining
props in html is through the `data-` attributes (e.g. `<div data-color="#FF0000">`).

Components can read these properties through the `dataset` DOM API: `element.dataset.color`.

While the above works fine for basic scenarios, we can do a lot of things to improve the Developer Experience.

## HTML

### `data-` attributes

As seen in the example we can use `data-` attributes to store property values. When defining them, they are always
strings. If we need to convert them to other primitives or objects, we have to do that ourselves.

### data-props
One way to improve on this, is to use a single `data-props` attribute, and fill this with a JSON payload.
```html
<div data-props='{ "foo": true, "bar": [1, 5], "baz": "you're it" }'>test</div>
```

Pros:
* single data attribute, clear purpose
* allows nested objects and arrays as properties
* allows typing

Cons:
* awkward syntax with single-quotes around the JSON
* might be harder to conditionally render for CMS systems in the template language, or connect to CMS UI settings
* needs to be escaped to allow for single quotes (or other dangerous sequences) (`%27`)

### JSON script tag

Another option would be to output a script tag within the component HTML (that is not executed), that contains a JSON
payload. This can be read and parsed by the component, and exposed as a props object.

```html
<div data-component="carousel">
<script type="application/json">
{ "foo": true, "bar": [1, 5], "baz": "you're it" }
</script>
<p>other HTML</p>
</div>
```

Pros:
* dedicated place to put props
* allows nested objects and arrays as properties
* allows typing
* no encoding issues

Cons:
* might be harder to conditionally render for CMS systems in the template language, or connect to CMS UI settings
* outputs a bit more code on the page

## Definition

Even though the props can be retrieved from the HTML and exposed as an object, in the component itself we have no
guarantees or information about them. If we can define them as prop types, we can use this information in the component.

Inspired by Vue, we could use something similar:

```js
  props: {
    // Basic type check (`null` and `undefined` values will pass any type validation)
    propA: Number,
    // Multiple possible types
    propB: [String, Number],
    // Required string
    propC: {
      type: String,
      required: true
    },
    // Number with a default value
    propD: {
      type: Number,
      default: 100
    },
    // Object with a default value
    propE: {
      type: Object,
      // Object or array defaults must be returned from
      // a factory function
      default: function () {
        return { message: 'hello' }
      }
    },
    // Custom validator function
    propF: {
      validator: function (value) {
        // The value must match one of these strings
        return ['success', 'warning', 'danger'].indexOf(value) !== -1
      }
    }
  }
```

Or more powerful [vue-types](https://github.com/dwightjack/vue-types):
```js
  props: {
    // Basic type check (`null` and `undefined` values will pass any type validation)
    propA: Number,
    // Multiple possible types
    propB: VueTypes.oneOfType([String, Number]),
    // Required string
    propC: VueTypes.string.isRequired,
    // Number with a default value
    propD: VueTypes.number.def(100),
    // Object with a default value
    propE: VueTypes.shape({
      message: String,
    }).def(() => ({ message: 'hello' })),
    // Custom validator function
    propF: VueTypes.string.validate(val => ['success', 'warning', 'danger'].indexOf(value) !== -1)
  }
```

The main thing to accomplish, besides all the features above, is to type the props object that is used in the component:
* with the right type/shape
* with the right optional/required

## Usage

I think this is pretty straight forward when settling on a component design itself, but could look like:

```typescript
// function component
const propTypes = { ... };
function Carousel(props: Props<typeof propTypes>) { // can this be inferred?
}
Carousel.propTypes = propTypes;
```

```typescript
// class component
class Carousel extends AbstractComponent {
  propTypes = { ... };

  constructor(props) { // how to type?
    super(props);

    this.props
  }
}
```

```typescript
// options component
defineComponent({
  props: { ... },
  setup({ props }) { // types are "fixed" by `defineComponent`
  }
})
```

## Changing props

In some scenarios it could happen that a parent component wants a child component to update based on user interaction.
A way to do this would be to change the props for that child component. This will need two things to work:

1. A way for the parent to change/pass the props
2. A way for the child component to receive "updates" when those props are changed.

### Updating

Since the original props are stored on the DOM in some way, updating the props could be done in the same way, where a
util function could write the updated props to the DOM, signals the child component, which re-executes their prop-logic.

The alternative is to bypass the DOM, and directly pass the (new) props to the validation function. This saves us from
writing to and reading from the DOM. Storing this information in the DOM will probably not be needed for anything else.

### Reacting

Reacting to prop updates will be different depending on the type of component, and the chosen architecture (reactive
vs pure).

For class-based components, it's not possible to call the constructor again with the new props. Similar to the React
class components, we could call a componentWillReceiveProps function, or something similar, that passes the new props.

For a pure setup with just a function, it can just re-execute the function with the new props. Pretty simple.

For a reactive setup, with an options-object, the passed props object should probably be observable. If the original
props were used in any other reactive structures or DOM bindings, those should be re-execute automatically.

## Responsibility

Who should be responsible for what?

A single component could perfectly read and process its own props from the DOM. Different components could theoretically
implement different methods of placing, reading, parsing/validating and using the props. Which is perfect.

But, when components need to communicate with each other, who is responsible for updating the props from the outside?
Can we define a common public API for all component types that allow all different component designs to talk to each
other without needing additional framework utils?

Even if that's possible, how would a parent component get hold of a child component "instance"? Could this happen by
just storing the reference in the DOM element - so there is no need for a framework that provides lookup access?
It seems that storing such information in the DOM itself is not possible (the DOM APIs are deprecated), so the only
option seems to be to use a `WeakMap` with the DOM element as key, and the component as value. This WeakMap should live
somewhere "global", so should probably be considered part of the framework - that could provide util functions to
make working with this easier?

Maybe, the component part of the "framework" should just be part of the component package!
