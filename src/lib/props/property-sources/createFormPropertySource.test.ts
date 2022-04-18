import type { PropTypeDefinition } from '../../..';
import type { PropTypeInfo } from '../propDefinitions.types';
import { createFormPropertySource } from './createFormPropertySource';

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
      const form = document.createElement('form');
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
      const form = document.createElement('form');
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
    it('Should return the input value if the target is a text input', () => {
      const form = document.createElement('form');
      form.innerHTML = `
        <input id="email" type="email" name="email" value="juan.polanco@mediamonks.com"/>
        <input id="password" type="password" name="password" value="123456"/>
        <textarea id="description" name="description">lorem ipsum</textarea>
      `;
      const emailInput: PropTypeInfo = {
        name: 'email',
        type: String,
        source: {
          name: '',
          target: form.querySelector<HTMLElement>('#email')!,
          type: 'form',
        },
      };
      const passwordInput: PropTypeInfo = {
        name: 'password',
        type: String,
        source: {
          name: '',
          target: form.querySelector<HTMLElement>('#password')!,
          type: 'form',
        },
      };
      const descriptionInput: PropTypeInfo = {
        name: 'description',
        type: String,
        source: {
          name: '',
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

    describe('checkbox', () => {
      const form = document.createElement('form');
      form.innerHTML = `
        <input id="onBoolean" name="onBoolean" type="checkbox" checked/>
        <input id="offBoolean" name="offBoolean" type="checkbox" />
        <input id="onString" name="onString" type="checkbox" checked/>
        <input id="offString" name="offString" type="checkbox" />
        <input id="onStringValue" name="onStringValue" type="checkbox" value="foo" checked />
        <input id="offStringValue" name="offStringValue" type="checkbox" value="foo" />
      `;

      function checkboxTemplate(
        config: Pick<PropTypeDefinition, 'type'> & {
          id: string;
        },
      ): PropTypeInfo {
        return {
          name: 'checkbox',
          type: config.type,
          source: {
            name: '',
            target: form.querySelector<HTMLElement>(`#${config.id}`)!,
            type: 'form',
          },
        };
      }

      it('Should return the checked value if the target is a checkbox and the propType is boolean', () => {
        const onBoolean = checkboxTemplate({ id: 'onBoolean', type: Boolean });
        const offBoolean = checkboxTemplate({ id: 'offBoolean', type: Boolean });

        expect(createFormPropertySource()(form).getProp(onBoolean)).toBe(true);
        expect(createFormPropertySource()(form).getProp(offBoolean)).toBe(false);
      });

      it('Should return the input value if the target is a checked checkbox and the propType is not boolean', () => {
        const onString = checkboxTemplate({ id: 'onString', type: String });
        const offString = checkboxTemplate({ id: 'offString', type: String });
        const onStringValue = checkboxTemplate({ id: 'onStringValue', type: String });
        const offStringValue = checkboxTemplate({ id: 'offStringValue', type: String });

        expect(createFormPropertySource()(form).getProp(onString)).toBe('on');
        expect(createFormPropertySource()(form).getProp(offString)).toBe(undefined);
        expect(createFormPropertySource()(form).getProp(onStringValue)).toBe('foo');
        expect(createFormPropertySource()(form).getProp(offStringValue)).toBe(undefined);
      });

      it('Should return an array of strings if the target is checkbox and the propType is Array', () => {
        const form = document.createElement('form');
        form.innerHTML = `
          <input name="choices" type="checkbox" value="apple" checked/>
          <input name="choices" type="checkbox" value="banana" checked />
          <input name="choices" type="checkbox" value="peach" />
          <input name="choices" type="checkbox" />
        `;
        const choices: PropTypeInfo = {
          name: 'checkbox',
          type: Array,
          source: {
            target: form,
            type: 'form',
            name: 'choices',
          },
        };
        expect(createFormPropertySource()(form).getProp(choices)).toEqual(['apple', 'banana']);
      });
    });

    it('Should return the select value if the target is a select that is not multiple', () => {
      const form = document.createElement('form');
      form.innerHTML = `
        <select id="preference" name="preference">
          <option value="foo" selected>foo</option>
          <option value="bar">bar</option>
        </select>
        <select id="preferenceBoolean" name="preferenceBoolean">
          <option value="true" selected>foo</option>
          <option value="false">bar</option>
        </select>
      `;
      const directSelect: PropTypeInfo = {
        name: 'select',
        type: String,
        source: {
          name: '',
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
      const form = document.createElement('form');
      form.innerHTML = `
        <select id="candidates" name="candidates" multiple>
          <option value="foo" selected>foo</option>
          <option value="bar" selected>bar</option>
        </select>
      `;
      const candidates: PropTypeInfo = {
        name: 'multiselect',
        type: Array,
        source: {
          name: '',
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

    it('Should return undefined when trying to get FormData not using type "Object"', () => {
      const form = document.createElement('form');
      const wrongTypePropInfo: PropTypeInfo = {
        name: 'myForm',
        type: String, // This should be Object
        source: {
          name: '',
          target: form,
          type: 'form',
          formData: true,
        },
      };
      expect(createFormPropertySource()(form).getProp(wrongTypePropInfo)).toBe(undefined);
    });

    it('Should return FormData when using type "Object" and an unnamed source', () => {
      const form = document.createElement('form');
      form.innerHTML = `
        <input id="email" type="email" name="email" value="juan.polanco@mediamonks.com"/>
      `;
      const validForm: PropTypeInfo = {
        name: 'myForm',
        type: Object,
        source: {
          name: '',
          target: form,
          type: 'form',
          formData: true,
        },
      };
      expect(createFormPropertySource()(form).getProp(validForm)).toBeInstanceOf(FormData);
      expect((createFormPropertySource()(form).getProp(validForm) as FormData).get('email')).toBe(
        'juan.polanco@mediamonks.com',
      );
    });

    it('Should return the input value when passing a form element and a named source', () => {
      const form = document.createElement('form');
      form.innerHTML = `
        <input id="email" type="email" name="email" value="juan.polanco@mediamonks.com"/>
      `;
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
