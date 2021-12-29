import {defineComponent, ref, bind } from '@muban/muban';

const MyComponent = defineComponent({
  name: 'my-component',
  setup({ refs }) {
    const content = ref('Hello World');
    return [
      bind(refs.self, { text: content}),
    ];
  }
});

import { createApp } from '@muban/muban';

createApp(MyComponent).mount(document.body)
