import type { Story } from '@muban/storybook/dist/client/preview/types-6-0';
import { defineComponent, html, provide, inject, bind, ref, Ref } from '../../../../../src';

export default {
  title: 'core/provideInject',
};

const ComponentD = defineComponent({
  name: 'ComponentD',
  refs: {
    context1: 'context1',
    context2: 'context2',
    context3: 'context3',
  },
  setup({ refs }) {
    console.log('---- D ----');
    console.log('[D] context1', inject<Ref<string>>('context1')?.value);
    console.log('[D] context2', inject<Ref<string>>('context2')?.value);
    console.log('[D] context3', inject<Ref<string>>('context3')?.value);

    return [
      bind(refs.context1, { text: inject('context1') }),
      bind(refs.context2, { text: inject('context2') }),
      bind(refs.context3, { text: inject('context3') }),
    ];
  },
});

const ComponentC = defineComponent({
  name: 'ComponentC',
  components: [ComponentD],
  refs: {
    context1: 'context1',
    context2: 'context2',
    input3: 'input3',
  },
  setup({ refs }) {
    console.log('---- C ----');
    const value3 = ref('componentC');
    provide('context3', value3);

    console.log('[C] context1', inject<Ref<string>>('context1')?.value);
    console.log('[C] context2', inject<Ref<string>>('context2')?.value);

    return [
      bind(refs.context1, { text: inject('context1') }),
      bind(refs.context2, { text: inject('context2') }),
      bind(refs.input3, { textInput: value3 }),
    ];
  },
});

const ComponentB = defineComponent({
  name: 'ComponentB',
  refs: {
    context1: 'context1',
    context2: 'context2',
    input2: 'input2',
  },
  components: [ComponentC],
  setup({ refs }) {
    console.log('---- B ----');
    const value2 = ref('componentB');
    provide('context2', value2);

    console.log('[B] context1', inject<Ref<string>>('context1')?.value);
    console.log('[B] context2', inject<Ref<string>>('context2')?.value);
    return [
      bind(refs.context1, { text: inject('context1') }),
      bind(refs.context2, { text: inject('context2') }),
      bind(refs.input2, { textInput: value2 }),
    ];
  },
});

const ComponentA = defineComponent({
  name: 'ComponentA',
  refs: {
    input1: 'input1',
    input2: 'input2',
  },
  components: [ComponentB],
  setup({ refs }) {
    console.log('---- A ----');
    const value1 = ref('componentA');
    const value2 = ref('componentA');
    provide('context1', value1);
    provide('context2', value2);

    return [bind(refs.input1, { textInput: value1 }), bind(refs.input2, { textInput: value2 })];
  },
});

const App = defineComponent({
  name: 'App',
  components: [ComponentA],
  setup() {
    console.log('---- APP ----');
    return [];
  },
});

export const Default: Story = () => ({
  component: App,
  template: () => html`<div data-component="App">
    <div data-component="ComponentA">
      <p>A</p>
      <ul>
        <li>context 1: <input data-ref="input1" /></li>
        <li>context 2: <input data-ref="input2" /></li>
      </ul>
      <div data-component="ComponentB">
        <p>B</p>
        <ul>
          <li>context1: <span data-ref="context1"></span></li>
          <li>context2: <span data-ref="context2"></span></li>
        </ul>
        <ul>
          <li>context 2: <input data-ref="input2" /></li>
        </ul>
        <div data-component="ComponentC">
          <p>C</p>
          <ul>
            <li>context1: <span data-ref="context1"></span></li>
            <li>context2: <span data-ref="context2"></span></li>
          </ul>
          <ul>
            <li>context 3: <input data-ref="input3" /></li>
          </ul>
          <div data-component="ComponentD">
            <p>D</p>
            <ul>
              <li>context1: <span data-ref="context1"></span></li>
              <li>context2: <span data-ref="context2"></span></li>
              <li>context3: <span data-ref="context3"></span></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>`,
});
