import dedent from 'ts-dedent';
import { defineComponent } from '../Component';
import type { ComponentFactory } from '../Component.types';
import { onMounted, onUnmounted } from './apiLifecycle';

function createComponent(
  name: string,
  { setupSpy, mountSpy, unmountSpy }: Record<string, () => void>,
): ComponentFactory {
  return defineComponent({
    name,
    setup() {
      setupSpy();

      onMounted(() => {
        mountSpy();
      });

      onUnmounted(() => {
        unmountSpy();
      });

      return [];
    },
  });
}

describe('apiLifecycle', () => {
  it('should call setup, mount and unmount, in the right order', () => {
    const element = document.createElement('div');
    element.innerHTML = dedent`
      <div>
        <div data-component="dummy-1">dummy</div>
      </div>
    `;

    const setupSpy = jest.fn();
    const mountSpy = jest.fn();
    const unmountSpy = jest.fn();

    const Dummy1 = createComponent('dummy-1', { setupSpy, mountSpy, unmountSpy });

    const componentElement = element.querySelector<HTMLElement>('[data-component=dummy-1]')!;
    const instance = Dummy1(componentElement);
    expect(setupSpy).toBeCalledTimes(1);
    expect(mountSpy).toBeCalledTimes(1);

    instance.dispose();
    expect(unmountSpy).toBeCalledTimes(1);
  });
});
