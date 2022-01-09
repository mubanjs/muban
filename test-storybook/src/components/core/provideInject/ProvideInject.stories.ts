import { html } from '@muban/template';
import type { Story } from '@muban/storybook';
import type { Ref } from '@muban/muban';
import { defineComponent, provide, inject, bind, ref } from '@muban/muban';
import { screen, userEvent, waitFor } from '@storybook/testing-library';
import { expect } from '@storybook/jest';

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
      bind(refs.input3, { textInput: value3, initialValueSource: 'binding' }),
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
      bind(refs.input2, { textInput: value2, initialValueSource: 'binding' }),
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

    return [
      bind(refs.input1, { textInput: value1, initialValueSource: 'binding' }),
      bind(refs.input2, { textInput: value2, initialValueSource: 'binding' }),
    ];
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

function contextInput({ which, component }: { which: number; component: string }, ref?: string) {
  return html`<div class="form-floating mb-3">
    <input
      data-testid="component${component}-input${which}"
      data-ref="${ref}"
      type="text"
      class="form-control"
      id=${ref}
      placeholder="Context ${which}"
    />
    <label for=${ref}>Context ${which}</label>
  </div>`;
}

function contextInfo({ which, component }: { which: number; component: string }) {
  return html`
    <li class="list-group-item d-flex justify-content-between align-items-center">
      Context ${which}
      <span
        data-testid="component${component}-context${which}"
        data-ref=${`context${which}`}
        class="badge bg-primary rounded-pill"
      ></span>
    </li>
  `;
}

export const Default: Story = {
  render() {
    return {
      component: App,
      template: () => html`<div data-component="App">
        <div class="alert alert-primary">
          <h5 class="alert-heading">Instructions!</h5>
          <p class="mb-0">
            This Story similated 4 nested components, where values are injected and overridden at
            different levels. It tests if provided values are correctly show up in inherited
            components.
          </p>
        </div>
        <div
          data-component="ComponentA"
          class="card border-secondary mb-3"
          style="max-width: 30rem;"
        >
          <div>
            <div class="card-header">Component A</div>
            <div class="card-body">
              <h5 class="card-title">Inject context</h5>
              <div class="form-group">
                ${contextInput({ which: 1, component: 'A' }, 'input1')}
                ${contextInput({ which: 2, component: 'A' }, 'input2')}
              </div>
            </div>

            <div data-component="ComponentB" class="card border-secondary m-3 mt-0">
              <div class="card-header">Component B</div>
              <div class="card-body">
                <h5 class="card-title">Provided context</h5>
                <ul class="list-group">
                  ${contextInfo({ which: 1, component: 'B' })}
                  ${contextInfo({ which: 2, component: 'B' })}
                </ul>
                <h5 class="card-title mt-3">Inject context</h5>
                <div class="form-group">
                  ${contextInput({ which: 2, component: 'B' }, 'input2')}
                </div>
              </div>
              <div data-component="ComponentC" class="card border-secondary m-3 mt-0">
                <div class="card-header">Component C</div>
                <div class="card-body">
                  <h5 class="card-title">Provided context</h5>
                  <ul class="list-group">
                    ${contextInfo({ which: 1, component: 'C' })}
                    ${contextInfo({ which: 2, component: 'C' })}
                  </ul>
                  <h5 class="card-title mt-3">Inject context</h5>
                  <div class="form-group">
                    ${contextInput({ which: 3, component: 'C' }, 'input3')}
                  </div>
                </div>
                <div data-component="ComponentD" class="card border-secondary m-3 mt-0">
                  <div class="card-header">Component D</div>
                  <div class="card-body">
                    <h5 class="card-title">Provided context</h5>

                    <ul class="list-group">
                      ${contextInfo({ which: 1, component: 'D' })}
                      ${contextInfo({ which: 2, component: 'D' })}
                      ${contextInfo({ which: 3, component: 'D' })}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>`,
    };
  },
  async play() {
    expect(screen.getByTestId('componentB-context1').textContent).toBe('componentA');
    expect(screen.getByTestId('componentB-context2').textContent).toBe('componentA');

    expect(screen.getByTestId('componentC-context1').textContent).toBe('componentA');
    expect(screen.getByTestId('componentC-context2').textContent).toBe('componentB');

    expect(screen.getByTestId('componentD-context1').textContent).toBe('componentA');
    expect(screen.getByTestId('componentD-context2').textContent).toBe('componentB');
    expect(screen.getByTestId('componentD-context3').textContent).toBe('componentC');

    // change context 1
    userEvent.clear(screen.getByTestId('componentA-input1'));
    userEvent.type(screen.getByTestId('componentA-input1'), 'AA');

    await waitFor(() => expect(screen.getByTestId('componentB-context1').textContent).toBe('AA'));
    expect(screen.getByTestId('componentC-context1').textContent).toBe('AA');
    expect(screen.getByTestId('componentD-context1').textContent).toBe('AA');

    // change context 2 - Component A
    userEvent.clear(screen.getByTestId('componentA-input2'));
    userEvent.type(screen.getByTestId('componentA-input2'), 'AAA');

    await waitFor(() => expect(screen.getByTestId('componentB-context2').textContent).toBe('AAA'));
    await waitFor(() =>
      expect(screen.getByTestId('componentC-context2').textContent).toBe('componentB'),
    );
    await waitFor(() =>
      expect(screen.getByTestId('componentD-context2').textContent).toBe('componentB'),
    );

    // change context 2 - Component B
    userEvent.clear(screen.getByTestId('componentB-input2'));
    userEvent.type(screen.getByTestId('componentB-input2'), 'BB');

    await waitFor(() => expect(screen.getByTestId('componentB-context2').textContent).toBe('AAA'));
    await waitFor(() => expect(screen.getByTestId('componentC-context2').textContent).toBe('BB'));
    await waitFor(() => expect(screen.getByTestId('componentD-context2').textContent).toBe('BB'));

    // change context 3 - Component C
    userEvent.clear(screen.getByTestId('componentC-input3'));
    userEvent.type(screen.getByTestId('componentC-input3'), 'CC');

    await waitFor(() => expect(screen.getByTestId('componentD-context3').textContent).toBe('CC'));
  },
};
