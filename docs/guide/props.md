# Props

## Introduction

Compared to most known Frontend frameworks where everything is rendered on the client, and props 
are passed down parent to child to render the component, props in Muban work slightly different; 
In Muban, the HTML is the source of truth, so most of the props come out of your HTML.

While you can still pass props from parent to child components, the rendered HTML contains the 
initial state of all your components, so at some level, you always have to read those values from
the HTML into component props. From there, your props start flowing into the rest of your 
application.

### Initial State

So, how is this "initial state" stored inside the HTML, and how can we extract that to make it 
usable in our component? We can divide this up into 3 different categories:

1) **Explicit state** – stored in `data-attributes` or `<script type="application/json">`, that 
   serves no function on the page for the user, but allows us to extract that state into our 
   component without any ambiguity.

2) **Implicit state** – stored in things like css `class` names or `html`/`text` on the page, 
   that is already there to present to the user, and we can use as well to extract into our 
   components. However, since they are meant for content or presentation, we need to be mindful 
   when using them as our initial state, as they could change without us realizing.
   
3) **Input state** – stored in elements that the user can interact with, like `input` elements. 
   Often this state is extracted using specific 2-way-bindings instead of props. This type of 
   state still needs some refinement to decide how or when to use props over bindings.

### Extraction

For extractions, we have different PropertySource functions that can extract information from 
different types of "html". Most of them support converting the extract value into a specific 
data type (like booleans or numbers), and some of them can receive additional configuration to 
further fine tune the extraction behaviour.

Since _Explicit state_ is only there to be extracted to the component, it always exists on the 
`data-component` element, and Muban is configured to extract this state in 3 different ways:

* The `data` source, using `data-attributes` on the root element, where the name of the prop 
  specifies which data attribute to extract. A component prop `foo` will be extracted from 
  `data-foo="bar"`, and will get the value `'bar'`.

* The `json` source, using a `<script type="application/json">` tag as a first-child of the root 
  element, containing a JSON string that will be parsed into an object as a source for the 
  properties. A component prop `foo` will be extracted from
  `<script type="application/json">{"foo":"bar"}</script>`, and will get the value `'bar'`.

* The `css` source, using the `class` attribute on the root element, just for `Boolean` props, to 
  see if a certain classname exists. A boolean component prop `isActive` will be extracted from 
  `class="is-active"` and will get the value `true`. Note that this is partially _Implicit 
  state_, and because of that, by default it will only look for Boolean values on the root element.

_Implicit state_ can be extracted from any element, and requires a bit more configuration to 
specify exactly what values you want to extract from where.

* The `data` and `json` sources can be explicitly configured, which is only useful if you want 
  to target other elements beside the root element. They work exactly the same.
  
* The `css` source allows for more options when configured as an explicit source, allowing the 
  retrieval of more structured information based on the available css classes that exist on an 
  element.

* The `text` and `html` sources allow you to extract any text or html content from an element. 
  The `text` source allows for value conversion into some of the basic data types as well.
  
* The `attr` source is similar to the `data` source, but uses normal attributes to extract data 
  from, and also allows conversion.

* The `form` source allow you to extract _Input state_ from form elements, when targeting an input it will extract the value, when targeting a form it will extract the FormData Object. It allows for value conversion into basic data types as well.
  
Remember, the `form` binding will extract the value from form inputs, but most often you will end 
up using two-way bindings to manage syncing up these values with the internal component state.

### Parent components

Props not only receive their value from extracted HTML state, but it can also come from parent 
components that pass values down. The extracted values are considered **initial state**, while 
the values passed from parent components can change over the application lifetime.

Please keep in mind that the value from the parent component will override the value that was 
extracted from the HTML, as bindings will be executed slightly later. Because of this, you have 
to make sure to read the child prop's value and using that as initial state of your binding.

By doing that, you're "pulling" ownership of that state from the child to the parent component, 
and the child component becomes "stateless". It's important to always keep an eye out on where 
the initial state comes from, and who ends up managing that state at a later point.

