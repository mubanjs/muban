# Props


::: tip Guide
Perhaps the [props Guide](../guide/props.html) is also useful to you.
:::

## propType

This object is what's created by the `propType` helpers and passed to your component for each 
prop you define. Besides the information in here, props are also typed based on this object, and 
the helpers make sure that the `type` matches up with the `deafult` and `validator`. Together 
with that, the `optional` and `validator` can make type `| undefined`.

The `PropType` is the type of the `propType` helper functions that you can use for your 
component props, and it exposes an initial `type` (e.g. `string` or `func`) for you to work with.

```ts
export type PropTypeDefinition<T = any> = {
  type:
    | typeof Number
    | typeof String
    | typeof Boolean
    | typeof Date
    | typeof Array
    | typeof Object
    | typeof Function;
  default?: T extends Primitive ? T : () => T;
  validator?: Predicate<T>;
  isOptional?: boolean;
  missingValue?: boolean;
  // eslint-disable-next-line @typescript-eslint/ban-types
  shapeType?: Function;
  sourceOptions?: {
    target?: string;
    type?: 'data' | 'json' | 'attr' | 'css' | 'text' | 'html' | 'form';
    name?: string;
    options?: {
      cssPredicate?: Array<string>;
    };
  }
};

type PropType = {
  string: PropTypeDefinition;
  number: PropTypeDefinition;
  boolean: PropTypeDefinition;
  object: PropTypeDefinition;
  array: PropTypeDefinition;
  date: PropTypeDefinition;
  func: PropTypeDefinition;
}
```

THis is how you can use it in your component:

```ts
import { propType } from '@muban/muban';

defineComponent({
  props: {
    foo: propType.string
  }
})
```

### type

The objects below highlight what properties or functions you can call on each `propType` object. 
Setting or calling them will result in setting one of the keys from the `PropTypeDefinition` above.

All of them offer the same helpers, except `func` since that one can only be passed from parent 
components. The only difference between the others is how they are typed.

```ts
propType.string;

{
  type: String,
  optional: {},
  defaultValue(value: string) => {},
  validate(predicate: Predicate<string>) => {},
  sourceOptions: {},
} 
```
```ts
propType.number;

{
  type: Number,
  optional: {},
  defaultValue(value: number) => {},
  validate(predicate: Predicate<number>) => {},
  sourceOptions: {},
} 
```
```ts
propType.boolean;

{
  type: Boolean,
  optional: {},
  defaultValue(value: boolean) => {},
  validate(predicate: Predicate<boolean>) => {},
  sourceOptions: {},
} 
```
```ts
propType.object;

{
  type: Object,
  optional: {},
  defaultValue(value: Object) => {},
  validate(predicate: Predicate<Object>) => {},
  sourceOptions: {},
} 
```
```ts
propType.array;

{
  type: Array,
  optional: {},
  defaultValue(value: Array) => {},
  validate(predicate: Predicate<Array>) => {},
  sourceOptions: {},
} 
```
```ts
propType.date;

{
  type: Date,
  optional: {},
  defaultValue(value: Date) => {},
  validate(predicate: Predicate<Date>) => {},
  sourceOptions: {},
} 
```
```ts
propType.func;

{
  type: Function,
  optional: {},
  shape<T>() => {},
} 
```
### optional

When using `optional`, you mark the `PropTypeDefinition` object as optional (you don't have to 
pass a value), and also indicates that the value (when the prop is resolve) is missing.

```ts
optional;

{
  ...obj,
  isOptional: true,
  missingValue: true,
}
```
```ts
propType.string.optional;
```

