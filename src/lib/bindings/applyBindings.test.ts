import dedent from 'ts-dedent';
import { bind, refComponents, refComponent } from '../..';
import { defineComponent } from '../Component';

describe('Apply event bindings', () => {
  const ButtonComponent = defineComponent({ name: 'button-component' });

  it('should apply event bindings to a component', () => {
    const element = document.createElement('div');
    element.setAttribute('data-component', 'my-component');
    element.innerHTML = dedent`
      <button data-component="button-component">Click me!</button>
    `;
    document.body.appendChild(element);

    const handleClick = jest.fn();

    const MyComponent = defineComponent({
      name: 'my-component',
      refs: {
        button: refComponent(ButtonComponent),
      },
      setup({ refs }) {
        return [
          bind(refs.button, {
            $element: {
              event: {
                click: handleClick,
              },
            },
          }),
        ];
      },
    })(element);

    MyComponent.element.querySelector('button')?.click();
    expect(handleClick).toBeCalledTimes(1);
  });

  it('should apply event bindings to a component collection', () => {
    const element = document.createElement('div');
    element.setAttribute('data-component', 'my-component');
    element.innerHTML = dedent`
      <button data-component="button-component">Click me!</button>
      <button data-component="button-component">Click me!</button>
      <button data-component="button-component">Click me!</button>
    `;
    document.body.appendChild(element);

    const handleClick = jest.fn();

    const MyComponent = defineComponent({
      name: 'my-component',
      refs: {
        buttons: refComponents(ButtonComponent),
      },
      setup({ refs }) {
        return [
          bind(refs.buttons, {
            $element: {
              event: {
                click: handleClick,
              },
            },
          }),
        ];
      },
    })(element);

    MyComponent.element.querySelectorAll('button').forEach((button) => button.click());
    expect(handleClick).toBeCalledTimes(3);
  });
});