### Execution order

Related to the above, it's important to understand the execution order of different parts of the 
component creation.

Because parent components need to read the props of the child components as 
initial state that can be used in bindings on the child components, those child components and 
their props must be available in the `setup` function of the parent component.

This also means that the child component does not have access to the props of the parent 
component in their setup function, since the setup function of the parent component still needs 
to execute. Use `watch` or `watchEffect` if you need to know when they become available.

> TODO; link to full component lifecycle

### Read Only

The `props` object passed to the `setup` function is **readonly**, so it cannot be used to
communicate back to the parent component or as initial state.

## Prop Definition

Now that we know the concept about initial state, how it can exist in the rendered HTML, and 
what types of extraction we can use, let's see how we can configure this in our component.

### propType

Let's start with simple example of how we can extract a data attribute on the root element.

```ts
import { defineComponent, propType } from "@muban/muban";

const MyComponent = defineComponent({
  name: 'my-component',
  // use this props object to define properties
  props: {
    // "foo" is the name of the property we can use in our setup function
    // "propType.string" will tell the component that this value will be a string
    foo: propType.string,
  },
  setup({ props }) {
    // this will output: 'bar'
    console.log(props.foo);
    
    return [];
  }
})
```
```html
<div
  data-component="my-component"
  <!-- render the "data-foo" attribute with the "bar" value to be used by the component -->
  data-foo="bar"
></div>
```

The `propType` object contains chainable properties and functions to help us configure how we 
extract and process each property.

When set to `string`, it doesn't have to do any processing, since almost everything in HTML is 
already a string. There are also values like `number` and `date` that allow conversions, 
`boolean` that is often used to check for the existence of something, and `array` and `object` 
to handle more complex data structures – often passed inside the json block.  

