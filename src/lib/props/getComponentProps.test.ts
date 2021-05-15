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
  it('should return default values for missing props', () => {
    const sources = [
      createDataAttributePropertySource(),
      createJsonScriptPropertySource(),
      createClassListPropertySource(),
      createReactivePropertySource(),
    ];

    const defaultDate = new Date();
    const defaultFn = () => void 0;
    const element = document.createElement('div');
    const refDefinition = {};
    const propDefinition = {
      stringValue: { type: String, isOptional: true, default: 'foo' },
      numberValue: { type: Number, isOptional: true, default: 0 },
      boolValueTrue: { type: Boolean, isOptional: true, default: true },
      boolValueFalse: { type: Boolean, isOptional: true, default: false },
      dateValue: { type: Date, isOptional: true, default: defaultDate },
      fnValue: { type: Date, isOptional: true, default: defaultFn },
    };

    const instance = createComponentInstance({}, element, { name: 'foo', setup: () => [] });

    const instanceRefs = createComponentRefs(refDefinition, instance);

    const value = getComponentProps(propDefinition, element, sources, instanceRefs);

    expect(value).toEqual({
      stringValue: 'foo',
      numberValue: 0,
      boolValueTrue: true,
      boolValueFalse: false,
      dateValue: defaultDate,
      fnValue: defaultFn,
    });
  });
});
