import kebabCase from 'lodash/kebabCase';
import camelCase from 'lodash/camelCase';
import type { PropertySource } from '../getComponentProps';

export function createClassListPropertySource(): PropertySource {
  return (element) => ({
    sourceName: 'class-list',
    hasProp: (propName, definition) => definition.type === Boolean,
    getProp: (propName, definition) => {
      return definition.type === Boolean
        ? element.classList.contains(propName) ||
            element.classList.contains(camelCase(propName)) ||
            element.classList.contains(kebabCase(propName))
        : undefined;
    },
  });
}
