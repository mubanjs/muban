import type {
  ComponentApi,
  ComponentFactory,
  InternalComponentInstance,
  LazyComponent,
} from '../Component.types';
import { createAttributePropertySource } from '../props/property-sources/createAttributePropertySource';
import { createHtmlPropertySource } from '../props/property-sources/createHtmlPropertySource';
import { createTextPropertySource } from '../props/property-sources/createTextPropertySource';
import { findParentComponent, getDirectChildComponents } from './domUtils';
import { isLazyComponent } from '../api/apiLazy';
import type { PropertySource } from '../props/getComponentProps';
import { createClassListPropertySource } from '../props/property-sources/createClassListPropertySource';
import { createDataAttributePropertySource } from '../props/property-sources/createDataAttributePropertySource';
import { createJsonScriptPropertySource } from '../props/property-sources/createJsonScriptPropertySource';
import { createReactivePropertySource } from '../props/property-sources/createReactivePropertySource';
import { createCustomPropertySource } from '../props/property-sources/createCustomPropertySource';
import { createFormPropertySource } from '../props/property-sources/createFormPropertySource';

// TODO: Move to "App"?
class MubanGlobal {
  public readonly components = new Map<string, ComponentFactory | LazyComponent>();
  public readonly instances = new Map<HTMLElement, ComponentApi>();
  public readonly loadingElements = new Set<HTMLElement>();
  public readonly propertySources: Array<PropertySource> = [
    createClassListPropertySource(),
    createDataAttributePropertySource(),
    createJsonScriptPropertySource(),
    createReactivePropertySource(),
    createAttributePropertySource(),
    createTextPropertySource(),
    createHtmlPropertySource(),
    createCustomPropertySource(),
    createFormPropertySource(),
  ];
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface Window {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    __muban__: MubanGlobal;
  }
}

// can't be called just "global", jest won't allow it
// https://github.com/facebook/jest/issues/10565
const globalScope = (globalThis || window || {}) as unknown as Window;

// eslint-disable-next-line no-multi-assign
const globalInstance = (globalScope.__muban__ = globalScope.__muban__ ?? new MubanGlobal());
export function getGlobalMubanInstance(): MubanGlobal {
  return globalInstance;
}

export function registerGlobalComponent(
  ...components: Array<ComponentFactory | LazyComponent>
): void {
  components.forEach((component) => {
    globalInstance.components.set(component.displayName, component);
  });
}

/**
 * 1. Start initializing components:
 * - either a single one calling "mount(component, container)"
 * - or a single one calling "component(element)"
 * - or multiple calling "initGlobalComponents(container)"
 *   - this will only try to initialize "direct child components" of the container
 *
 * 2. Each of the above components will:
 * - query and instantiate its own ref components (will recurse for each with its children at point 2)
 * - query and instantiate its "optional" sync components (will recurse for each with its children at point 2)
 * - query and start loading its "optional" lazy components
 *   once loaded, this will also instantiate the component (and will also recurse for its children at point 2)
 *
 * 3. If there are any "direct child components" left that are 1) not initialized or 2) not lazy loading
 * - try to initialize those globally (will recurse at point 2)
 * - if there are elements that cannot be initialized (because there are no matching components registered)
 *   - recurse each "direct child component" container  at point 3)
 *
 * @param container
 * @param watch
 */

export function initGlobalComponents(container: HTMLElement, watch: boolean = false): void {
  const initComponent = (
    component: ComponentFactory | LazyComponent,
    componentElement: HTMLElement,
  ) => {
    const parent = findParentComponent(componentElement)?.__instance;

    if (isLazyComponent(component)) {
      // setComponentElementLoadingState(componentElement, true);
      component().then((factory) => {
        // console.log('lazy loaded', factory);
        if (!isComponentElementLoadingOrInitialized(componentElement)) {
          const childInstance = factory(componentElement, { parent });

          // since this is async, we'll set this up as soon as it's loaded
          // which is later than anything else anyway
          childInstance.setup();

          // setComponentElementLoadingState(componentElement, false);
        }
      });
    } else if (!isComponentElementLoadingOrInitialized(componentElement)) {
      const childInstance = component(componentElement, { parent });

      // since this is managed outside of the normal component flow, set it up immediately
      childInstance.setup();
    }
  };

  const initComponents = () => {
    // return all children that are not initialized yet, and recurse
    const uninitializedChildren = getDirectChildComponents(container)
      // filter out elements that already have been initialized
      .filter((componentElement) => !getComponentForElement(componentElement))
      .map((componentElement) => {
        const componentName = componentElement.dataset.component;
        const factory = componentName && globalInstance.components.get(componentName);
        if (factory) {
          initComponent(factory, componentElement);
          return undefined;
        }
        return componentElement;
      })
      .filter(Boolean) as Array<HTMLElement>;

    uninitializedChildren.forEach((element) => {
      initGlobalComponents(element, watch);
    });
  };

  initComponents();

  // TODO: Needs testing
  if (watch) {
    // MutationObserver and do the above again
    const documentObserver = new MutationObserver(() => {
      initComponents();
    });
    documentObserver.observe(container, { attributes: false, childList: true, subtree: true });
  }
}

export function getComponentForElement<T extends ComponentApi>(
  element: HTMLElement,
): T | undefined {
  return globalInstance.instances.get(element) as T;
}

export function registerComponentForElement(element: HTMLElement, instance: ComponentApi): void {
  if (globalInstance.instances.has(element)) {
    // eslint-disable-next-line no-console
    console.warn(`Overwriting already existing instance for element:`, { element, instance });
  }
  globalInstance.instances.set(element, instance);
}

export function getParents(component: ComponentApi): Array<ComponentApi> {
  const parents: Array<InternalComponentInstance> = [];
  let ref = component.__instance;
  while (ref.parent) {
    ref = ref.parent;
    parents.push(ref);
  }
  return parents.map((instance) => instance.api!);
}

export function setComponentElementLoadingState(element: HTMLElement, isLoading: boolean): void {
  if (isLoading) {
    globalInstance.loadingElements.add(element);
  } else {
    globalInstance.loadingElements.delete(element);
  }
}

function isComponentElementLoadingOrInitialized(element: HTMLElement): boolean {
  return globalInstance.instances.has(element) || globalInstance.loadingElements.has(element);
}
