/* eslint-disable @typescript-eslint/no-non-null-assertion */
import type { PropTypeDefinition } from '../../..';
import type { PropTypeInfo } from '../propDefinitions.types';
import { createFormPropertySource } from './createFormPropertySource';
import { getFullPropTypeInfo } from './createFormPropertySource.testutils';

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
    describe('Text inputs', () => {
      const form = document.createElement('form');
      form.innerHTML = `
        <input id="email" type="email" name="email" value="juan.polanco@mediamonks.com"/>
        <input id="password" type="password" name="password" value="123456"/>
        <textarea id="description" name="description">lorem ipsum</textarea>
      `;
      const email = getFullPropTypeInfo('email', form);
      const password = getFullPropTypeInfo('password', form);
      const description = getFullPropTypeInfo('description', form);
      const formSource = createFormPropertySource()(form);

      describe('type String with an input target', () => {
        it('Should return the input value if the target is a text input', () => {
          expect(formSource.getProp(email.string.asInput)).toBe('juan.polanco@mediamonks.com');
          expect(formSource.getProp(password.string.asInput)).toBe('123456');
          expect(formSource.getProp(description.string.asInput)).toBe('lorem ipsum');
        });
      });

      describe('type String with a form target', () => {
        it('Should return the child input value if the target form', () => {
          expect(formSource.getProp(email.string.asForm)).toBe('juan.polanco@mediamonks.com');
          expect(formSource.getProp(password.string.asForm)).toBe('123456');
          expect(formSource.getProp(description.string.asForm)).toBe('lorem ipsum');
        });
      });
    });

    describe('Non String text inputs', () => {
      const form = document.createElement('form');
      form.innerHTML = `
        <input type="text" name="age" id="age" value="32"/>
        <input type="text" name="height" id="height" value="1.70"/>
        <input type="text" name="terms" id="terms" value="true"/>
        <input type="text" name="kids" id="kids" value="false"/>
        <input type="text" name="birthday" id="birthday" value="2022/06/06"/>
        <input type="text" name="pets" id="pets" value='["Armin", "Trico"]'/>
        <input type="text" name="area" id="area" value='{ "zip": "110010", "latlong": 1293847}'/>
      `;

      const age = getFullPropTypeInfo('age', form);
      const height = getFullPropTypeInfo('height', form);
      const terms = getFullPropTypeInfo('terms', form);
      const kids = getFullPropTypeInfo('kids', form);
      const birthday = getFullPropTypeInfo('birthday', form);
      const pets = getFullPropTypeInfo('pets', form);
      const area = getFullPropTypeInfo('area', form);
      const source = createFormPropertySource()(form);

      it('Should return transformed input values for all possible types', () => {
        expect(source.getProp(age.number.asInput)).toBe(32);
        expect(source.getProp(height.number.asInput)).toBe(1.7);
        expect(source.getProp(terms.boolean.asInput)).toBe(true);
        expect(source.getProp(kids.boolean.asInput)).toBe(false);
        expect(source.getProp(birthday.date.asInput)).toBeInstanceOf(Date);
        expect(source.getProp(pets.array.asInput)).toEqual(['Armin', 'Trico']);
        expect(source.getProp(area.object.asInput)).toEqual({ zip: '110010', latlong: 1293847 });
      });

      it('Should return the same transformed input values when passing an input element target and a form element target', () => {
        expect(source.getProp(age.number.asInput)).toBe(source.getProp(age.number.asForm));
        expect(source.getProp(age.number.asInput)).toBe(source.getProp(age.number.asForm));
        expect(source.getProp(height.number.asInput)).toBe(source.getProp(height.number.asForm));
        expect(source.getProp(terms.boolean.asInput)).toBe(source.getProp(terms.boolean.asForm));
        expect(source.getProp(kids.boolean.asInput)).toBe(source.getProp(kids.boolean.asForm));
        expect(source.getProp(birthday.date.asInput)).toEqual(source.getProp(birthday.date.asForm));
        expect(source.getProp(pets.array.asInput)).toEqual(source.getProp(pets.array.asForm));
        expect(source.getProp(area.object.asInput)).toEqual(source.getProp(area.object.asForm));
      });
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

      const onBoolean = getFullPropTypeInfo('onBoolean', form);
      const offBoolean = getFullPropTypeInfo('offBoolean', form);
      const onString = getFullPropTypeInfo('onString', form);
      const offString = getFullPropTypeInfo('offString', form);
      const onStringValue = getFullPropTypeInfo('onStringValue', form);
      const offStringValue = getFullPropTypeInfo('offStringValue', form);

      it('Should return the checked value if the target is a checkbox and the propType is boolean', () => {
        expect(createFormPropertySource()(form).getProp(onBoolean.boolean.asInput)).toBe(true);
        expect(createFormPropertySource()(form).getProp(offBoolean.boolean.asInput)).toBe(false);
      });

      it('Should return the input value if the target is a checked checkbox and the propType is not boolean', () => {
        expect(createFormPropertySource()(form).getProp(onString.string.asInput)).toBe('on');
        expect(createFormPropertySource()(form).getProp(offString.string.asInput)).toBe(undefined);
        expect(createFormPropertySource()(form).getProp(onStringValue.string.asInput)).toBe('foo');
        expect(createFormPropertySource()(form).getProp(offStringValue.string.asInput)).toBe(
          undefined,
        );
      });

      it('Should return an array of strings if the target is a form with multiple checkboxes with the same name and the propType is Array', () => {
        const checkboxesForm = document.createElement('form');
        checkboxesForm.innerHTML = `
          <input name="choices" type="checkbox" value="apple" checked/>
          <input name="choices" type="checkbox" value="banana" checked />
          <input name="choices" type="checkbox" value="peach" />
          <input name="choices" type="checkbox" />
        `;
        const choices = getFullPropTypeInfo('checkbox', checkboxesForm, 'choices');

        expect(createFormPropertySource()(checkboxesForm).getProp(choices.array.asForm)).toEqual([
          'apple',
          'banana',
        ]);
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
      const select = getFullPropTypeInfo('select', form, 'preference');
      const selectBoolean = getFullPropTypeInfo('select', form, 'preferenceBoolean');
      expect(createFormPropertySource()(form).getProp(selectBoolean.boolean.asInput)).toBe(true);
      expect(createFormPropertySource()(form).getProp(selectBoolean.boolean.asForm)).toBe(true);
      expect(createFormPropertySource()(form).getProp(select.string.asInput)).toBe('foo');
      expect(createFormPropertySource()(form).getProp(select.string.asForm)).toBe('foo');
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

    it('Should return undefined when passing a form an an unmatching name', () => {
      const form = document.createElement('form');
      const unmatchingName: PropTypeInfo = {
        name: 'myForm',
        type: String,
        source: {
          name: 'nomatch',
          target: form,
          type: 'form',
        },
      };
      expect(createFormPropertySource()(form).getProp(unmatchingName)).toBe(undefined);
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
