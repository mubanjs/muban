import { bind, refComponents, refElement } from '../..';
import { defineComponent } from '../Component';

describe('Apply event bindings', () => {
  it('should apply event bindings to a component', () => {
    const element = document.createElement('div');
    const button = document.createElement('button');

    element.setAttribute('data-component', 'my-component');
    button.setAttribute('data-ref', 'button');

    element.append(button);
    document.body.appendChild(element);

    const handleClick = jest.fn();

    defineComponent({
      name: 'my-component',
      refs: {
        button: refElement('button'),
      },
      setup({ refs }) {
        return [
          bind(refs.button, {
            event: {
              click: handleClick,
            },
          }),
        ];
      },
    })(element);

    button.click();
    expect(handleClick).toBeCalledTimes(1);
  });

  it('should apply event bindings to a component collection', () => {
    const ButtonComponent = defineComponent({
      name: 'button-component',
    });

    const element = document.createElement('div');
    const firstButton = document.createElement('button');
    const secondButton = document.createElement('button');
    const thirdButton = document.createElement('button');

    element.setAttribute('data-component', 'my-component');
    firstButton.setAttribute('data-component', 'button-component');
    secondButton.setAttribute('data-component', 'button-component');
    thirdButton.setAttribute('data-component', 'button-component');

    element.append(firstButton);
    element.append(secondButton);
    element.append(thirdButton);
    document.body.appendChild(element);

    const handleClick = jest.fn();

    defineComponent({
      name: 'my-component',
      refs: {
        buttons: refComponents(ButtonComponent),
      },
      setup({ refs }) {
        return [
          bind(refs.buttons, {
            event: {
              click: handleClick,
            },
          }),
        ];
      },
    })(element);

    firstButton.click();
    secondButton.click();
    thirdButton.click();

    expect(handleClick).toBeCalledTimes(3);
  });
});
