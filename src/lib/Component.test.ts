import dedent from 'ts-dedent';
import { computed, ref } from '..';
import { onMounted } from './api/apiLifecycle';
import { bind } from './bindings/bindingDefinitions';
import { defineComponent } from './Component';
import { propType } from './props/propDefinitions';
import { refComponent } from './refs/refDefinitions';

const mountChild = jest.fn();

describe("Child component defined as 'ref' twice", () => {
  const ChildComponent = defineComponent({
    name: 'child-component',
    props: {
      onClick: propType.func.shape<(event: MouseEvent) => void>(),
      text: propType.string.optional,
      parentAttr: propType.string.optional,
      grandParentAttr: propType.string.optional,
      isActive: propType.boolean.optional,
    },
    setup({ refs, props }) {
      onMounted(mountChild);

      return [
        bind(refs.self, {
          click: (event) => props.onClick(event),
          text: computed(() => props.text),
          css: {
            active: computed(() => Boolean(props.isActive)),
          },
          attr: {
            parent: computed(() => props.parentAttr),
            grandparent: computed(() => props.grandParentAttr),
          },
        }),
      ];
    },
  });

  const handleChildClickFromParent = jest.fn();

  const ParentComponent = defineComponent({
    refs: {
      child: refComponent(ChildComponent),
    },
    name: 'parent-component',
    setup({ refs }) {
      const childText = ref('text from parent');
      const childAttribute = ref('attr from parent');
      const isActive = ref(true);

      return [
        bind(refs.child, {
          onClick: handleChildClickFromParent,
          text: childText,
          parentAttr: childAttribute,
          isActive,
        }),
      ];
    },
  });

  const handleChildClickFromGrandParent = jest.fn();

  const grandParentElement = document.createElement('div');
  grandParentElement.setAttribute('data-component', 'grandparent-component');
  grandParentElement.innerHTML = dedent`
  <div data-component="parent-component">
    <button data-component="child-component"></button>
  </div>
`;
  document.body.appendChild(grandParentElement);

  const GrandParentComponent = defineComponent({
    name: 'grandparent-component',
    refs: {
      parent: refComponent(ParentComponent),
      child: refComponent(ChildComponent, {
        ignoreGuard: true,
      }),
    },
    setup({ refs }) {
      const childText = ref('text from grandparent');
      const childAttribute = ref('attr from grandparent');

      return [
        bind(refs.child, {
          onClick: handleChildClickFromGrandParent,
          text: childText,
          grandParentAttr: childAttribute,
        }),
      ];
    },
  })(grandParentElement);

  it('should execute child bindings in both the parent and grandParent components', async () => {
    const child = GrandParentComponent.element.querySelector<HTMLButtonElement>(
      '[data-component=child-component]',
    );

    if (child) {
      child.click();
      const handleChildClickFromGrandParentOrder =
        handleChildClickFromGrandParent.mock.invocationCallOrder[0];
      const handleChildClickFromParentOrder =
        handleChildClickFromParent.mock.invocationCallOrder[0];

      // The component should be mounted two times, one for Parent one for GrandParent
      expect(mountChild).toHaveBeenCalledTimes(2);
      // The click function from the parent gets called first, then the grapndparent's
      expect(handleChildClickFromParentOrder).toBeLessThan(handleChildClickFromGrandParentOrder);
      expect(handleChildClickFromGrandParent).toHaveBeenCalledTimes(1);
      expect(handleChildClickFromParent).toHaveBeenCalledTimes(1);
      // bindings are applied from the child component like Child > Parent > Grandparent
      // The final textContent should be the one defined in the grandparent
      expect(child.textContent).toBe('text from grandparent');
      expect(child.getAttribute('grandparent')).toBe('attr from grandparent');
      // The grandparent bindings for ChildComponent overwrite the ones declared in the parent component
      expect(child.getAttribute('parent')).toBe(null);
      // The active class was applied in the parent component and wasn't overwritten in the grandparent
      expect(child).toHaveClass('active');
    }
  });
});
