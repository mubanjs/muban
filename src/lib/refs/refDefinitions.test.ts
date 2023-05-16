/* eslint-disable max-lines */
import { createComponentInstance, defineComponent } from '../Component';
import { wrapperBoundaryName } from '../utils/domUtils';
import {
  ensureElementIsComponentChild,
  refCollection,
  refComponent,
  refComponents,
  refElement,
} from './refDefinitions';

function createComponentTemplateElement(content: string) {
  const parent = document.createElement('div');
  parent.dataset.component = 'parent';
  parent.innerHTML = content;
  return parent;
}

// TODO Add tests for logging

describe('ensureElementIsComponentChild', () => {
  it('should allow the root element', () => {
    const parent = createComponentTemplateElement(
      `<p data-ref="element-string">element-string</p>`,
    );

    const result = ensureElementIsComponentChild(parent, parent);
    expect(result).toEqual(parent);
    expect(result).not.toBeNull();
  });
  it('should allow the first child', () => {
    const parent = createComponentTemplateElement(
      `<p data-ref="element-string">element-string</p>`,
    );
    const element = parent.querySelector<HTMLElement>('[data-ref="element-string"]')!;

    const result = ensureElementIsComponentChild(parent, element);
    expect(result).toEqual(element);
    expect(result).not.toBeNull();
  });
  it('should allow for another child component', () => {
    const parent = createComponentTemplateElement(
      `<p data-component="child-component">element-string</p>`,
    );
    const element = parent.querySelector<HTMLElement>('[data-component="child-component"]')!;

    const result = ensureElementIsComponentChild(parent, element);
    expect(result).toEqual(element);
    expect(result).not.toBeNull();
  });
  it('should not allow an element inside another component', () => {
    const parent = createComponentTemplateElement(
      `<div data-component="child-component">
          <p data-ref="element-string">element-string</p>
        </div>`,
    );
    const element = parent.querySelector<HTMLElement>('[data-ref="element-string"]')!;

    const result = ensureElementIsComponentChild(parent, element);
    expect(result).toBeNull();
  });

  describe('wrapper component', () => {
    it('should ignore the wrapper when looking for the closest parent', () => {
      const parent = createComponentTemplateElement(
        `<div data-component="some-wrapper" ${wrapperBoundaryName}>
          <span data-ref="foo">label</span>
        </div>`,
      );

      const element = parent.querySelector<HTMLElement>('[data-ref="foo"]')!;
      const result = ensureElementIsComponentChild(parent, element);
      expect(result).toEqual(element);
    });
    it('should recursively ignore the wrapper when looking for the closest parent', () => {
      const parent = createComponentTemplateElement(
        `<div data-component="some-wrapper" ${wrapperBoundaryName}>
          <div data-component="some-wrapper-2" ${wrapperBoundaryName}>
            <div data-component="some-wrapper-3" ${wrapperBoundaryName}>
              <span data-ref="foo">label</span>
            </div>
          </div>
        </div>`,
      );

      const element = parent.querySelector<HTMLElement>('[data-ref="foo"]')!;
      const result = ensureElementIsComponentChild(parent, element);
      expect(result).toEqual(element);
    });
    it('should recursively look for parent components only for elements inside the boundary', () => {
      const parent = createComponentTemplateElement(
        `<div data-component="some-wrapper">
          <button data-ref="toggle">Toggle Content</button>
            <div data-ref="content" ${wrapperBoundaryName}>
              <span data-ref="foo">label</span>
            </div>
          </div>`,
      );
      const fooElement = parent.querySelector<HTMLElement>('[data-ref="foo"]')!;
      const toggleElement = parent.querySelector<HTMLElement>('[data-ref="toggle"]')!;
      const contentElement = parent.querySelector<HTMLElement>('[data-ref="content"]')!;
      const wrapperElement = parent.querySelector<HTMLElement>('[data-component="some-wrapper"]')!;
      const fooResult = ensureElementIsComponentChild(parent, fooElement);
      const toggleResult = ensureElementIsComponentChild(parent, toggleElement);
      const contentResult = ensureElementIsComponentChild(parent, contentElement);
      const toggleWrapperResult = ensureElementIsComponentChild(wrapperElement, toggleElement);
      const contentWrapperResult = ensureElementIsComponentChild(wrapperElement, contentElement);
      expect(fooResult).toEqual(fooElement);
      expect(toggleResult).toBeNull();
      expect(contentResult).toBeNull();
      expect(toggleWrapperResult).toEqual(toggleElement);
      expect(contentWrapperResult).toEqual(contentElement);
    });
  });
});

