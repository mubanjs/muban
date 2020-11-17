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
```html
<div data-component="my-component">Hello</div>
```

Then init your component:
```ts
const rootElement = document.querySelector('[data-component="my-component"]');
const instance = MyComponent(rootElement);
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

Render your template:
```ts {1-2}
const templateResult = myComponentTemplate({ welcomeText: 'Hello' });
render(templateResult, document.body);

const componentElement = document.querySelector('[data-component="my-component"]');
const instance = MyComponent(componentElement);
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
