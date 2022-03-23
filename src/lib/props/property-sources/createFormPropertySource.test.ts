import type { PropTypeInfo } from '../propDefinitions.types';
import { createFormPropertySource } from './createFormPropertySource';

const form = document.createElement('form');
form.innerHTML = `
  <input id="email" type="email" name="email" value="juan.polanco@mediamonks.com"/>
  <input id="password" type="password" name="password" value="123456"/>
  <textarea id="description" name="description">lorem ipsum</textarea>
  <select id="preference" name="preference">
    <option value="foo" selected>foo</option>
    <option value="bar">bar</option>
  </select>
  <select id="preferenceBoolean" name="preferenceBoolean">
    <option value="true" selected>foo</option>
    <option value="false">bar</option>
  </select>
  <input id="optionA" name="optionA" type="checkbox" />
  <input id="optionB" name="optionB" type="checkbox" value="foo" checked />
  <input id="choices" name="choices" type="checkbox" value="apple" checked/>
  <input id="checkedChoices" name="choices" type="checkbox" value="banana" checked />
  <select id="candidates" name="candidates" multiple>
   <option value="foo" selected>foo</option>
    <option value="bar" selected>bar</option>
  </select>
  <input id="photo" name="photo" type="file" />
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
    it('Should return the input value if the target is an input and the type is not "checkbox"', () => {
      const emailInput: PropTypeInfo = {
        name: 'email',
        type: String,
        source: {
          target: form.querySelector<HTMLElement>('#email')!,
          type: 'form',
        },
      };
      const passwordInput: PropTypeInfo = {
        name: 'password',
        type: String,
        source: {
          target: form.querySelector<HTMLElement>('#password')!,
          type: 'form',
        },
      };
      const descriptionInput: PropTypeInfo = {
        name: 'description',
        type: String,
        source: {
          target: form.querySelector<HTMLElement>('#description')!,
          type: 'form',
        },
      };
      expect(createFormPropertySource()(form).getProp(emailInput)).toBe(
        'juan.polanco@mediamonks.com',
      );
      expect(createFormPropertySource()(form).getProp(passwordInput)).toBe('123456');
      expect(createFormPropertySource()(form).getProp(descriptionInput)).toBe('lorem ipsum');
    });
    it('Should return the checked value if the target is a checkbox and the propType is boolean', () => {
      const optionA: PropTypeInfo = {
        name: 'checkbox',
        type: Boolean,
        source: {
          target: form.querySelector<HTMLElement>('#optionA')!,
          type: 'form',
        },
      };
      const optionB: PropTypeInfo = {
        name: 'checkbox',
        type: Boolean,
        source: {
          target: form.querySelector<HTMLElement>('#optionB')!,
          type: 'form',
        },
      };
      expect(createFormPropertySource()(form).getProp(optionA)).toBe(false);
      expect(createFormPropertySource()(form).getProp(optionB)).toBe(true);
    });
    it('Should return the input value if the target is a checked checkbox and the propType is not boolean', () => {
      const optionB: PropTypeInfo = {
        name: 'checkbox',
        type: String,
        source: {
          target: form.querySelector<HTMLElement>('#optionB')!,
          type: 'form',
        },
      };
      expect(createFormPropertySource()(form).getProp(optionB)).toBe('foo');
    });
    it('Should return an array of strings if the target is checkbox and the propType is Array', () => {
      const choices: PropTypeInfo = {
        name: 'checkbox',
        type: Array,
        source: {
          target: form,
          type: 'form',
          name: 'choices',
        },
      };
      expect(JSON.stringify(createFormPropertySource()(form).getProp(choices))).toStrictEqual(
        JSON.stringify(['apple', 'banana']),
      );
    });
    it('Should return the select value if the target is a select that is not multiple', () => {
      const directSelect: PropTypeInfo = {
        name: 'select',
        type: String,
        source: {
          target: form.querySelector<HTMLElement>('#preference')!,
          type: 'form',
        },
      };
      const formDataSelect: PropTypeInfo = {
        name: 'select',
        type: String,
        source: {
          target: form,
          type: 'form',
          name: 'preference',
        },
      };
      const selectBoolean: PropTypeInfo = {
        name: 'select',
        type: Boolean,
        source: {
          target: form,
          type: 'form',
          name: 'preferenceBoolean',
        },
      };
      expect(createFormPropertySource()(form).getProp(selectBoolean)).toBe(true);
      expect(createFormPropertySource()(form).getProp(directSelect)).toBe('foo');
      expect(createFormPropertySource()(form).getProp(formDataSelect)).toBe('foo');
    });
    it('Should return an array of strings if the target is a multiselect', () => {
      const candidates: PropTypeInfo = {
        name: 'multiselect',
        type: Array,
        source: {
          target: form.querySelector<HTMLElement>('#candidates')!,
          type: 'form',
        },
      };
      const candidatesFromFormData: PropTypeInfo = {
        name: 'multiselect',
        type: Array,
        source: {
          target: form,
          type: 'form',
          name: 'candidates',
        },
      };
      expect(JSON.stringify(createFormPropertySource()(form).getProp(candidates))).toStrictEqual(
        JSON.stringify(['foo', 'bar']),
      );
      expect(
        JSON.stringify(createFormPropertySource()(form).getProp(candidatesFromFormData)),
      ).toStrictEqual(JSON.stringify(['foo', 'bar']));
    });
    it('Should return a File if the target is an input with type "file"', () => {
      const photo: PropTypeInfo = {
        name: 'file',
        type: Object,
        source: {
          target: form.querySelector<HTMLElement>('#photo')!,
          type: 'form',
        },
      };
      expect(createFormPropertySource()(form).getProp(photo)).toBe(undefined);
    });
    it('Should return a FileList if the target is an input with type "file" and is type Array', () => {
      const photoArray: PropTypeInfo = {
        name: 'file',
        type: Array,
        source: {
          target: form.querySelector<HTMLElement>('#photo')!,
          type: 'form',
        },
      };
      expect(createFormPropertySource()(form).getProp(photoArray)).toBe(undefined);
    });
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
      const validForm: PropTypeInfo = {
        name: 'myForm',
        type: Object,
        source: {
          target: form,
          type: 'form',
        },
      };
      expect(createFormPropertySource()(form).getProp(validForm)).toBeInstanceOf(FormData);
      expect((createFormPropertySource()(form).getProp(validForm) as FormData).get('email')).toBe(
        'juan.polanco@mediamonks.com',
      );
    });
    it('Should return the input value when passing a form element and a named source', () => {
      const validForm: PropTypeInfo = {
        name: 'myForm',
        type: String,
        source: {
          target: form,
          type: 'form',
          name: 'email',
        },
      };
      expect(createFormPropertySource()(form).getProp(validForm)).toBe(
        'juan.polanco@mediamonks.com',
      );
    });
  });
});
