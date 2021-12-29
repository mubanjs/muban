/* eslint-disable @typescript-eslint/no-explicit-any */
import dedent from 'ts-dedent';
import { defineComponent } from '../Component';
import type { ComponentFactory } from '../Component.types';
import { createApp } from './apiCreateApp';
import { inject, provide } from './apiInject';

type CreateOptions = {
  provide?: () => void;
  injectSpy?: (...value: Array<any>) => void;
  injectKeys?: Array<string>;
};
function createComponent(
  name: string,
  // eslint-disable-next-line no-shadow
  { provide, injectSpy, injectKeys }: CreateOptions,
): ComponentFactory {
  return defineComponent({
    name,
    setup() {
      if (provide) {
        provide();
      }
      if (injectSpy && injectKeys) {
        injectSpy(...injectKeys.map((key) => inject(key)));
      }

      return [];
    },
  });
}

const wait = (timeout: number = 100) => {
  return new Promise<void>((resolve) => {
    setTimeout(() => {
      resolve();
    }, timeout);
  });
};

describe('apiInject', () => {
  it('should properly provide and inject values in a nested tree', async () => {
    const element = document.createElement('div');
    element.innerHTML = dedent`
      <div>
        <div data-component="dummy-1">
          <div data-component="dummy-2">
            <div data-component="dummy-3">
              <div data-component="dummy-4">
                dummy
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    const injectSpy = jest.fn();

    const Dummy1 = createComponent('dummy-1', {
      provide: () => {
        provide('foo', 42);
        provide('bar', true);
      },
      injectKeys: ['foo', 'bar'],
      injectSpy,
    });
    const Dummy2 = createComponent('dummy-2', { injectKeys: ['foo', 'bar'], injectSpy });
    const Dummy3 = createComponent('dummy-3', {
      provide: () => {
        provide('foo', 43);
      },
      injectKeys: ['foo', 'bar'],
      injectSpy,
    });
    const Dummy4 = createComponent('dummy-4', { injectKeys: ['foo', 'bar'], injectSpy });

    const app = createApp(Dummy1);
    app.component(Dummy2, Dummy3, Dummy4);
    app.provide('foo', 41);
    app.provide('bar', false);
    app.mount(element);

    await wait();

    expect(injectSpy).toBeCalledTimes(4);
    expect(injectSpy).toHaveBeenNthCalledWith(1, 41, false);
    expect(injectSpy).toHaveBeenNthCalledWith(2, 42, true);
    expect(injectSpy).toHaveBeenNthCalledWith(3, 42, true);
    expect(injectSpy).toHaveBeenNthCalledWith(4, 43, true);
  });
});
