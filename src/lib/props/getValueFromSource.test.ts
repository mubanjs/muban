import dedent from 'ts-dedent';
import { propType, refElement } from '../..';
import { defineComponent } from '../Component';

describe('getValueFromSource', () => {
  it('should return the value for the source provided', () => {
    const element = document.createElement('div');
    element.setAttribute('data-component', 'my-component');

    element.innerHTML = dedent`
      <input data-ref="input" value="success" />
    `;

    document.body.appendChild(element);

    const MyComponent = defineComponent({
      name: 'my-component',
      refs: {
        input: refElement('input'),
      },
      props: {
        inputValue: propType.string.source({ type: 'attr', target: 'input', name: 'value' }),
      },
    })(element);

    expect(MyComponent.props.inputValue).toBe('success');
  });
  it('should return a valid value when an array of source definitions is provided', () => {
    const element = document.createElement('div');
    element.setAttribute('data-component', 'my-component');

    element.innerHTML = dedent`
      <input data-ref="input" value="value-from-attr" data-value="value-from-data" />
    `;

    document.body.appendChild(element);

    const MyComponent = defineComponent({
      name: 'my-component',
      refs: {
        input: refElement('input'),
      },
      props: {
        value: propType.string.source([
          { type: 'attr', target: 'idnput', name: 'value' }, // idnput target does not exist
          { type: 'data', target: 'input' },
        ]),
      },
    })(element);

    expect(MyComponent.props.value).toBe('value-from-data');
  });
});