describe('refElement', () => {
  it('should return a valid object', () => {
    const ref = refElement('test');
    expect(ref).toMatchObject({
      ref: 'test',
      type: 'element',
      isRequired: true,
    });
  });
  it('should return a valid [custom] ref when passed query function', () => {
    const ref = refElement(() => null);
    expect(ref).toMatchObject({
      ref: '[custom]',
    });
  });
  it('should be optional', () => {
    const ref = refElement('test', { isRequired: false });
    expect(ref).toMatchObject({
      isRequired: false,
    });
  });
  describe('when calling queryRef', () => {
    it('should return a child element', () => {
      const parent = createComponentTemplateElement(`<span data-ref="test">foo</span>`);
      const ref = refElement('test');
      const element = ref.queryRef(parent);
      expect(element?.dataset.ref).toEqual('test');
    });
    it('should return the parent"', () => {
      const parent = createComponentTemplateElement(`<span data-ref="test">foo</span>`);
      parent.dataset.ref = 'my-component';
      const ref = refElement('my-component');
      const element = ref.queryRef(parent);
      expect(element?.dataset.ref).toEqual('my-component');
    });
    it('should return the parent for "self"', () => {
      const parent = createComponentTemplateElement(`<span data-ref="test">foo</span>`);
      const ref = refElement('_self_');
      const element = ref.queryRef(parent);
      expect(element?.dataset.component).toEqual('parent');
    });
    describe('using a custom query', () => {
      it('should return a child element', () => {
        const parent = createComponentTemplateElement(`<span data-ref="test">foo</span>`);
        const ref = refElement((parentElement) => parentElement.querySelector('span'));
        const element = ref.queryRef(parent);
        expect(element?.dataset.ref).toEqual('test');
      });
    });
    it('should return null for invalid match', () => {
      const parent = createComponentTemplateElement(`<span data-ref="test">foo</span>`);
      const ref = refElement('foobar');
      const element = ref.queryRef(parent);
      expect(element).toBeNull();
    });
  });
  describe('when calling createRef', () => {
    it('should return a valid object', () => {
      const parent = createComponentTemplateElement(`<span data-ref="test">foo</span>`);
      const refItem = refElement('test');
      const instance = createComponentInstance({}, parent, { name: 'parent', setup: () => [] });
      const ref = refItem.createRef(instance);
      expect(ref).toMatchObject({
        type: 'element',
        element: parent.querySelector('[data-ref="test"]'),
      });
    });
    describe('and calling refreshRefs', () => {
      it('should return the same element when not changed', () => {
        // TODO after other PR is merged that updates this API interface
      });
    });
  });
  describe('when having multiple owners of a ref', () => {
    it('should throw an error', () => {
      const parent = createComponentTemplateElement(`<div data-ref="test"></div>`);
      const refItem = refElement('test');
      const instance = createComponentInstance({}, parent, { name: 'parent', setup: () => [] });
      refItem.createRef(instance);

      const createSecondRef = () => {
        const secondRefItem = refElement('test');
        const secondInstance = createComponentInstance({}, parent, {
          name: 'parent',
          setup: () => [],
        });
        secondRefItem.createRef(secondInstance);
      };

      expect(createSecondRef).toThrow();
    });
  });
});

