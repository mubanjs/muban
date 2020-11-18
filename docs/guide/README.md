# Getting started

## Installing

Add `muban` to your project:

<code-group>
<code-block title="YARN">
```sh
yarn add @muban/muban
```
</code-block>

<code-block title="NPM">
```sh
npm i -S @muban/muban
```
</code-block>
</code-group>

## Simple component

Create your component:
```ts
import { defineComponent } from '@muban/muban';

const MyComponent = defineComponent({
  name: 'my-component',
  setup(props, refs) {
    return [
      bind(refs.self, { text: 'Hello World'}),
    ] 
  }
});
```

Make sure to have the following HTML on the page:
```html {4}
<html>
  ...
  <body>
    <div data-component="my-component">Hello</div>
  </body>
</html>
```

Then init your component:
```ts
import { mount } from '@muban/muban';

mount(MyComponent, document.body)
```

Your page should now display `Hello World` if your component is correctly running.

## Dev template

Create our template:
```ts
type MyComponentProps = {
  welcomeText: string;
};

function myComponentTemplate({ welcomeText }: MyComponentProps) {
  return html`<div data-component="my-component">${welcomeText}</div>`;
}
```

Make sure to have the following HTML on the page:
```html {4-6}
<html>
  ...
  <body>
    <div id="app">
      <div data-component="my-component">Hello</div>
    </div>
  </body>
</html>
```

Render your template:
```ts
import { mount } from '@muban/muban';

const appRoot = document.getElementById('app');
mount(MyComponent, appRoot, myComponentTemplate, { welcomeText: 'Hello' })
```

## Using Storybook

Add `@muban/storybook` to your project:

<code-group>
<code-block title="YARN">
```sh
yarn add @muban/storybook
```
</code-block>

<code-block title="NPM">
```sh
npm i -S @muban/storybook
```
</code-block>
</code-group>

Add these two scripts in your `package.json`

```json {3-4}
{
  "scripts": {
    "storybook": "start-storybook -p 6006",
    "build-storybook": "build-storybook -o ./dist/storybook"  
  }
}
```

Create your `.storybook/main.js` with this content:
```js
module.exports = {
  stories: [
    '../src/**/*.stories.mdx',
    '../src/**/*.stories.@(js|ts)'
  ],
  addons: [
    '@storybook/addon-essentials',
  ]
}
```

Create your story file:
```ts
import type { Story } from '@muban/storybook';

export default {
  title: 'MyComponent',
  argTypes: {
    welcomeText: { control: 'text' },
  },
};

export const Default: Story<MyComponentProps> = () => ({
  template: myComponentTemplate,
  component: MyComponent,
});
Default.args = {
  welcomeText: 'Hello',
};
```

Run storybook:

<code-group>
<code-block title="YARN">
```sh
yarn storybook
```
</code-block>

<code-block title="NPM">
```sh
npm run storybook
```
</code-block>
</code-group>
