/* eslint-disable @typescript-eslint/no-non-null-assertion, max-lines */
import dedent from 'ts-dedent';
import { defineComponent } from '../../Component';
import { refElement, refComponent, refComponents, refCollection } from '../../refs/refDefinitions';
import { propType } from '../propDefinitions';
import type { PropTypeInfo } from '../propDefinitions.types';
import { createCustomPropertySource } from './createCustomPropertySource';

describe('createFormPropertySource', () => {
  describe('function itself', () => {
    it('should create without errors', () => {
      expect(createCustomPropertySource).not.toThrow();
    });
    it('should allow calling the created source without errors', () => {
      expect(createCustomPropertySource()).not.toThrow();
    });
  });

  describe('hasProp', () => {
    it('should return false if no target is provided', () => {
      const div = document.createElement('div');
      const functionPropInfo: PropTypeInfo = {
        name: 'foo',
        type: Function,
        source: {
          name: 'foo',
          target: undefined,
          type: 'custom',
        },
      };
      expect(createCustomPropertySource()(div).hasProp(functionPropInfo)).toBe(false);
    });

    it('should return true if a target is provided', () => {
      const div = document.createElement('div');
      const functionPropInfo: PropTypeInfo = {
        name: 'foo',
        type: Function,
        source: {
          name: 'foo',
          target: div,
          type: 'custom',
        },
      };
      expect(createCustomPropertySource()(div).hasProp(functionPropInfo)).toBe(true);
    });
  });

  describe('getProp function', () => {
    const getCharactersCount = (element: HTMLElement | Array<HTMLElement> | undefined) =>
      (element as HTMLElement).querySelector('#title')!.innerHTML.length;

    const getAttributesCount = (element: HTMLElement | Array<HTMLElement> | undefined) =>
      (element as HTMLElement).querySelector('#attrs')!.attributes.length;

    const getChildrenCount = (element: HTMLElement | Array<HTMLElement> | undefined) =>
      (element as HTMLElement).querySelector('#parent')!.children.length;

    it('should return the return value of the given function', () => {
      const div = document.createElement('div');
      div.innerHTML = dedent`
        <h1 id="title">This title is 32 characters long</h1>
        <div id="attrs" two-attrs three-attrs four-attrs></div>
        <div id="parent">
          <small>This</small>
          <small>div</small>
          <small>has</small>
          <small>6</small>
          <small>child</small>
          <small>nodes</small>
        </div>
      `;
      document.body.appendChild(div);

      const titleLength: PropTypeInfo = {
        type: Number,
        name: 'foo',
        source: {
          name: 'foo',
          target: div,
          type: 'custom',
          options: {
            customSource: getCharactersCount,
          },
        },
      };

      const attributes: PropTypeInfo = {
        type: Number,
        name: 'foo',
        source: {
          name: 'foo',
          target: div,
          type: 'custom',
          options: {
            customSource: getAttributesCount,
          },
        },
      };

      const childrenCount: PropTypeInfo = {
        type: Number,
        name: 'foo',
        source: {
          name: 'foo',
          target: div,
          type: 'custom',
          options: {
            customSource: getChildrenCount,
          },
        },
      };

      expect(createCustomPropertySource()(div).getProp(titleLength)).toBe(32);
      expect(createCustomPropertySource()(div).getProp(attributes)).toBe(4);
      expect(createCustomPropertySource()(div).getProp(childrenCount)).toBe(6);
    });

    it('should return undefined and log an error when a custom source function is not provided', () => {
      const myElement = document.createElement('div');
      document.body.appendChild(myElement);

      const noOptions: PropTypeInfo = {
        type: Number,
        name: 'foo',
        source: {
          name: 'foo',
          target: myElement,
          type: 'custom',
        },
      };

      const noCustomSource: PropTypeInfo = {
        type: Number,
        name: 'bar',
        source: {
          name: 'foo',
          target: myElement,
          type: 'custom',
          options: {},
        },
      };

      const consoleSpy = jest.spyOn(console, 'warn');
      expect(createCustomPropertySource()(myElement).getProp(noOptions)).toBe(undefined);
      expect(consoleSpy)
        .toHaveBeenCalledWith(dedent`The property "foo" doesn't have a valid 'customSource' function
        Returning "undefined".`);
      expect(createCustomPropertySource()(myElement).getProp(noCustomSource)).toBe(undefined);
      expect(consoleSpy)
        .toHaveBeenCalledWith(dedent`The property "bar" doesn't have a valid 'customSource' function
        Returning "undefined".`);
    });
  });

  describe('source definition inside defineComponent', () => {
    const getCharactersCount = (element: HTMLElement | Array<HTMLElement> | undefined) =>
      (element as HTMLElement).innerHTML.length;

    const getAttributesCount = (element: HTMLElement | Array<HTMLElement> | undefined) =>
      (element as HTMLElement)!.attributes.length;

    const getChildrenCount = (element: HTMLElement | Array<HTMLElement> | undefined) =>
      (element as HTMLElement)!.children.length;

    it('should return the return value of the given function', () => {
      const myElement = document.createElement('div');
      myElement.setAttribute('data-component', 'my-component');
      myElement.innerHTML = dedent`
        <h1 id="title" data-ref="title">This title is 32 characters long</h1>
        <div id="attrs" data-ref="attrs" two-attrs three-attrs four-attrs></div>
        <div id="parent" data-ref="parent">
          <small>This</small>
          <small>div</small>
          <small>has</small>
          <small>6</small>
          <small>child</small>
          <small>nodes</small>
        </div>
      `;
      document.body.appendChild(myElement);

      const MyComponent = defineComponent({
        name: 'my-component',
        refs: {
          title: 'title',
          attrs: 'attrs',
          parent: 'parent',
        },
        props: {
          characterCount: propType.number.source({
            type: 'custom',
            target: 'title',
            options: {
              customSource: getCharactersCount,
            },
          }),
          attributeCount: propType.number.source({
            type: 'custom',
            target: 'attrs',
            options: {
              customSource: getAttributesCount,
            },
          }),
          childrenCount: propType.number.source({
            type: 'custom',
            target: 'parent',
            options: {
              customSource: getChildrenCount,
            },
          }),
          elementAttrCount: propType.number.source({
            // No target provided, it should count the attributes of the component element
            type: 'custom',
            options: {
              customSource: getAttributesCount,
            },
          }),
        },
        setup() {
          return [];
        },
      })(myElement);

      expect(MyComponent.props.characterCount).toBe(32);
      expect(MyComponent.props.attributeCount).toBe(5);
      expect(MyComponent.props.childrenCount).toBe(6);
      expect(MyComponent.props.elementAttrCount).toBe(1);
    });

    it('should convert the value to the given type', () => {
      const myElement = document.createElement('div');
      myElement.setAttribute('data-component', 'my-component');
      myElement.innerHTML = dedent`
        <h1 id="title" data-ref="title">This title is 32 characters long</h1>
        <div id="attrs" data-ref="attrs" two-attrs three-attrs four-attrs></div>
        <div id="parent" data-ref="parent">
          <small>This</small>
          <small>div</small>
          <small>has</small>
          <small>6</small>
          <small>child</small>
          <small>nodes</small>
        </div>
      `;
      document.body.appendChild(myElement);

      const MyComponent = defineComponent({
        name: 'my-component',
        refs: {
          title: 'title',
        },
        props: {
          characterCountString: propType.string.source({
            type: 'custom',
            target: 'title',
            options: {
              customSource: getCharactersCount,
            },
          }),
          characterCountNumber: propType.number.source({
            type: 'custom',
            target: 'title',
            options: {
              customSource: getCharactersCount,
            },
          }),
        },
        setup() {
          return [];
        },
      })(myElement);

      expect(MyComponent.props.characterCountNumber).toBe(32);
      expect(MyComponent.props.characterCountString).toBe('32');
    });

    it('should extract values from ref elements', () => {
      const myElement = document.createElement('div');
      myElement.setAttribute('data-component', 'my-component');
      myElement.innerHTML = dedent`
        <p data-ref="paragraph">a paragraph</p>
      `;
      document.body.appendChild(myElement);

      const MyComponent = defineComponent({
        name: 'my-component',
        refs: {
          paragraph: refElement('paragraph'),
        },
        props: {
          characterCount: propType.number.source({
            type: 'custom',
            target: 'paragraph',
            options: {
              customSource: getCharactersCount,
            },
          }),
        },
        setup() {
          return [];
        },
      })(myElement);

      expect(MyComponent.props.characterCount).toBe(11);
    });

    it('should extract values from component refs', () => {
      const FirstComponent = defineComponent({ name: 'first-component' });

      const myElement = document.createElement('div');
      myElement.setAttribute('data-component', 'my-component');
      myElement.innerHTML = dedent`
        <p>some extra html</p>
        <div data-component="first-component" data-ref="child-component">child component</div>
      `;
      document.body.appendChild(myElement);

      const MyComponent = defineComponent({
        name: 'my-component',
        refs: {
          paragraph: refComponent(FirstComponent, {
            ref: 'child-component',
          }),
        },
        props: {
          characterCount: propType.number.source({
            type: 'custom',
            target: 'paragraph',
            options: {
              customSource: getCharactersCount,
            },
          }),
        },
        setup() {
          return [];
        },
      })(myElement);

      expect(MyComponent.props.characterCount).toBe(15);
    });
  });
});