describe('refCollection', () => {
  // TODO add tests for minimumItemsRequired
  it('should return a valid object', () => {
    const ref = refCollection('test');
    expect(ref).toMatchObject({
      ref: 'test',
      type: 'collection',
    });
  });
  it('should return a valid [custom] ref when passed query function', () => {
    const ref = refCollection(() => []);
    expect(ref).toMatchObject({
      ref: '[custom]',
    });
  });
  describe('when calling queryRef', () => {
    it('should return a single child element', () => {
      const parent = createComponentTemplateElement(`<span data-ref="test">foo</span>`);
      const ref = refCollection('test');
      const element = ref.queryRef(parent);
      expect(element).toHaveLength(1);
    });
    it('should return a multiple child elements', () => {
      const parent = createComponentTemplateElement(
        `<span data-ref="test">foo</span><span data-ref="test">foo</span><span data-ref="test">foo</span>`,
      );
      const ref = refCollection('test');
      const element = ref.queryRef(parent);
      expect(element).toHaveLength(3);
    });
    it('should return no child elements', () => {
      const parent = createComponentTemplateElement(`<span data-ref="test">foo</span>`);
      const ref = refCollection('foobar');
      const element = ref.queryRef(parent);
      expect(element).toHaveLength(0);
    });
    describe('using a custom query', () => {
      it('should return child elements', () => {
        const parent = createComponentTemplateElement(
          `<span data-ref="test">foo</span><span data-ref="test">foo</span>`,
        );
        const ref = refCollection((parentElement) =>
          Array.from(parentElement.querySelectorAll<HTMLSpanElement>('span')),
        );
        const element = ref.queryRef(parent);
        expect(element).toHaveLength(2);
      });
    });
  });
  describe('when calling createRef', () => {
    it('should return a valid object', () => {
      const parent = createComponentTemplateElement(
        `<span data-ref="test">foo</span><span data-ref="test">foo</span>`,
      );
      const refItem = refCollection('test');
      const instance = createComponentInstance({}, parent, { name: 'parent', setup: () => [] });
      const ref = refItem.createRef(instance);
      expect(ref).toMatchObject({
        type: 'collection',
      });
    });
    it('should return the queried elements', () => {
      const parent = createComponentTemplateElement(
        `<span data-ref="test">foo</span><span data-ref="test">foo</span>`,
      );
      const refItem = refCollection('test');
      const instance = createComponentInstance({}, parent, { name: 'parent', setup: () => [] });
      const ref = refItem.createRef(instance);
      expect(ref.getElements()).toHaveLength(2);
      expect(ref.getElements()[0]).toBeInstanceOf(HTMLSpanElement);
    });
    describe('and calling getRefs', () => {
      it('should return a ref definition for each element', () => {
        const parent = createComponentTemplateElement(
          `<span data-ref="test">foo</span><span data-ref="test">foo</span>`,
        );
        const refItem = refCollection('test');
        const instance = createComponentInstance({}, parent, { name: 'parent', setup: () => [] });
        const ref = refItem.createRef(instance);
        expect(ref.getRefs()).toHaveLength(2);
        expect(ref.getRefs()[0]).toMatchObject({
          type: 'element',
          element: parent.querySelector('span'),
        });
        expect(ref.getRefs()[1]).toMatchObject({
          type: 'element',
          element: parent.querySelector('span:nth-child(2)'),
        });
      });
    });
    describe('and calling refreshRefs', () => {
      it('should return the same element when not changed', () => {
        // TODO after other PR is merged that updates this API interface
      });
    });
  });
  describe('when having multiple owners of a ref', () => {
    it('should throw an error', () => {
      const parent = createComponentTemplateElement(`<div data-ref="test"></div>`);
      const refItems = refCollection('test');
      const instance = createComponentInstance({}, parent, { name: 'parent', setup: () => [] });
      refItems.createRef(instance);

      const createSecondRef = () => {
        const secondRefItems = refCollection('test');
        const secondInstance = createComponentInstance({}, parent, {
          name: 'parent',
          setup: () => [],
        });
        secondRefItems.createRef(secondInstance);
      };

      expect(createSecondRef).toThrow();
    });
  });
});

const TestComponent = defineComponent({
  name: 'test',
  setup() {
    return [];
  },
});
const Test2Component = defineComponent({
  name: 'test2',
  setup() {
    return [];
  },
});

