import dedent from 'ts-dedent';
import { propType, refElement } from '../..';
import { createComponentInstance, defineComponent } from '../Component';
import { createComponentRefs } from '../refs/createComponentRefs';
import {
  getComponentProps,
  getValueFromMultipleSources,
  getValueFromSource,
} from './getComponentProps';
import { createClassListPropertySource } from './property-sources/createClassListPropertySource';
import { createDataAttributePropertySource } from './property-sources/createDataAttributePropertySource';
import { createJsonScriptPropertySource } from './property-sources/createJsonScriptPropertySource';
import { createReactivePropertySource } from './property-sources/createReactivePropertySource';

describe('getValueFromSource', () => {
  it('should return the value for the source provided', () => {
    const sources = [
      createDataAttributePropertySource(),
      createJsonScriptPropertySource(),
      createClassListPropertySource(),
      createReactivePropertySource(),
    ];

    const element = document.createElement('div');
    const input = document.createElement('input');
    element.setAttribute('data-component', 'my-component');
    input.setAttribute('data-ref', 'input');
    input.setAttribute('value', 'success');
    element.appendChild(input);
    document.body.appendChild(element);

    const MyComponent = defineComponent({
      name: 'my-component',
      refs: {
        content: refElement('content'),
      },
      props: {
        inputValue: propType.boolean.source({ type: 'attr', target: 'input', name: 'value' }),
      },
      setup({ props }) {
        console.log(props);
        return [];
      },
    })(element);

    console.log(MyComponent.props);
    expect(MyComponent.props.inputValue).toBe('success');
  });
  it('should return a valid value when an array of source definitions is provided', () => {});
});
