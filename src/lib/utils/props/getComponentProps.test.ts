import dedent from 'ts-dedent';
import { getComponentProps } from './getComponentProps';
import { createDataAttributePropertySource } from './property-sources/createDataAttributePropertySource';
import { createJsonScriptPropertySource } from './property-sources/createJsonScriptPropertySource';
import { createReactivePropertySource } from './property-sources/createReactivePropertySource';

describe('getComponentProps', () => {
  it('should return app props', () => {
    const sources = [
      createDataAttributePropertySource(),
      createJsonScriptPropertySource(),
      createReactivePropertySource(),
    ];

    const element = document.createElement('div');
    element.dataset.numberValue = '123.45';
    element.dataset.boolValueTrue = 'true';
    element.innerHTML = dedent`
      <script type="application/json">
      {
        "stringValue": "foobar",
        "boolValueFalse": false
      }
      </script>`;
    const propDefinition = {
      stringValue: { type: String },
      numberValue: { type: Number },
      boolValueTrue: { type: Boolean },
      boolValueFalse: { type: Boolean },
      // nonExitingValue: { type: String },
      // optionalNonExitingValue: { type: String, isOptional: true },
    };

    const value = getComponentProps(propDefinition, element, sources);
    expect(value).toEqual({
      stringValue: 'foobar',
      numberValue: 123.45,
      boolValueTrue: true,
      boolValueFalse: false,
    });
  });
});
