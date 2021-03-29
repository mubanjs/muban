import dedent from 'ts-dedent';
import { createComponentInstance } from '../Component';
import { createComponentRefs } from '../refs/createComponentRefs';
import { getComponentProps } from './getComponentProps';
import { createClassListPropertySource } from './property-sources/createClassListPropertySource';
import { createDataAttributePropertySource } from './property-sources/createDataAttributePropertySource';
import { createJsonScriptPropertySource } from './property-sources/createJsonScriptPropertySource';
import { createReactivePropertySource } from './property-sources/createReactivePropertySource';

describe('getComponentProps', () => {
  it('should return app props', () => {
    const sources = [
      createDataAttributePropertySource(),
      createJsonScriptPropertySource(),
      createClassListPropertySource(),
      createReactivePropertySource(),
    ];

    const element = document.createElement('div');
    element.dataset.dataComponent = 'my-component';
    element.dataset.numberValue = '123.45';
    element.dataset.boolValueTrue = 'true';
    element.innerHTML = dedent`
      <script type="application/json">
      {
        "stringValue": "foobar",
        "boolValueFalse": false
      }
      </script>`;
    const refDefinition = {};
    const propDefinition = {
      stringValue: { type: String },
      numberValue: { type: Number },
      boolValueTrue: { type: Boolean },
      boolValueFalse: { type: Boolean },
      // nonExitingValue: { type: String },
      // optionalNonExitingValue: { type: String, isOptional: true },
    };

    const instance = createComponentInstance({}, element, { name: 'foo', setup: () => [] });

    const instanceRefs = createComponentRefs(refDefinition, instance);

    const value = getComponentProps(propDefinition, element, sources, instanceRefs);
    expect(value).toEqual({
      stringValue: 'foobar',
      numberValue: 123.45,
      boolValueTrue: true,
      boolValueFalse: false,
    });
  });
});
