import { reactive } from '@vue/reactivity';
import type { PropertySource } from '../getComponentProps';

export function createReactivePropertySource(): PropertySource {
  return () => {
    const props = reactive<Record<string, unknown>>({});
    return {
      sourceName: 'reactive',
      hasProp: (propName) => propName in props,
      getProp: (propName) => props[propName],
    };
  };
}
