import type { PropTypeInfo } from '../propDefinitions.types';
import { createFormPropertySource } from './createFormPropertySource';

const form = document.createElement('form');
form.innerHTML = `
  <input type="email" name="email" value="juan.polanco@mediamonks.com"/>
  <input type="password" name="password" value="123456"/>
  <textarea name="description">lorem ipsum</textarea>
  <select name="preference">
    <option value="foo">foo</option>
    <option value="bar">bar</option>
  </select>
  <input name="optionA" type="checkbox" />
  <input name="optionB" type="checkbox" checked />
  <input name="choices" type="checkbox" value="apple" />
  <input name="choices" type="checkbox" value="banana" checked />
  <select name="candidates" multiple>
   <option value="foo" selected>foo</option>
    <option value="bar" selected>bar</option>
  </select>
  <input name="photo" type="file" />
`;

describe('createFormPropertySource', () => {
  describe('function itself', () => {
    it('should create without errors', () => {
      expect(createFormPropertySource).not.toThrow();
    });
    it('should allow calling the created source without errors', () => {
      expect(createFormPropertySource()).not.toThrow();
    });
  });

  describe('hasProp', () => {
    it('should return false if the type is "Function"', () => {
      const functionPropInfo: PropTypeInfo = {
        name: 'email',
        type: Function,
        source: {
          name: 'email',
          target: form,
          type: 'form',
        },
      };
      expect(createFormPropertySource()(form).hasProp(functionPropInfo)).toBe(false);
    });
    it('should return true if the type is different than "Function"', () => {
      const validPropInfoTypes = [Number, String, Boolean, Date, Array, Object];
      const propInfos: Array<PropTypeInfo> = validPropInfoTypes.map((type) => ({
        name: 'foo',
        type,
        source: {
          name: 'foo',
          target: form,
          type: 'form',
        },
      }));
      propInfos.forEach((propInfo) => {
        expect(createFormPropertySource()(form).hasProp(propInfo)).toBe(true);
      });
    });
  });

  describe('getProp', () => {
    it('Should return the input value if the target is an input and the type is not "checkbox"', () => {});
    it('Should return the checked value if the target is a checkbox and the propType is boolean', () => {});
    it('Should return the input value if the target is a checked checkbox and the propType is not boolean', () => {});
    it('Should return the input value if the target is a checked checkbox and the propType is not boolean', () => {});
    it('Should return the select value if the target is a select that is not multiple', () => {});
    it('Should return an array of strings if the target is a multiselect', () => {});
    it('Should return an array of strings if the target is a multiselect', () => {});
    it('Should return an array of strings if propType is array and the target is a checkbox', () => {});
    it('Should return a File if the target is an input with type "file"', () => {});
    it('Should return a FileList if the target is an input with type "file" and is multiple', () => {});
    it('Should return a FileList if the target is an input with type "file" and is multiple', () => {});
    it('Should return undefined when trying to get FormData not using type "Object"', () => {
      const wrongTypePropInfo: PropTypeInfo = {
        name: 'myForm',
        type: String, // This should be Object
        source: {
          target: form,
          type: 'form',
        },
      };
      expect(createFormPropertySource()(form).getProp(wrongTypePropInfo)).toBe(undefined);
    });
    it('Should return FormData when using type "Object" and an unnamed source', () => {
      const wrongTypePropInfo: PropTypeInfo = {
        name: 'myForm',
        type: Object,
        source: {
          target: form,
          type: 'form',
        },
      };
      expect(createFormPropertySource()(form).getProp(wrongTypePropInfo)).toBeInstanceOf(FormData);
      expect(
        (createFormPropertySource()(form).getProp(wrongTypePropInfo) as FormData).get('email'),
      ).toBe('juan.polanco@mediamonks.com');
    });
    it('Should return the input value when passing a form element and a named source', () => {
      const formDataValuePropInfo: PropTypeInfo = {
        name: 'myForm',
        type: String,
        source: {
          target: form,
          type: 'form',
          name: 'email',
        },
      };
      expect(createFormPropertySource()(form).getProp(formDataValuePropInfo)).toBe(
        'juan.polanco@mediamonks.com',
      );
    });
  });
});
