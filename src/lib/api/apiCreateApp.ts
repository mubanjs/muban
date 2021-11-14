/* eslint-disable @typescript-eslint/naming-convention,@typescript-eslint/no-explicit-any */
import type { LazyComponent } from '../Component.types';
import type { ComponentApi, ComponentFactory, InternalComponentInstance } from '../Component.types';
import { devtoolsInitApp, devtoolsUnmountApp } from '../utils/devtools';
import { registerGlobalComponent } from '../utils/global';
import { mount } from '../utils/mount';
import type { InjectionKey } from './apiInject';

const version = '10';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface AppConfig {}
export interface App {
  version: string;
  config: AppConfig;
  component(...components: Array<ComponentFactory | LazyComponent>): void;
  mount<P extends Record<string, unknown>>(
    rootContainer: HTMLElement,
    template?: (props: P) => string | Array<string>,
    data?: P,
  ): void;
  unmount(rootContainer: HTMLElement | string): void;
  provide<T>(key: symbol | string, value: T): this;

  // internal, but we need to expose these for the server-renderer and devtools
  _uid: number;
  _component: ComponentFactory;
  _instance: InternalComponentInstance | null | undefined;
  _props: Record<string, unknown> | null;
  _container: HTMLElement | null;
  _context: AppContext;
}

export interface AppContext {
  app: App; // for devtools
  config: AppConfig;
  components: Record<string, ComponentApi>;
  provides: Record<string | symbol, any>;
  /**
   * Flag for de-optimizing props normalization
   * @internal
   */
  deopt?: boolean;
  /**
   * HMR only
   * @internal
   */
  reload?: () => void;
}

export function createAppContext(): AppContext {
  return {
    app: null as any,
    config: {
      // isNativeTag: NO,
      // performance: false,
      // globalProperties: {},
      // optionMergeStrategies: {},
      // isCustomElement: NO,
      // errorHandler: undefined,
      // warnHandler: undefined,
    },
    components: {},
    provides: Object.create(null),
  };
}

let uid = 0;

export function createApp<C extends ComponentFactory>(rootComponent: C) {
  // if (rootProps != null && !isObject(rootProps)) {
  //   console.warn(`root props passed to app.mount() must be an object.`);
  //   rootProps = null;
  // }

  const context = createAppContext();

  let isMounted = false;

  const app: App = (context.app = {
    _uid: uid++,
    _component: rootComponent as ComponentFactory,
    _instance: null,
    _props: null,
    _container: null,
    _context: context,

    version,

    get config() {
      return context.config;
    },

    set config(v) {
      console.warn(`app.config cannot be replaced. Modify individual options instead.`);
    },

    component(...components: Array<ComponentFactory | LazyComponent>): any {
      registerGlobalComponent(...components);

      return app;
    },

    mount<P extends Record<string, unknown>>(
      rootContainer: HTMLElement,
      template?: (props: P) => string | Array<string>,
      data?: P,
    ): ReturnType<C> | undefined {
      if (!isMounted) {
        const component = mount(app, rootComponent, rootContainer, template, data);
        app._instance = component?.__instance;
        if (app._instance) {
          app._instance.appContext = context;
        }

        isMounted = true;
        app._container = (app._instance?.element as HTMLElement) ?? null;
        // for devtools and telemetry
        // (rootContainer as any).__vue_app__ = app;

        // TODO: devtools
        // if (__DEV__ || __FEATURE_PROD_DEVTOOLS__) {
        devtoolsInitApp(app, version);
        // }

        return component as ReturnType<C>;
      } else {
        console.warn(
          `App has already been mounted.\n` +
            `If you want to remount the same app, move your app creation logic ` +
            `into a factory function and create fresh app instances for each ` +
            `mount - e.g. \`const createMyApp = () => createApp(App)\``,
        );
      }
    },

    unmount() {
      if (isMounted) {
        // TODO unmount original container
        // render(null, app._container);

        // TODO: devtools
        // if (__DEV__ || __FEATURE_PROD_DEVTOOLS__) {
        devtoolsUnmountApp(app);
        // }
      } else {
        console.warn(`Cannot unmount an app that is not mounted.`);
      }
    },

    provide<T>(key: InjectionKey<T> | string, value: T) {
      if ((key as string | symbol) in context.provides) {
        console.warn(
          `App already provides property with key "${String(key)}". ` +
            `It will be overwritten with the new value.`,
        );
      }
      // TypeScript doesn't allow symbols as index type
      // https://github.com/Microsoft/TypeScript/issues/24587
      context.provides[key as string] = value;

      return app;
    },
  });

  context.app = app;

  return app;
}
