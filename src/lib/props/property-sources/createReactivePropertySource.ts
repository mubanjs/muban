import { reactive } from '@vue/reactivity';
import type { PropertySource } from '../getComponentProps';

export function createReactivePropertySource(): PropertySource {
  return () => {
    const props = reactive<Record<string, unknown>>({});
    return {
      sourceName: 'reactive',
      hasProp: (propInfo) => propInfo.source.name! in props,
      getProp: (propInfo) => props[propInfo.source.name!],
    };
  };
}
