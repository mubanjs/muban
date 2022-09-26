import dedent from 'ts-dedent';
import { computed, bind } from '../..';
import { defineComponent } from '../Component';
import { propType } from '../props/propDefinitions';
import { refComponent } from '../refs/refDefinitions';

it('Should namespace the child component bindings', async () => {
  const SomeChildComponent = defineComponent({
    name: 'some-child-component',
    props: {
      style: propType.string,
    },
  });

  const myElement = document.createElement('div');
  myElement.setAttribute('data-component', 'some-parent-component');
  myElement.innerHTML = dedent`
    <div data-component="some-child-component" data-ref="child" data-style="primary"></div>
  `;
  document.body.appendChild(myElement);

  const SomeParentComponent = defineComponent({
    name: 'some-parent-component',
    refs: {
      child: refComponent(SomeChildComponent, { ref: 'child' }),
    },
    setup({ refs }) {
      return [
        bind(refs.child, {
          style: computed(() => 'secondary'),
          $element: {
            css: computed(() => ({
              'is-active': true,
            })),
          },
        }),
      ];
    },
  })(myElement);

  expect(
    SomeParentComponent.element.querySelector('[data-ref=child]')?.classList.contains('is-active'),
  ).toBe(true);
  expect(SomeParentComponent.__instance.children[0].props.style).toBe('secondary');
});