describe('refComponent', () => {
  it('should return a valid object', () => {
    const ref = refComponent(TestComponent);
    expect(ref).toMatchObject({
      ref: undefined,
      componentRef: 'test',
      type: 'component',
      isRequired: true,
    });
  });
  it('should return a ref string', () => {
    const ref = refComponent(TestComponent, { ref: 'test' });
    expect(ref).toMatchObject({
      ref: 'test',
      componentRef: 'test',
      type: 'component',
      isRequired: true,
    });
  });
  it('should return a valid [custom] ref when passed query function', () => {
    const ref = refComponent(TestComponent, { ref: () => null });
    expect(ref).toMatchObject({
      ref: '[custom]',
    });
  });
  it('should be optional', () => {
    const ref = refComponent(TestComponent, { isRequired: false });
    expect(ref).toMatchObject({
      isRequired: false,
    });
  });
  describe('when calling queryRef', () => {
    it('should return the component element based on data-component', () => {
      const parent = createComponentTemplateElement(`<span data-component="test">foo</span>`);
      const ref = refComponent(TestComponent);
      const element = ref.queryRef(parent);
      expect(element?.dataset.component).toEqual('test');
    });
    it('should return the component element based on data-ref', () => {
      const parent = createComponentTemplateElement(
        `<span data-component="test" data-ref="foo">foo</span>`,
      );
      const ref = refComponent(TestComponent, { ref: 'foo' });
      const element = ref.queryRef(parent);
      expect(element?.dataset.ref).toEqual('foo');
    });
    it('should return the correct component based on data-component', () => {
      const parent = createComponentTemplateElement(
        `<div>
          <div data-component="child-component">
            <span data-component="test" data-type="nested-child-component">foo</span>
          </div>
          <span data-component="test" data-type="first-child-component">foo</span>
          <span data-component="test" data-type="second-child-component">foo</span>
        </div>`,
      );
      const ref = refComponent(TestComponent);
      const element = ref.queryRef(parent);
      expect(element?.dataset.type).toEqual('first-child-component');
    });
    it('should return the correct component element based on data-ref', () => {
      const parent = createComponentTemplateElement(
        `<div>
          <div data-component="child-component">
            <span data-component="test" data-ref="child-ref" data-type="nested-child-component">foo</span>
          </div>
          <span data-component="test" data-type="first-child-component" data-ref="child-ref">foo</span>
          <span data-component="test" data-type="second-child-component" data-ref="child-ref">foo</span>
        </div>`,
      );
      const ref = refComponent(TestComponent, { ref: 'child-ref' });
      const element = ref.queryRef(parent);
      expect(element?.dataset.ref).toEqual('child-ref');
      expect(element?.dataset.type).toEqual('first-child-component');
    });
    it('should return null for invalid match', () => {
      const parent = createComponentTemplateElement(`<span data-component="foobar">foo</span>`);
      const ref = refComponent(TestComponent);
      const element = ref.queryRef(parent);
      expect(element).toBeNull();
    });
    it('should return null for element that is not match data-component', () => {
      const parent = createComponentTemplateElement(
        `<span data-component="foobar" data-ref="test">foo</span>`,
      );
      const ref = refComponent(TestComponent, { ref: 'test' });
      const element = ref.queryRef(parent);
      expect(element).toBeNull();
    });
    describe('using a custom query', () => {
      it('should return a child element', () => {
        const parent = createComponentTemplateElement(
          `<span data-component="test" data-ref="foo">foo</span>`,
        );
        const ref = refComponent(TestComponent, {
          ref: (parentElement) => parentElement.querySelector('span'),
        });
        const element = ref.queryRef(parent);
        expect(element?.dataset.component).toEqual('test');
      });
    });
    describe('when passing two components', () => {
      it('should return the fist component', () => {
        const parent = createComponentTemplateElement(`<span data-component="test">foo</span>`);
        const ref = refComponent([TestComponent, Test2Component]);
        const element = ref.queryRef(parent);
        expect(element?.dataset.component).toEqual('test');
      });
      it('should return the second component', () => {
        const parent = createComponentTemplateElement(`<span data-component="test2">foo2</span>`);
        const ref = refComponent([TestComponent, Test2Component]);
        const element = ref.queryRef(parent);
        expect(element?.dataset.component).toEqual('test2');
      });
      it('should return the fist component in the DOM when both exist', () => {
        const parent = createComponentTemplateElement(
          `<span data-component="test2">foo2</span><span data-component="test">foo</span>`,
        );
        const ref = refComponent([TestComponent, Test2Component]);
        const element = ref.queryRef(parent);
        expect(element?.dataset.component).toEqual('test2');
      });
    });
  });
  describe('when calling createRef', () => {
    it('should return a valid object', () => {
      const parent = createComponentTemplateElement(`<span data-component="test">foo</span>`);
      const refItem = refComponent(TestComponent);
      const instance = createComponentInstance({}, parent, { name: 'parent', setup: () => [] });
      const ref = refItem.createRef(instance);
      expect(ref).toMatchObject({
        type: 'component',
      });
      expect(ref.component?.name).toEqual('test');
    });
    describe('when passing two components', () => {
      it('should return the fist component', () => {
        const parent = createComponentTemplateElement(`<span data-component="test">foo</span>`);
        const refItem = refComponent([TestComponent, Test2Component]);
        const instance = createComponentInstance({}, parent, { name: 'parent', setup: () => [] });
        const ref = refItem.createRef(instance);
        expect(ref.component?.name).toEqual('test');
      });
      it('should return the second component', () => {
        const parent = createComponentTemplateElement(`<span data-component="test2">foo2</span>`);
        const refItem = refComponent([TestComponent, Test2Component]);
        const instance = createComponentInstance({}, parent, { name: 'parent', setup: () => [] });
        const ref = refItem.createRef(instance);
        expect(ref.component?.name).toEqual('test2');
      });
      it('should return the fist component in the DOM when both exist', () => {
        const parent = createComponentTemplateElement(
          `<span data-component="test2">foo2</span><span data-component="test">foo</span>`,
        );
        const refItem = refComponent([TestComponent, Test2Component]);
        const instance = createComponentInstance({}, parent, { name: 'parent', setup: () => [] });
        const ref = refItem.createRef(instance);
        expect(ref.component?.name).toEqual('test2');
      });
    });
    //   describe('and calling refreshRefs', () => {
    //     it('should return the same element when not changed', () => {
    //       // TODO after other PR is merged that updates this API interface
    //     });
    //   });
  });
  describe('when having multiple owners of a refComponent', () => {
    it('should throw an error', () => {
      const parent = createComponentTemplateElement(`<div data-component="test"></div>`);
      const refItem = refComponent(TestComponent);
      const instance = createComponentInstance({}, parent, { name: 'parent', setup: () => [] });
      refItem.createRef(instance);

      const createSecondRef = () => {
        const secondRefItem = refComponent(TestComponent);
        const secondInstance = createComponentInstance({}, parent, {
          name: 'parent',
          setup: () => [],
        });
        secondRefItem.createRef(secondInstance);
      };
      expect(createSecondRef).toThrow();
    });
  });
});

