import dedent from 'ts-dedent';
import { createComponentInstance, defineComponent } from '../Component';
import type { ComponentFactory } from '../Component.types';
import { createComponentRefs } from './createComponentRefs';
import { refCollection, refComponent, refComponents, refElement } from './refDefinitions';

function createComponent(name: string): ComponentFactory {
  return defineComponent({
    name,
  });
}

const Dummy1 = createComponent('dummy-1');
const Dummy2 = createComponent('dummy-2');
const Dummy3 = createComponent('dummy-3');
const Dummy4 = createComponent('dummy-4');

describe('getComponentRefs', () => {
  it('should return app props', () => {
    const element = document.createElement('div');
    element.innerHTML = dedent`
      <div>
        <p data-ref="element-string">element-string</p>
        <p data-ref="element-query">element-query</p>
        <p data-ref="element-ref">element-ref</p>
        <ul>
          <li data-ref="collection-ref">one</li>
          <li data-ref="collection-ref">two</li>
          <li data-ref="collection-ref">three</li>
        </ul>
        <div data-component="dummy-1">dummy</div>
        <div data-component="dummy-2" data-ref="component-ref">dummy specific</div>
        <div data-component="dummy-3">dummy list 1</div>
        <div data-component="dummy-3">dummy list 2</div>
        <div data-component="dummy-3">dummy list 3</div>
        <div data-component="dummy-4" data-ref="component-collection-ref">dummy list 1</div>
        <div data-component="dummy-4" data-ref="component-collection-ref">dummy list 2</div>
      </div>
    `;
    const refDefinition = {
      elementString: 'element-string',
      elementQuery: (parent: HTMLElement) =>
        parent.querySelector<HTMLElement>('[data-ref=element-query]'),
      elementRef: refElement('element-ref'),
      collectionRef: refCollection('collection-ref'),
      componentRef: refComponent(Dummy1),
      componentRefSpecific: refComponent(Dummy2, { ref: 'component-ref' }),
      componentCollectionRef: refComponents(Dummy3),
      componentCollectionRefSpecific: refComponents(Dummy4, { ref: 'component-collection-ref' }),
    };

    const instance = createComponentInstance({}, element, { name: 'foo', setup: () => [] });

    const value = createComponentRefs(refDefinition, instance);
    expect(value.elementString.element!.textContent).toEqual('element-string');
    expect(value.elementQuery.element!.textContent).toEqual('element-query');
    expect(value.elementRef.element!.textContent).toEqual('element-ref');
    expect(value.collectionRef.getElements.length).toEqual(3);
    expect(value.componentRef.component!.name).toEqual('dummy-1');
    expect(value.componentRefSpecific.component!.name).toEqual('dummy-2');
    expect(value.componentCollectionRef.getComponents().length).toEqual(3);
    expect(value.componentCollectionRefSpecific.getComponents().length).toEqual(2);

    expect(value.elementString.type).toEqual('element');
    expect(value.elementQuery.type).toEqual('element');
    expect(value.elementRef.type).toEqual('element');
    expect(value.collectionRef.type).toEqual('collection');
    expect(value.componentRef.type).toEqual('component');
    expect(value.componentRefSpecific.type).toEqual('component');
    expect(value.componentCollectionRef.type).toEqual('componentCollection');
    expect(value.componentCollectionRefSpecific.type).toEqual('componentCollection');
  });
});
