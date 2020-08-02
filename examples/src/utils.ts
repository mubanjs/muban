import { ComponentFactory } from './Component';
import RequireContext = __WebpackModuleApi.RequireContext;

const cache: Record<string, string> = {};

// eslint-disable-next-line @typescript-eslint/naming-convention
const store: Record<string, Record<string, () => ComponentFactory>> = {};

export function register(
  componentName: string,
  components: Record<string, () => ComponentFactory>,
): void {
  store[componentName] = components;
}

export function importAll(r: RequireContext) {
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

let activeComponentInstances: Array<ReturnType<ComponentFactory>> = [];

function cleanComponents(): void {
  activeComponentInstances.forEach((instance) => instance.dispose());
  activeComponentInstances = [];
}

export function initComponent(componentName: string, variation: string) {
  cleanComponents();
  const content = document.querySelector('.example-content');
  content.innerHTML = cache[componentName];

  document
    .querySelectorAll(`[data-component="${componentName}"]`)
    .forEach((element: HTMLElement) => {
      activeComponentInstances.push(store[componentName][variation]()(element));
    });
}

export function init() {
  const list = document.querySelector('.component-list');
  list.innerHTML = Object.keys(cache)
    .map(
      (componentName) => `<li><a href="?componentName=${componentName}">${componentName}</a></li>`,
    )
    .join('');

  const componentName = new URL(document.location.href).searchParams.get('componentName');
  if (cache[componentName]) {
    const componentHeading = document.querySelector('.component-heading');
    componentHeading.textContent = componentName;

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
}