::: tip Guide
Read more on the [optional Guide](../guide/props.html#optional) page.
:::

### defaultValue

When using `defaultValue`, you set this default value on the `PropTypeDefinition` while also 
marking it as `optional` (you don't have to pass a value), but since you have a `default` set, 
it will never be missing a value (when resolved).

The passed `defaultValue` must match the type of `propType` you're working with.

```ts
defaultValue: <U extends ConstructorType<T['type']> | undefined>(
  value: U extends Primitive ? U : () => U,
);

{
  ...obj,
  isOptional: true,
  default: value,
}
```
```ts
propType.string.defaultValue('foo');
```

::: tip Guide
Read more on the [defaultValue Guide](../guide/props.html#defaultvalue) page.
:::

### validate

When using the `validate`, you have to pass a `Predicate` function that gets checked after 
converting the extracted value to the right type, or when passing a value from the parent 
component. If the predicate fails (returns false), an error will be thrown.

Furthermore, the predicate is also used to set a stricter type from the default `string` or 
`Object`, so you can make it a string literal or a union thereof, or define a complex object shape.

```ts
validate: <U extends ConstructorType<T['type']> | undefined>(predicate: Predicate<U>)

{
  ...obj,
  validator: predicate,
}
```
```ts
export const isPositive: Predicate<number> = (value: unknown): value is number =>
  typeof value === 'number' && (value === 0 ? Infinity / value : value) > 0

// value validation
propType.number.validate(isPositive);

// value validation + type
propType.object.validate(
  shape({ foo: isNumber, bar: optional(isString)})
);
// is typed as
{
  foo: number;
  bar?: string;
}
```


::: tip Guide
Read more on the [validate Guide](../guide/props.html#validate) page.
:::

### shape

The `shape` helper only exists for function types, and allows you to define the shape of the 
function you expect from a parent component.

```ts
shape: <T extends Function>();

{
  ...obj,
  shapeType: (true as unknown) as T,
}
```
```ts
propType.func.shape<(isExpanded: boolean) => void>()
```

::: tip Guide
Read more on the [functions Guide](../guide/props.html#functions) page.
:::

### source

The `source` helper allows you to explicitly define how and where from to extract data from your 
HTML besides the default behaviour.

```ts
declare function source(options: {
  target?: string;
  type?: 'data' | 'json' | 'attr' | 'css' | 'text' | 'html' | 'form';
  name?: string;
  options?: { 
    cssPredicate?: Array<string>;
  };
})
```

* `target?: string` – The refName (those you configure as part of the component options)
  from which you want to extract this property.
  Defaults to the data-component element.
* `type?: 'data' | 'json' | 'attr' | 'css' | 'text' | 'html' | 'form'` - The type source you want to extract.
  Defaults to the `data + json + css` source (`css` only for boolean props).
  * `data` – Reads the `data-attribute` from your target element.
  * `json` – Reads the object key from a `<script type="application/json">` JSON block that is 
    located as a first child of your target element.
  * `attr` - Reads the `attribute` from your target element.
  * `css` – When the `propType` is boolean, checks if the css class is set on the target element.
    When the `propType` is `string`, it sets the value to the first matching class on the target element
    that matches the configured `cssPredicate` option.
    When the `propType` is an `Array`, it fills it with all the classes from the target element.
    When the `propType` is set to `Object`, it creates keys for the classnames, and sets `true` 
    to all values.
  * `text` – Reads the `textContents` from the target element.
  * `html` – Reads the `innerHTML` from the target element.
  * `form` – Reads the `value` from the target element when targeting a form input and `FormData` when targeting a form element 
* `name?: string` – For the `data`, `json`, `attr` and `css` source types, by default it will use 
  the 
  propName for the name of the (data) attribute or class name. For situations where the name
  of the "source" is different from the propName you want to have in your component,
  you can set this value. For example, if you want to have 2 different props filled with
  the same `data-attribute` from different target elements.
* `options?` – An options object to configure additional settings for some of the source types.
  * `cssPredicate?: Predicate<string>` – Sometimes you set one of a few possible css classes, and 
    you want to know which one is set. When a `string` propType is used in combination with the 
    `css` source, you have to provide this Predicate to search for the class name you're 
    interested in.

> TBD future?
>
> If you have an `Array` propType, it becomes possible to use an `ElementCollection` or
> `ComponentCollection`, and the extracted values from each element or component will be added to
> the array. Unfortunately all extracted values will be strings.

::: tip Guide
Read more on the [source Guide](../guide/props.html#source) page.
:::

#### Default `data-attribute`

```ts
defineComponent({
  name: 'my-component',
  props: {
    // by default, read the data-attribute from the data-component element
    isActive: propType.boolean
  },
})
````
```html
<div data-component="my-component" data-is-active="true">Content</div>
<div data-component="my-component" data-active="true">Content</div>
<div data-component="my-component" data-isActive="true">Content</div>
```

#### Default fallback to `<script type="application/json">`

```ts
defineComponent({
  name: 'my-component',
  props: {
    // if no data-attribute exits, fallback to the <script type="application/json"> tag
    isActive: propType.boolean
  },
})
```
```html
<div data-component="my-component">
  <script type="application/json">
    { "isActive": true }
  </script>
  Content
</div>
```

#### Fallback to `css` for `boolean` props

```ts
defineComponent({
  name: 'my-component',
  props: {
    // if no data-attribute or JSON exits, fallback to `css` source
    // this only works for boolean props
    isActive: propType.boolean
  },
})
```
```html
<div data-component="my-component" class="is-active">Content</div>
<div data-component="my-component" class="isActive">Content</div>
```

#### Use `css` on a different element

```ts
defineComponent({
  name: 'my-component',
  refs: {
    // this is needed for the source-target
    content: 'content',
    contentMore: 'content-more',
  },
  props: {
    // instead of the data-component element, use the content ref
    // to get the property value from
    isExpanded: propType.boolean.source({ target: 'content' }),
    // if your propName is different from the source name, you should specify it
    isMoreExpanded: propType.boolean.source(
      { target: 'content', name: 'is-expanded' }
    ),
  },
})
```
```html
<div data-component="my-component">
  <div class="is-expanded" data-ref="content">Content</div>
  <div class="is-expanded" data-ref="content-more">More Content</div>
</div>
```


#### Use the `string`, `Array` and `Object` types for `css`

```ts
defineComponent({
  name: 'my-component',
  refs: {
    // this is needed for the source-target
    item1: 'item1',
    item2: 'item2',
    item3: 'item3',
    items: refCollection(parent => parent.querySelectorAll('.item')),
  },
  props: {
    // set to 'recipe'
    item1Type: propType.string.source({
      target: 'item1',
      type: 'css',
      options: { cssPredicate: either('recipe', 'article') }
    }),
    // set to 'item-recipe'
    item2Type: propType.string.source({
      target: 'item2',
      type: 'css',
      options: { cssPredicate: either('item-recipe', 'item-article') }
    }),
    // set to 'item-recipe'
    item2Type: propType.string.source({
      target: 'item2',
      type: 'css',
      options: { cssPredicate: test(/^item-/) }
    }),
    // get all classNames from a single element
    // set to either ['item', 'item-recipe']
    itemTypes: propType.array.source({
      target: 'item2',
      type: 'css',
    }),
    // combine enum classes from a collection
    // set to ['item-recipe', 'item-article']
    // TODO: currently not supported
    // itemTypes: propType.array.source({
    //   target: 'items',
    //   type: 'css',
    //   options: { cssPredicate: test(/^item-/) }
    // }),
    // get all classNames from a single element
    // set to { item: true, 'item-recipe': true } 
    itemTypes: propType.object.source({
      target: 'items1',
      type: 'css',
    }),
  },
})
```
```html
<div data-component="my-component">
  <div data-ref="item1" class="recipe" >Content</div>
  
  <div data-ref="item2" class="item item-recipe" >More Content</div>
  <div data-ref="item3" class="item item-article" >More Content</div>
</div>
```


#### Use `attr`

```ts
defineComponent({
  name: 'my-component',
  refs: {
    // this is needed for the source-target
    contentImage: 'content-image',
  },
  props: {
    // grab the `src` attribute from the `contentImage` ref.
    contentImageSource: propType.string.source(
      { target: 'contentImage', type: 'attr', name: 'src' },
    ),
    // without a `name` it will use the propName (`src` in this case)
    src: propType.string.source(
      { target: 'contentImage', type: 'attr' },
    )
  },
})
```
```html
<div data-component="my-component">
  <img data-ref="content-image" src="./image.jpg"/>
</div>
```


#### Use `text` and `html`

```ts
defineComponent({
  name: 'my-component',
  refs: {
    // this is needed for the source-target
    content: 'content',
    status: 'status',
    value: 'value',
  },
  props: {
    // get the innerHTML from the content ref 
    // outputs "This <strong>is</strong> some <u>Content</u>"
    content: propType.string.source(
      { target: 'content', type: 'html'},
    ),
    // get the textContents from the status ref
    // outputs "This is some Content"
    textContent: propType.string.source(
      { target: 'status', type: 'text'},
    ),
    // outputs "Success"
    status: propType.string.source(
      { target: 'status', type: 'text'},
    ),
    // conversions to Booleans, Numbers and Dates also works
    // outputs "12.45" (as a number)
    status: propType.number.source(
      { target: 'value', type: 'text'},
    ),
  },
})
```
```html
<div data-component="my-component">
  <p data-ref="content">
    This <strong>is</strong> some <u>Content</u>
  </p>
  <span data-ref="status">Success</span>
  <span data-ref="value">12.45</span>
</div>
```
#### Use `form`
```ts
defineComponent({
  name: 'my-component',
  refs: {
    // this is needed for the source-target
    form: 'form',
    email: 'email',
    phone: 'phone',
  },
  props: {
    // get the FormData from the form ref
    // outputs FormData {}
    form: propType.object.source(
      { target: 'form', type: 'form'},
    ),
    // Extract the 'email' property from the form ref FormData object
    // outputs "user@company.com"
    form: propType.object.source(
      { target: 'form', type: 'form', name: 'email'},
    ),
    // get the value from the email ref
    // outputs "user@company.com"
    email: propType.string.source(
      { target: 'email', type: 'form'},
    ),
    // conversions to Booleans, Numbers and Dates also works
    // outputs "986868" (as a number)
    phone: propType.number.source(
      { target: 'phone', type: 'form'},
    ),
  },
})
```
```html
<div data-component="my-component">
  <form data-ref="form">
    <input type="text" data-ref="email" value="user@company.com"/>
    <input type="text" data-ref="phone" value="986868"/>
  </form>
</div>
```
