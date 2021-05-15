/* eslint-disable @typescript-eslint/ban-ts-comment */
import { isNumber, isString } from 'isntnt';
import { propType } from './propDefinitions';

describe('propDefinitions', () => {
  describe('propType.string', () => {
    it('should return default', () => {
      expect(propType.string).toMatchObject({ type: String });
      expect(propType.string.optional).not.toBeUndefined();
      expect(propType.string.defaultValue).not.toBeUndefined();
      expect(propType.string.validate).not.toBeUndefined();
      expect(propType.string.source).not.toBeUndefined();
    });
    it('should return optional', () => {
      expect(propType.string.optional).toMatchObject({
        type: String,
        isOptional: true,
        missingValue: true,
      });
      expect(propType.string.optional.validate).not.toBeUndefined();
      expect(propType.string.optional.source).not.toBeUndefined();
      // @ts-expect-error
      expect(propType.string.optional.defaultValue).toBeUndefined();
    });
    it('should return defaultValue', () => {
      expect(propType.string.defaultValue('1')).toMatchObject({
        type: String,
        default: '1',
        isOptional: true,
      });
      expect(propType.string.defaultValue('1').validate).not.toBeUndefined();
      expect(propType.string.defaultValue('1').source).not.toBeUndefined();
      // @ts-expect-error
      expect(propType.string.defaultValue('1').optional).toBeUndefined();
    });
    describe('validate', () => {
      it('should be correct on the first level', () => {
        expect(propType.string.validate(isString)).toMatchObject({
          type: String,
          validator: isString,
        });
        expect(propType.string.validate(isString).source).not.toBeUndefined();
        // @ts-expect-error
        expect(propType.string.validate(isString).optional).toBeUndefined();
        // @ts-expect-error
        expect(propType.string.validate(isString).defaultValue).toBeUndefined();
      });
      it('should be correct on other levels', () => {
        expect(propType.string.optional.validate(isString)).toMatchObject({
          type: String,
          isOptional: true,
          missingValue: true,
          validator: isString,
        });
        expect(propType.string.optional.validate(isString).source).not.toBeUndefined();
        // @ts-expect-error
        expect(propType.string.optional.validate(isString).optional).toBeUndefined();
        // @ts-expect-error
        expect(propType.string.optional.validate(isString).defaultValue).toBeUndefined();

        expect(propType.string.defaultValue('1').validate(isString)).toMatchObject({
          type: String,
          default: '1',
          isOptional: true,
          validator: isString,
        });
        expect(propType.string.defaultValue('1').validate(isString).source).not.toBeUndefined();
        // @ts-expect-error
        expect(propType.string.defaultValue('1').validate(isString).defaultValue).toBeUndefined();
        // @ts-expect-error
        expect(propType.string.defaultValue('1').validate(isString).optional).toBeUndefined();
      });
    });
    describe('source', () => {
      it('should be correct on the first level', () => {
        expect(propType.string.source({ name: 'foo', type: 'css', target: 'bar' })).toMatchObject({
          sourceOptions: { name: 'foo', type: 'css', target: 'bar' },
        });

        // @ts-expect-error
        expect(propType.string.source({}).validate).toBeUndefined();
        // @ts-expect-error
        expect(propType.string.source({}).optional).toBeUndefined();
        // @ts-expect-error
        expect(propType.string.source({}).defaultValue).toBeUndefined();
      });

      it('should be correct after optional', () => {
        expect(
          propType.string.optional.source({ name: 'foo', type: 'css', target: 'bar' }),
        ).toMatchObject({
          isOptional: true,
          missingValue: true,
          sourceOptions: { name: 'foo', type: 'css', target: 'bar' },
        });

        // @ts-expect-error
        expect(propType.string.optional.source({}).validate).toBeUndefined();
        // @ts-expect-error
        expect(propType.string.optional.source({}).optional).toBeUndefined();
        // @ts-expect-error
        expect(propType.string.optional.source({}).defaultValue).toBeUndefined();
      });

      it('should be correct after defaultValue', () => {
        expect(
          propType.string.defaultValue('1').source({ name: 'foo', type: 'css', target: 'bar' }),
        ).toMatchObject({
          isOptional: true,
          default: '1',
          sourceOptions: { name: 'foo', type: 'css', target: 'bar' },
        });

        // @ts-expect-error
        expect(propType.string.defaultValue('1').source({}).optional).toBeUndefined();
        // @ts-expect-error
        expect(propType.string.defaultValue('1').source({}).defaultValue).toBeUndefined();
        // @ts-expect-error
        expect(propType.string.defaultValue('1').source({}).validate).toBeUndefined();
      });

      it('should be correct after validate', () => {
        expect(
          propType.string.validate(isString).source({ name: 'foo', type: 'css', target: 'bar' }),
        ).toMatchObject({
          validator: isString,
          sourceOptions: { name: 'foo', type: 'css', target: 'bar' },
        });

        // @ts-expect-error
        expect(propType.string.validate(isString).source({}).validate).toBeUndefined();
        // @ts-expect-error
        expect(propType.string.validate(isString).source({}).optional).toBeUndefined();
        // @ts-expect-error
        expect(propType.string.validate(isString).source({}).defaultValue).toBeUndefined();
      });
      it('should be correct after everything', () => {
        expect(
          propType.string.optional
            .validate(isString)
            .source({ name: 'foo', type: 'css', target: 'bar' }),
        ).toMatchObject({
          type: String,
          isOptional: true,
          missingValue: true,
          validator: isString,
          sourceOptions: { name: 'foo', type: 'css', target: 'bar' },
        });

        // @ts-expect-error
        expect(propType.string.optional.validate(isString).source({}).validate).toBeUndefined();
        // @ts-expect-error
        expect(propType.string.optional.validate(isString).optional).toBeUndefined();
        // @ts-expect-error
        expect(propType.string.optional.validate(isString).defaultValue).toBeUndefined();
      });
    });
  });
  describe('propType.number', () => {
    it('should return default', () => {
      expect(propType.number).toMatchObject({ type: Number });
      expect(propType.number.optional).not.toBeUndefined();
      expect(propType.number.defaultValue).not.toBeUndefined();
      expect(propType.number.validate).not.toBeUndefined();
      expect(propType.number.source).not.toBeUndefined();
    });
    it('should return optional', () => {
      expect(propType.number.optional).toMatchObject({
        type: Number,
        isOptional: true,
        missingValue: true,
      });
      expect(propType.number.optional.validate).not.toBeUndefined();
      expect(propType.number.optional.source).not.toBeUndefined();
      // @ts-expect-error
      expect(propType.number.optional.defaultValue).toBeUndefined();
    });
    it('should return defaultValue', () => {
      expect(propType.number.defaultValue(0)).toMatchObject({
        type: Number,
        default: 0,
        isOptional: true,
      });
      expect(propType.number.defaultValue(0).validate).not.toBeUndefined();
      expect(propType.number.defaultValue(0).source).not.toBeUndefined();
      // @ts-expect-error
      expect(propType.number.defaultValue(0).optional).toBeUndefined();
    });
    describe('validate', () => {
      it('should be correct on the first level', () => {
        expect(propType.number.validate(isNumber)).toMatchObject({
          type: Number,
          validator: isNumber,
        });
        expect(propType.number.validate(isNumber).source).not.toBeUndefined();
        // @ts-expect-error
        expect(propType.number.validate(isNumber).optional).toBeUndefined();
        // @ts-expect-error
        expect(propType.number.validate(isNumber).defaultValue).toBeUndefined();
      });
      it('should be correct on other levels', () => {
        expect(propType.number.optional.validate(isNumber)).toMatchObject({
          type: Number,
          isOptional: true,
          missingValue: true,
          validator: isNumber,
        });
        expect(propType.number.optional.validate(isNumber).source).not.toBeUndefined();
        // @ts-expect-error
        expect(propType.number.optional.validate(isNumber).optional).toBeUndefined();
        // @ts-expect-error
        expect(propType.number.optional.validate(isNumber).defaultValue).toBeUndefined();

        expect(propType.number.defaultValue(0).validate(isNumber)).toMatchObject({
          type: Number,
          default: 0,
          isOptional: true,
          validator: isNumber,
        });
        expect(propType.number.defaultValue(0).validate(isNumber).source).not.toBeUndefined();
        // @ts-expect-error
        expect(propType.number.defaultValue(0).validate(isNumber).defaultValue).toBeUndefined();
        // @ts-expect-error
        expect(propType.number.defaultValue(0).validate(isNumber).optional).toBeUndefined();
      });
    });
    describe('source', () => {
      it('should be correct on the first level', () => {
        expect(propType.number.source({ name: 'foo', type: 'css', target: 'bar' })).toMatchObject({
          sourceOptions: { name: 'foo', type: 'css', target: 'bar' },
        });

        // @ts-expect-error
        expect(propType.number.source({}).validate).toBeUndefined();
        // @ts-expect-error
        expect(propType.number.source({}).optional).toBeUndefined();
        // @ts-expect-error
        expect(propType.number.source({}).defaultValue).toBeUndefined();
      });

      it('should be correct after optional', () => {
        expect(
          propType.number.optional.source({ name: 'foo', type: 'css', target: 'bar' }),
        ).toMatchObject({
          isOptional: true,
          missingValue: true,
          sourceOptions: { name: 'foo', type: 'css', target: 'bar' },
        });

        // @ts-expect-error
        expect(propType.number.optional.source({}).validate).toBeUndefined();
        // @ts-expect-error
        expect(propType.number.optional.source({}).optional).toBeUndefined();
        // @ts-expect-error
        expect(propType.number.optional.source({}).defaultValue).toBeUndefined();
      });

      it('should be correct after defaultValue', () => {
        expect(
          propType.number.defaultValue(0).source({ name: 'foo', type: 'css', target: 'bar' }),
        ).toMatchObject({
          isOptional: true,
          default: 0,
          sourceOptions: { name: 'foo', type: 'css', target: 'bar' },
        });

        // @ts-expect-error
        expect(propType.number.defaultValue(0).source({}).optional).toBeUndefined();
        // @ts-expect-error
        expect(propType.number.defaultValue(0).source({}).defaultValue).toBeUndefined();
        // @ts-expect-error
        expect(propType.number.defaultValue(0).source({}).validate).toBeUndefined();
      });

      it('should be correct after validate', () => {
        expect(
          propType.number.validate(isNumber).source({ name: 'foo', type: 'css', target: 'bar' }),
        ).toMatchObject({
          validator: isNumber,
          sourceOptions: { name: 'foo', type: 'css', target: 'bar' },
        });

        // @ts-expect-error
        expect(propType.number.validate(isNumber).source({}).validate).toBeUndefined();
        // @ts-expect-error
        expect(propType.number.validate(isNumber).source({}).optional).toBeUndefined();
        // @ts-expect-error
        expect(propType.number.validate(isNumber).source({}).defaultValue).toBeUndefined();
      });
      it('should be correct after everything', () => {
        expect(
          propType.number.optional
            .validate(isNumber)
            .source({ name: 'foo', type: 'css', target: 'bar' }),
        ).toMatchObject({
          type: Number,
          isOptional: true,
          missingValue: true,
          validator: isNumber,
          sourceOptions: { name: 'foo', type: 'css', target: 'bar' },
        });

        // @ts-expect-error
        expect(propType.number.optional.validate(isNumber).source({}).validate).toBeUndefined();
        // @ts-expect-error
        expect(propType.number.optional.validate(isNumber).optional).toBeUndefined();
        // @ts-expect-error
        expect(propType.number.optional.validate(isNumber).defaultValue).toBeUndefined();
      });
    });
  });
  describe('propType.func', () => {
    it('should return default', () => {
      expect(propType.func).toMatchObject({ type: Function });
      expect(propType.func.optional).not.toBeUndefined();
      expect(propType.func.shape()).not.toBeUndefined();
      // @ts-expect-error
      expect(propType.func.defaultValue).toBeUndefined();
      // @ts-expect-error
      expect(propType.func.validate).toBeUndefined();
      // @ts-expect-error
      expect(propType.func.source).toBeUndefined();
    });
    it('should return optional', () => {
      expect(propType.func.optional).toMatchObject({
        type: Function,
        isOptional: true,
        missingValue: true,
      });
      expect(propType.func.optional.shape).not.toBeUndefined();
      // @ts-expect-error
      expect(propType.func.optional.validate).toBeUndefined();
      // @ts-expect-error
      expect(propType.func.optional.source).toBeUndefined();
      // @ts-expect-error
      expect(propType.func.optional.defaultValue).toBeUndefined();
    });
    it('should return shape', () => {
      expect(propType.func.shape<() => void>()).toMatchObject({
        type: Function,
        shapeType: true,
      });
      // @ts-expect-error
      expect(propType.func.shape.optional).toBeUndefined();
      // @ts-expect-error
      expect(propType.func.shape.validate).toBeUndefined();
      // @ts-expect-error
      expect(propType.func.shape.source).toBeUndefined();
      // @ts-expect-error
      expect(propType.func.shape.defaultValue).toBeUndefined();

      expect(propType.func.optional.shape()).toMatchObject({
        type: Function,
        isOptional: true,
        missingValue: true,
        shapeType: true,
      });
      // @ts-expect-error
      expect(propType.func.optional.shape.optional).toBeUndefined();
      // @ts-expect-error
      expect(propType.func.optional.shape.validate).toBeUndefined();
      // @ts-expect-error
      expect(propType.func.optional.shape.source).toBeUndefined();
      // @ts-expect-error
      expect(propType.func.optional.shape.defaultValue).toBeUndefined();
    });
  });
});