::: tip API
Read more on the [props API](../api/props.html#proptype) page.
:::

### source

Next up, let's use the existence of a css class to fill a boolean prop by using the `source` 
configuration.

```ts
import { defineComponent, propType } from "@muban/muban";

const MyComponent = defineComponent({
  name: 'my-component',
  refs: {
    // this ref is used in the prop definition as the "target"
    content: refElement('content'),
  },
  props: {
    // "isExpanded" will check the `isExpanded` and `is-expanded` css classes. 
    // "propType.boolean" will make sure to return a boolean when the css class exist
    // the `source` function allows us to specifically configure where and how to extract
    // - type:'css' will use the "css" source to check the "class" attribute
    // - target:'content' will use the refs.content element to get the information from
    isExpanded: propType.boolean.source({ type: 'css', target: 'content'}),
  },
  setup({ props }) {
    // this will output: true
    console.log(props.isExpanded);
    
    return [];
  }
})
```
```html
<div data-component="my-component">
  <!-- this data-ref is needed for the property source target -->
  <div data-ref="content" class="is-expanded">
    Content
  </div>
</div>
```

The `source` helper allows you to configure the following:
* The `type` of source to use for extraction.
* The `target` element (which uses the configured refs) from which to extract the value.
* The `name` value to "override" the default property name as the value to look up. E.g. if the 
  prop name is `isExpanded`, but the rendered css class is `expanded`, you can pass `name: 
  'expanded'` to use that css class instead. The same is true for which `data-attribute` to use, 
  or similar cases in other sources.
* The `options` object which allows even further configuration, with options for specific sources.

You could also pass an array of source configurations, they will be tried one by one and return the first non undefined value

```ts
const MyComponent = defineComponent({
  name: 'my-component',
  refs: {
    input: refElement('input'),
  },
  props: {
    value: propType.string.source([
      { type: 'attr', target: 'idnput', name: 'value' }, // idnput target does not exist
      { type: 'data', target: 'input' },
    ]),
  },
  setup({ props }) {
    // this will output: value-from-data
    console.log(props.value);
    
    return [];
  }
})
```

```html
<div data-component="my-component">
  <input data-ref="input" value="value-from-attr" data-value="value-from-data" />
</div>
```

The above example first tries to get the value from the attribute using the `attr` type, because the target element (idnput) does not exists it tries the second source configuration, that configuration uses the `data` type, and returns the value from the dataset. 

::: tip API
Read more on the [source API](../api/props.html#source) page.
:::

### optional

By default, all defined properties are required, and when they cannot be found (except for 
Booleans), a warning in the console will be logged, since you either made a mistake by not 
providing the state in the HTML, or you should have configured the prop to be optional.


```ts
import { defineComponent, propType } from "@muban/muban";

const MyComponent = defineComponent({
  name: 'my-component',
  props: {
    // The `.optional` will tell the component that this value can be undefined
    foo: propType.string.optional,
  },
  setup({ props }) {
    // this will output: undefined
    console.log(props.foo);
    
    return [];
  }
})
```
```html
<!-- note that there is no `data-foo` present, so the prop will be undefined -->
<div data-component="my-component"></div>
```

::: tip API
Read more on the [optional API](../api/props.html#optional) page.
:::

### defaultValue

If you want to give the prop a default value when it's missing in the HTML, you can use 
`defaultValue` instead of `optional`.

```ts
import { defineComponent, propType } from "@muban/muban";

const MyComponent = defineComponent({
  name: 'my-component',
  props: {
    // The `.defaultValue` will tell the component to use 'bar' when it's missing
    foo: propType.string.defaultValue('bar'),
  },
  setup({ props }) {
    // this will output the defautl value: 'bar'
    console.log(props.foo);
    
    return [];
  }
})
```
```html
<!-- note that there is no `data-foo` present, so the prop will get the default value -->
<div data-component="my-component"></div>
```

::: tip
Only one of `optional` or `defaultValue` should be used, defining them both doesn't do anything.
:::

::: tip API
Read more on the [defaultValue API](../api/props.html#defaultvalue) page.
:::

### validate

If you want control of the exact value your properties can receive, you can use the `validate` 
function to pass a `Predicate` that will test if your value is valid.

A `Predicate` is a function that expects a value and returns a boolean. If false is returned, 
an error will be thrown that the property is invalid.

```ts
import { defineComponent, propType } from "@muban/muban";
import { either, isPositive, shape, isString, isNumber } from "isntnt";

const MyComponent = defineComponent({
  name: 'my-component',
  props: {
    // str can only be 'foo' or 'bar'
    str: propType.string.validate(either('foo', 'bar')),
    // num can only be a positive number
    num: propType.number.validate(isPositive),
    // obj must contain the foo and bar keys with their respective types
    obj: propType.object.validate(shape({ foo: isString, bar: isNumber })),
  },
  setup({ props }) {
    return [];
  }
})
```
```html
<!-- note that there is no `data-foo` present, so the prop will get the default value -->
<div data-component="my-component" data-str="bar" data-num="18">
  <script type="application/json">{
    "obj": {
      "foo": "hello",
      "bar": 18
    }
  }</script>
  Content
</div>
```

::: tip Typing
Besides checking the validity of the value, it will also "type" the value based on the predicate.
When using the `either('foo', 'bar')` predicate, the prop type will now be `'foo' | 'bar'` 
instead of just `string`. The same works for objects when using the `shape` predicate. 
:::

::: tip API
Read more on the [validate API](../api/props.html#validate) page.
:::

### functions

With the `func` propType, we're moving out of the "extraction" props, and into passing prop 
values from parent components. More about that further down.

The function propType adds another method to be used, the `shape`. It allows you to define the 
shape of the passed function.

```ts
import { defineComponent, propType } from "@muban/muban";
import { watch } from "@vue/runtime-core";

const MyComponent = defineComponent({
  name: 'my-component',
  props: {
    // The `onChange` props expects a function with the `(value: string) => void` shape 
    onChange: propType.func.shape<(value: string) => void>(),
  },
  setup({ props }) {
    // this will always be undefined, since the parent bindings haven't been executed yet
    console.log(props.onChange);
    
    // watch for the onChange to become available
    watch(
      () => props.onChange,
      (onChange) => {
        // now we can use it if we want to _directly_ execute it
        console.log(onChange);
      },
    )

    return [];
  }
})
```
```ts
import { defineComponent, refComponent } from "@muban/muban";

const ParentComponent = defineComponent({
  name: 'parent-component',
  refs: {
    // get a reference to the child component
    child: refComponent(MyComponent),
  },
  setup({ refs }) {
    return [
      // bind to the child component to pass props
      bind(refs.child, {
        // pass a function to the onChange prop that will be executed when called from the child 
        // component, passing the 'value'.
        onChange: (value) => {
          console.log(value);
        }
      })
    ];
  }
})
```
```html
<div data-component="parent-component">
  Parent content
  <div data-component="my-component">
    Child content
  </div>
</div>
```

There we can see we can `bind` to the `ref` of the child component, where we can pass any props 
that the component, in this case the `onChange` prop.

From the child component, we can call the `onChange` prop whenever it becomes available.


::: tip API
Read more on the [shape API](../api/props.html#shape) page.
:::

## Parent component

### Reading props from parents

Props that you want to receive from a parent component are defined the same way as props that 
you want to extract from the HTML, except that they should always be `optional` (unless you 
define a `defaultValue`), and should not define a `source`.

Initially their value is always undefined. Since the props object is reactive, reading 
individual props from that object will re-trigger if they are used in anything that can track 
reactivity, like a `computed` or a `watch`/`watchEffect`.

This means you can directly use this props in bindings (which will auto-update when those props 
change).

::: tip
Keep in mind that props are **not** two-way bindings, so writing to them will only effect the 
local component state.
:::

```ts
import { defineComponent, propType } from "@muban/muban";
import { watch, watchEffect } from "@vue/runtime-core";

const MyComponent = defineComponent({
  name: 'my-component',
  props: {
    // if this value comes from a parent component, it can be undefined
    value: propType.string.optional,
    onChange: propType.func.shape<(value: string) => void>(),
  },
  setup({ props }) {
    // this will always be undefined, since the parent bindings haven't been executed yet
    console.log(props.onChange);
    // same as this, unless extracted from the HTML.
    console.log(props.value);

    // watch for the onChange to become available
    // this will not execute immediately, only when it changes
    watch(
      () => props.onChange,
      (onChange) => {
        // now we can use it if we want to _directly_ execute it
        console.log(onChange);
      },
    )

    // or using watchEffect to immediately execute logic and auto-track every dependency
    watchEffect(() => {
      // this will log every time the value changes
      // being undefined the first time this executes
      console.log(props.value);
    });

    return [];
  }
})
```

### Reading child props and passing them back

As explained earlier, it's important to first read the child prop value and use that as the 
initial state of the bindings you set for that same prop, so you won't overwrite it.

```ts
import { defineComponent, refComponent } from "@muban/muban";

const ParentComponent = defineComponent({
  name: 'parent-component',
  refs: {
    // get a reference to the child component
    child: refComponent(MyComponent),
  },
  setup({ refs }) {
    // using the ref, you can access the props of the child component
    // if you're adding bindings to this same prop, you should always use
    // this method to get the initial value of that prop
    const someValue = ref(refs.child.component.props.value ?? 'foo');
    
    return [
      // bind to the child component to pass props
      // this bindings object is typed based on the props of the child component
      bind(refs.child, {
        // directly pass an existing `ref` or `computed`
        value: someValue,
        
        // anything else can be wrapped inside a computed
        value: computed(() => `${someValue.value}-bar`),
        
        // pass a function to the onChange prop that will be executed when called from the child 
        // component, passing the 'value'.
        onChange: (value) => {
          console.log(value);
          // update the internal ref based on the child value, keeping things in sync
          someValue.value = value;
        }
      })
    ];
  }
})
```

As you can see, we use the `refs.child` to get access to the `component` instance of that ref 
(which can be `undefined` if the element didn't exist in the DOM), and from there we can access 
the `props` of that component, which is filled with anything that was extracted from the html.
