import dedent from 'ts-dedent';
import { defineComponent } from '../../Component.Reactive';
import { getComponentRefs } from './getComponentRefs';
import { refCollection, refComponent, refElement } from './refDefinitions';

// eslint-disable-next-line @typescript-eslint/naming-convention
const Dummy1 = defineComponent({
  name: 'dummy-1',
  setup() {
    return [];
  },
});
// eslint-disable-next-line @typescript-eslint/naming-convention
const Dummy2 = defineComponent({
  name: 'dummy-2',
  setup() {
    return [];
  },
});

describe('getComponentRefs', () => {
  it('should return app props', () => {
    const element = document.createElement('div');
    element.innerHTML = dedent`
      <div>
        <p data-ref="element-string">element-string</p>
        <p data-ref="element-ref">element-string</p>
        <ul>
          <li data-ref="collection-ref">one</li>
          <li data-ref="collection-ref">two</li>
          <li data-ref="collection-ref">three</li>
        </ul>
        <div data-component="dummy-1">dummy</div>
        <div data-component="dummy-2" data-ref="component-ref">dummy specific</div>
      </div>
    `;
    const refDefinition = {
      elementString: 'element-string',
      elementRef: refElement('element-ref'),
      collectionRef: refCollection('collection-ref'),
      componentRef: refComponent(Dummy1),
      componentRefSpecific: refComponent(Dummy2, { ref: 'component-ref' }),
    };

    const value = getComponentRefs(refDefinition, element);
    expect(value.elementString.element!.textContent).toEqual('element-string');
    expect(value.elementRef.element!.textContent).toEqual('element-string');
    expect(value.collectionRef.elements.length).toEqual(3);
    expect(value.componentRef.component!.name).toEqual('dummy-1');
    expect(value.componentRefSpecific.component!.name).toEqual('dummy-2');
  });
});