describe('refComponents', () => {
  // TODO add tests for minimumItemsRequired
  it('should return a valid object', () => {
    const ref = refComponents(TestComponent);
    expect(ref).toMatchObject({
      ref: undefined,
      componentRef: 'test',
      type: 'componentCollection',
    });
  });
  it('should return a ref string', () => {
    const ref = refComponents(TestComponent, { ref: 'test' });
    expect(ref).toMatchObject({
      ref: 'test',
      componentRef: 'test',
      type: 'componentCollection',
    });
  });
  it('should return a valid [custom] ref when passed query function', () => {
    const ref = refComponents(TestComponent, { ref: () => [] });
    expect(ref).toMatchObject({
      ref: '[custom]',
    });
  });
  describe('when calling queryRef', () => {
    it('should return a single child element', () => {
      const parent = createComponentTemplateElement(`<span data-component="test">foo</span>`);
      const ref = refComponents(TestComponent);
      const elements = ref.queryRef(parent);
      expect(elements).toHaveLength(1);
    });
    it('should return a multiple child elements', () => {
      const parent = createComponentTemplateElement(
        `<span data-component="test">foo</span><span data-component="test">foo</span><span data-component="test">foo</span>`,
      );
      const ref = refComponents(TestComponent);
      const elements = ref.queryRef(parent);
      expect(elements).toHaveLength(3);
    });
    it('should return no child elements', () => {
      const parent = createComponentTemplateElement(`<span data-component="foobar">foo</span>`);
      const ref = refComponents(TestComponent);
      const elements = ref.queryRef(parent);
      expect(elements).toHaveLength(0);
    });
    it("should not return element that don't match data-component", () => {
      const parent = createComponentTemplateElement(
        `<span data-component="test" data-ref="test">foo</span><span data-component="foobar" data-ref="test">foo</span>`,
      );
      const ref = refComponents(TestComponent, { ref: 'test' });
      const elements = ref.queryRef(parent);
      expect(elements).toHaveLength(1);
    });
    describe('using a custom query', () => {
      it('should return child elements', () => {
        const parent = createComponentTemplateElement(
          `<span data-component="test">foo</span><span data-component="test">foo</span>`,
        );
        const ref = refComponents(TestComponent, {
          ref: (parentElement) => Array.from(parentElement.querySelectorAll('span')),
        });
        const element = ref.queryRef(parent);
        expect(element).toHaveLength(2);
      });
    });
  });
  describe('when calling createRef', () => {
    it('should return a valid object', () => {
      const parent = createComponentTemplateElement(
        `<span data-component="test">foo</span><span data-component="test">foo</span>`,
      );
      const refItem = refComponents(TestComponent);
      const instance = createComponentInstance({}, parent, { name: 'parent', setup: () => [] });
      const ref = refItem.createRef(instance);
      expect(ref).toMatchObject({
        type: 'componentCollection',
      });
    });
    it('should return the queried elements', () => {
      const parent = createComponentTemplateElement(
        `<span data-component="test">foo</span><span data-component="test">foo</span>`,
      );
      const refItem = refComponents(TestComponent);
      const instance = createComponentInstance({}, parent, { name: 'parent', setup: () => [] });
      const ref = refItem.createRef(instance);
      expect(ref.getComponents()).toHaveLength(2);
      expect(ref.getComponents()[0].name).toEqual('test');
    });
    describe('when passing two components', () => {
      it('should return the fist component', () => {
        const parent = createComponentTemplateElement(
          `<span data-component="test">foo</span><span data-component="test">foo</span>`,
        );
        const refItem = refComponents([TestComponent, Test2Component]);
        const instance = createComponentInstance({}, parent, { name: 'parent', setup: () => [] });
        const ref = refItem.createRef(instance);
        expect(ref.getComponents()).toHaveLength(2);
        expect(ref.getComponents().map((c) => c.name)).toEqual(['test', 'test']);
      });
      it('should return the second component', () => {
        const parent = createComponentTemplateElement(
          `<span data-component="test2">foo2</span><span data-component="test2">foo2</span>`,
        );
        const refItem = refComponents([TestComponent, Test2Component]);
        const instance = createComponentInstance({}, parent, { name: 'parent', setup: () => [] });
        const ref = refItem.createRef(instance);
        expect(ref.getComponents()).toHaveLength(2);
        expect(ref.getComponents().map((c) => c.name)).toEqual(['test2', 'test2']);
      });
      it('should return all components in the DOM when both exist', () => {
        const parent = createComponentTemplateElement(
          `<span data-component="test">foo</span><span data-component="test2">foo2</span><span data-component="test">foo</span>`,
        );
        const refItem = refComponents([TestComponent, Test2Component]);
        const instance = createComponentInstance({}, parent, { name: 'parent', setup: () => [] });
        const ref = refItem.createRef(instance);
        expect(ref.getComponents()).toHaveLength(3);
        expect(ref.getComponents().map((c) => c.name)).toEqual(['test', 'test2', 'test']);
      });
    });
    describe('and calling getRefs', () => {
      it('should return a ref definition for each element', () => {
        const parent = createComponentTemplateElement(
          `<span data-component="test">foo</span><span data-component="test2">foo2</span><span data-component="test">foo</span>`,
        );
        const refItem = refComponents([TestComponent, Test2Component]);
        const instance = createComponentInstance({}, parent, { name: 'parent', setup: () => [] });
        const ref = refItem.createRef(instance);
        expect(ref.getRefs()).toHaveLength(3);
        expect(ref.getRefs().map((r) => r.type)).toEqual(['component', 'component', 'component']);
        expect(ref.getRefs().map((r) => r.component?.name)).toEqual(['test', 'test2', 'test']);
      });
    });
    describe('and calling refreshRefs', () => {
      it('should return the same element when not changed', () => {
        // TODO after other PR is merged that updates this API interface
      });
    });
  });
  describe('when having multiple owners of a refComponent collection', () => {
    it('should throw an error', () => {
      const parent = createComponentTemplateElement(`
        <div>
          <div data-component="test"></div>
          <div data-component="test"></div>
        </div>
      `);
      const refItems = refComponents(TestComponent);
      const instance = createComponentInstance({}, parent, { name: 'parent', setup: () => [] });
      refItems.createRef(instance);

      const createSecondRefCollection = () => {
        const secondRefItems = refComponents(TestComponent);
        const secondInstance = createComponentInstance({}, parent, {
          name: 'parent',
          setup: () => [],
        });
        secondRefItems.createRef(secondInstance);
      };
      expect(createSecondRefCollection).toThrow();
    });
  });
});
