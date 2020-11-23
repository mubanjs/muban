# mhtml templates

## html

The tagged template string function you can use to render any HTML and include variables as part
of tag-names, attributes and content.

Check out [htm](https://github.com/developit/htm) and [vhtml](https://github.com/developit/vhtml)
for more information. Although most examples use JSX, the supported features are pretty much the
same.

### Basic variables

```ts
import { html } from "@muban/muban";

const tag = 'p';
const className = 'is-active';
const content = 'hello world';

html`<${tag} class=${className}>${content}</${tag}>`;
```
```html
<p class="is-active">hello world</p>
```

### Include partial templates

Just calling the child template function:
```ts
const ItemTemplate = ({ label }) => (
  html`<li>${label}</li>`
);

const ListTemplate = ({ items }) => (
  html`<ul>
    ${items.map(item => ItemTemplate(item))}
  </u>`
);
```

As can be seen, looping over items can just be done using `Array.map` and returning an array
of rendered template strings.

### Spreading

Spreading is supported:
```ts
html`<p ...${obj}></p>`;
```

### Tag component

If the `tag` variable is a function, it gets called as a ["sort of"](https://github.com/developit/vhtml#new-sortof-components)
"component".

```ts {3-8,15-17}
let items = ['one', 'two'];

const Item = ({ item, index, children }) => (
  html`<li id=${index}>
    <h4>${item}</h4>
    ${children}
  </li>`
);

console.log(
  html`<div class="foo">
    <h1>Hi!</h1>
    <ul>
      ${items.map( (item, index) => (
        html`<${Item} ...${{ item, index }}>
          This is item ${item}!
        </${Item}>`
      ))}
    </ul>
  </div>`
);
```

## unsafeHTML

```ts
declare function unsafeHTML(data: string): string;
```

By default, every variable in the template string is considered unsafe and will be escaped.
To opt-out here, we can use the `unsafeHTML` helper.

```ts
import { html, unsafeHTML } from '@muban/muban'

const content = 'Hello <strong>world</strong>!';

html`<div>
  <p>${content}</p>
  <p>${unsafeHTML(content)}</p>
</div>`
```
```html
<div>
  <p>Hello &lt;strong&gt;world&lt;/strong&gt;!</p>
  <p>Hello <strong>world</strong>!</p>
</div>
```

Another way to render raw HTML is use the `dangerouslySetInnerHTML` option from React.
In most scenarios this shouldn't be needed, unless you want to add content that is not valid HTML
into an element that can render other things (like script tags - see
[`jsonScriptTemplate`](#jsonScriptTemplate) below).

```ts
const content = 'Hello <strong>world</strong>!';

html`<div>
  <p dangerouslySetInnerHTML=${{
    __html: content,
  }}></p>
</div>`
```

## classMap

The `classMap` util can be useful to render a set of css classes conditionally based on template
properties.

```ts
declare function classMap(classes: Record<string, boolean>): string;
```

The `classes` parameter is an Object, where the keys are the classnames, and the values are booleans
that dictate if the class should be added or not.

```ts
import { html, classMap } from '@muban/muban';

html`<div class=${classMap({ 'is-expanded': true, 'is-active': false })}>
  content
</div>`;
```
```html
<div class="is-expanded">content</div>
```

## jsonScriptTemplate 

In muban, it's supported to read component property from a JSON script tag, mostly used when the
data is too much to fit nicely into data- attributes.

```ts
declare function jsonScriptTemplate(content: Array<any> | Record<string, any>): string;
```

Example

```ts
html`<div>${jsonScriptTemplate({ isExpanded: true })}</div>`;
```
```html
<div>
  <script type="application/json">
    { "isExpanded": true }
  </script>
</div>
```
