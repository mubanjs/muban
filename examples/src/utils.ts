/* eslint-disable @typescript-eslint/no-explicit-any */
import RequireContext = __WebpackModuleApi.RequireContext;
import type { ComponentFactory } from '../../src/lib/Component.types';

const cache: Record<string, string> = {};

// eslint-disable-next-line @typescript-eslint/naming-convention
const store: Record<string, Record<string, () => ComponentFactory<any>>> = {};

export function register(
  componentName: string,
  components: Record<string, () => ComponentFactory<any>>,
): void {
  store[componentName] = components;
}

export function importTemplates(r: RequireContext): void {
  // eslint-disable-next-line no-return-assign
  r.keys().forEach((key) => {
    const componentName = /\/(.*)\//gi.exec(key)?.[1];
    if (componentName) {
      cache[componentName] = r(key).replace(/^<link.*?[\r\n]/, '');
    } else {
      console.log('no match found for', key);
    }
  });
}

export function importMeta(r: RequireContext): void {
  r.keys().forEach((key) => {
    const componentName = /\/(.*)\//gi.exec(key)?.[1];
    if (componentName) {
      register(componentName, r(key).default);
    }
  });
}

let activeComponentInstances: Array<{ dispose: () => void }> = [];

function cleanComponents(): void {
  activeComponentInstances.forEach((instance) => instance.dispose());
  activeComponentInstances = [];
}

export function initComponent(componentName: string, variation: string) {
  cleanComponents();
  const content = document.querySelector('.example-content');
  if (content) {
    content.innerHTML = cache[componentName];

    document.querySelectorAll(`[data-component="${componentName}"]`).forEach((element) => {
      activeComponentInstances.push(store[componentName][variation]()(element as HTMLElement));
    });
  } else {
    console.error('example-content not found');
  }
}

export function init() {
  const unmountButton = document.querySelector('.unmount-button');
  if (unmountButton) {
    unmountButton.addEventListener('click', () => {
      cleanComponents();
    });
  }

  const list = document.querySelector('.component-list');
  if (list) {
    list.innerHTML = Object.keys(cache)
      .map(
        (componentName) =>
          `<li><a href="?componentName=${componentName}">${componentName}</a></li>`,
      )
      .join('');

    const componentName = new URL(document.location.href).searchParams.get('componentName');
    if (componentName && cache[componentName]) {
      const componentHeading = document.querySelector('.component-heading');
      if (componentHeading) {
        componentHeading.textContent = componentName;
      }

      const select = document.getElementById('componentVariation') as HTMLSelectElement;
      if (store[componentName]) {
        const options = Object.keys(store[componentName])
          .map((name) => `<option value="${name}">${name}</option>`)
          .join('');
        select.innerHTML = options;
      }

      select.addEventListener('change', () => {
        initComponent(componentName, select.value);
      });
      initComponent(componentName, select.value);
    }
  } else {
    console.error('component-list not found');
  }
}
