import { html } from '@muban/template';
import type { Story } from '@muban/storybook';
import {
  bind,
  defineComponent,
  computed,
  ref,
  refCollection,
  ComponentFactory,
} from '@muban/muban';
import { screen, userEvent } from '@storybook/testing-library';
import { expect } from '@storybook/jest';
import type { Binding } from '../../../../../types/lib/bindings/bindings.types';

export default {
  title: 'bindings/css',
};

const cssTemplate = () => html` <div data-component="css">
  <div data-ref="box" data-testid="box" class="box bg-primary">
    <p>css: <span data-ref="info"></span></p>
  </div>
  <p>
    <input data-ref="checkbox" data-testid="checkbox-box" type="checkbox" value="box" disabled />
    .box
  </p>
  <p>
    <input
      data-ref="checkbox"
      data-testid="checkbox-bg-primary"
      type="checkbox"
      value="bg-primary"
    />
    .bg-primary
  </p>
  <p>
    <input
      data-ref="checkbox"
      data-testid="checkbox-text-success"
      type="checkbox"
      value="text-success"
    />
    .text-success
  </p>
  <p>
    <input data-ref="checkbox" data-testid="checkbox-fs-3" type="checkbox" value="fs-3" /> .fs-3
  </p>
</div>`;

const interactiveTest = async () => {
  await expect(screen.getByTestId('box').classList.value).toBe('box bg-primary');
  await userEvent.click(screen.getByTestId('checkbox-text-success'));
  await expect(screen.getByTestId('box').classList.value).toBe('box bg-primary text-success');
  await userEvent.click(screen.getByTestId('checkbox-fs-3'));
  await expect(screen.getByTestId('box').classList.value).toBe('box bg-primary text-success fs-3');
  await userEvent.click(screen.getByTestId('checkbox-bg-primary'));
  await expect(screen.getByTestId('box').classList.value).toBe('box text-success fs-3');
  await userEvent.click(screen.getByTestId('checkbox-text-success'));
  await expect(screen.getByTestId('box').classList.value).toBe('box fs-3');
  await userEvent.click(screen.getByTestId('checkbox-fs-3'));
  await expect(screen.getByTestId('box').classList.value).toBe('box');
};

const createCssComponent = (setup: (context) => Array<Binding>) => {
  return defineComponent({
    name: 'css',
    refs: {
      box: 'box',
      info: 'info',
      checkboxes: refCollection('checkbox'),
    },
    setup,
  });
};

const createCssStory = (component: ComponentFactory<any>) => {
  return {
    render() {
      return {
        component,
        template: cssTemplate,
      };
    },
    play: interactiveTest,
  };
};

export const CssObject: Story = createCssStory(
  createCssComponent(({ refs }) => {
    const classList = Array.from(
      refs.checkboxes.getElements(),
      (checkbox) => (<HTMLInputElement>checkbox).defaultValue,
    );
    const checkedClasses = ref(['box', 'bg-primary']);
    const selectedClasses = computed(() =>
      classList.reduce((o, key) => ({ ...o, [key]: checkedClasses.value.includes(key) }), {}),
    );
    return [
      bind(refs.info, { text: computed(() => JSON.stringify(selectedClasses.value)) }),
      bind(refs.box, { css: selectedClasses }),
      bind(refs.checkboxes, { checked: checkedClasses, initialValueSource: 'binding' }),
    ];
  }),
);

export const CssString: Story = createCssStory(
  createCssComponent(({ refs }) => {
    const checkedClasses = ref(['box', 'bg-primary']);
    const classList = computed(() => checkedClasses.value.join(' '));
    return [
      bind(refs.info, { text: classList }),
      bind(refs.box, { css: classList }),
      bind(refs.checkboxes, { checked: checkedClasses, initialValueSource: 'binding' }),
    ];
  }),
);
