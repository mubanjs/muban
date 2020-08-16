import { createDataAttributePropertySource } from './createDataAttributePropertySource';

const mockConsoleWarn = () => {
  const consoleOutput: Array<unknown> = [];
  const mockedWarn = (...args: Array<unknown>) => consoleOutput.push(args);
  beforeEach(() => (console.warn = mockedWarn));
  return consoleOutput;
};

const mockConsoleError = () => {
  const consoleOutput: Array<unknown> = [];
  const mockedError = (...args: Array<unknown>) => consoleOutput.push(args);
  beforeEach(() => (console.error = mockedError));
  return consoleOutput;
};

describe('createDataAttributePropertySource', () => {
  const originalError = console.error;
  afterEach(() => (console.error = originalError));
  mockConsoleError();
  const originalWarn = console.warn;
  afterEach(() => (console.warn = originalWarn));
  mockConsoleWarn();

  it('should create without errors', () => {
    expect(createDataAttributePropertySource).not.toThrow();
  });
  it('should allow calling the created source without errors', () => {
    expect(createDataAttributePropertySource()).not.toThrow();
  });
  describe('hasProp', () => {
    it('should return false if property does not exist', () => {
      const element = document.createElement('div');
      const propDefinition = {
        type: String,
      };
      expect(createDataAttributePropertySource()(element).hasProp('str', propDefinition)).toBe(
        false,
      );
    });
    it('should return true if property does exist', () => {
      const element = document.createElement('div');
      element.dataset.str = 'foobar';
      const propDefinition = {
        type: String,
      };
      expect(createDataAttributePropertySource()(element).hasProp('str', propDefinition)).toBe(
        true,
      );
    });
    it('should return false if property is type Function', () => {
      const element = document.createElement('div');
      element.dataset.str = 'foobar';
      const propDefinition = {
        type: Function,
      };
      expect(createDataAttributePropertySource()(element).hasProp('str', propDefinition)).toBe(
        false,
      );
    });
  });
  describe('getProp', () => {
    it('should return undefined if the propery does not exist', () => {
      const element = document.createElement('div');
      const propDefinition = {
        type: String,
      };
      expect(createDataAttributePropertySource()(element).getProp('str', propDefinition)).toBe(
        undefined,
      );
    });
    it('should return a string if property does exist', () => {
      const element = document.createElement('div');
      element.dataset.str = 'foobar';
      const propDefinition = {
        type: String,
      };
      expect(createDataAttributePropertySource()(element).getProp('str', propDefinition)).toBe(
        'foobar',
      );
    });
    it('should return undefined if property is type Function', () => {
      const element = document.createElement('div');
      element.dataset.str = 'foobar';
      const propDefinition = {
        type: Function,
      };
      expect(createDataAttributePropertySource()(element).getProp('str', propDefinition)).toBe(
        undefined,
      );
    });
    describe('conversion', () => {
      describe('Number', () => {
        it('should return a Number', () => {
          const element = document.createElement('div');
          element.dataset.value = '123.45';
          const propDefinition = {
            type: Number,
          };
          const value = createDataAttributePropertySource()(element).getProp(
            'value',
            propDefinition,
          );
          expect(typeof value).toBe('number');
          expect(value).toEqual(123.45);
        });
        it('should return undefined for invalid number', () => {
          const element = document.createElement('div');
          element.dataset.value = 'sdf';
          const propDefinition = {
            type: Number,
          };
          const value = createDataAttributePropertySource()(element).getProp(
            'value',
            propDefinition,
          );
          expect(typeof value).toBe('undefined');
          expect(value).toEqual(undefined);
        });
      });

      describe('Boolean', () => {
        it('should return a true Boolean', () => {
          const element = document.createElement('div');
          element.dataset.value = 'true';
          const propDefinition = {
            type: Boolean,
          };
          const value = createDataAttributePropertySource()(element).getProp(
            'value',
            propDefinition,
          );
          expect(typeof value).toBe('boolean');
          expect(value).toEqual(true);
        });
        it('should return a false Boolean', () => {
          const element = document.createElement('div');
          element.dataset.value = 'false';
          const propDefinition = {
            type: Boolean,
          };
          const value = createDataAttributePropertySource()(element).getProp(
            'value',
            propDefinition,
          );
          expect(typeof value).toBe('boolean');
          expect(value).toEqual(false);
        });
        it('should return a false Boolean when empty value', () => {
          const element = document.createElement('div');
          element.dataset.value = '';
          const propDefinition = {
            type: Boolean,
          };
          const value = createDataAttributePropertySource()(element).getProp(
            'value',
            propDefinition,
          );
          expect(typeof value).toBe('boolean');
          expect(value).toEqual(false);
        });
      });

      describe('Date', () => {
        it('should return a Date', () => {
          const element = document.createElement('div');
          element.dataset.value = '1983-09-23T08:35:02.000Z';
          const propDefinition = {
            type: Date,
          };
          const value = createDataAttributePropertySource()(element).getProp(
            'value',
            propDefinition,
          );
          expect(value).toBeInstanceOf(Date);
          expect((value as Date)?.toISOString()).toEqual('1983-09-23T08:35:02.000Z');
        });
        it('should return undefined for an invalid Date', () => {
          const element = document.createElement('div');
          element.dataset.value = 'sdf';
          const propDefinition = {
            type: Date,
          };
          const value = createDataAttributePropertySource()(element).getProp(
            'value',
            propDefinition,
          );
          expect(typeof value).toBe('undefined');
          expect(value).toEqual(undefined);
        });
      });

      describe('Array', () => {
        it('should return an Array', () => {
          const element = document.createElement('div');
          element.dataset.value = '[1, true, "foobar"]';
          const propDefinition = {
            type: Array,
          };
          const value = createDataAttributePropertySource()(element).getProp(
            'value',
            propDefinition,
          );
          expect(value).toBeInstanceOf(Array);
          expect(value).toEqual([1, true, 'foobar']);
        });
        it('should return undefined for an invalid Array', () => {
          const element = document.createElement('div');
          element.dataset.value = 'sdf';
          const propDefinition = {
            type: Array,
          };
          const value = createDataAttributePropertySource()(element).getProp(
            'value',
            propDefinition,
          );
          expect(typeof value).toBe('undefined');
          expect(value).toEqual(undefined);
        });
      });
    });
  });
});
