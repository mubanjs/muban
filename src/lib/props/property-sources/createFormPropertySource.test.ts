import dedent from 'ts-dedent';
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

    describe('radio', () => {
      const form = document.createElement('form');
      form.innerHTML = `
        <input id="onBoolean" value="single" name="maritalStatus" type="radio" checked/>
        <input id="offBoolean" value="married" name="maritalStatus" type="radio" />
      `;

      const radioDirectValue = getFullPropTypeInfo('offBoolean', form);
      const radioFormDataValue = getFullPropTypeInfo('onBoolean', form, 'maritalStatus');

      it('Should show a warning message and return the input value when trying to get a radio button value directly', () => {
        const consoleSpy = jest.spyOn(console, 'warn');

        expect(createFormPropertySource()(form).getProp(radioDirectValue.string.asInput)).toBe(
          'married',
        );

        expect(consoleSpy)
          .toHaveBeenCalledWith(dedent`The property "offBoolean" is trying to get a radio button value but the target is not the parent form, if you have multiple radio buttons with a shared name use the parent form as target
          Returning the input value "married" despite the fact it could be unchecked.`);
      });

      it('Should return the selected radio value when using the parent form as a target', () => {
        expect(createFormPropertySource()(form).getProp(radioFormDataValue.string.asForm)).toBe(
          'single',
        );
      });
    });

    describe('select', () => {
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
        const candidates = getFullPropTypeInfo('multiselect', form, 'candidates');

        expect(createFormPropertySource()(form).getProp(candidates.array.asForm)).toEqual([
          'foo',
          'bar',
        ]);
        expect(createFormPropertySource()(form).getProp(candidates.array.asInput)).toEqual([
          'foo',
          'bar',
        ]);
      });
    });

    describe('form', () => {
      it('Should return undefined when passing a form as target and an unmatching child input', () => {
        const form = document.createElement('form');
        const unmatchingName = getFullPropTypeInfo('myForm', form, 'nomatch');

        expect(createFormPropertySource()(form).getProp(unmatchingName.string.asForm)).toBe(
          undefined,
        );
      });

      it('Should return undefined when using formData: true and a type different than Object', () => {
        const form = document.createElement('form');
        const validForm = getFullPropTypeInfo('validForm', form, undefined, true);
        const formData = createFormPropertySource()(form).getProp(validForm.number.asForm);
        expect(formData).toBe(undefined);
      });

      it('Should return FormData object when using type "Object" and formData: true', () => {
        const form = document.createElement('form');
        form.innerHTML = `
          <input id="email" type="email" name="email" value="juan.polanco@mediamonks.com"/>
        `;
        const validForm = getFullPropTypeInfo('validForm', form, undefined, true);
        const formData = createFormPropertySource()(form).getProp(validForm.object.asForm);

        expect(formData).toBeInstanceOf(FormData);
        expect((formData as FormData).get('email')).toBe('juan.polanco@mediamonks.com');
      });
    });
  });
});
