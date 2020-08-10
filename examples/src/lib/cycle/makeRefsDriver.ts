import xs from 'xstream';
import { mapValues } from 'lodash';
import typedObjectEntries from '../../type-utils/typedObjectEntries';

type RefItem = {
  type: 'element';
  ref: string;
  isRequired?: boolean;
};

const getRef = (refName: string, isRequired = true) => {
  return {
    refName,
    type: 'element',
    selector: (parent: HTMLElement) => {
      const selector = `[data-ref="${refName}"]`;
      const element = parent.querySelector(selector);
      if (!element && isRequired) {
        throw new Error(`Element not found ${selector}.`);
      }

      return element;
    },
    isRequired,
  };
};

export type ComponentRefs<T extends Record<string, any>> = T;

const getRefs = <T extends HTMLElement, R extends Record<string, string>>(refs: R, element: T) => {
  return typedObjectEntries(refs).reduce((accumulator, [propName, selector]) => {
    const el = getRef(selector).selector(element);
    console.log(el);
    (accumulator as any)[propName] = el;
    return accumulator;
  }, {} as ComponentRefs<R>);
};

export const makeRefsDriver = <R extends Record<string, any>>(
  refsSelection: ComponentRefs<R>,
  element: HTMLElement,
) => {
  return () => {
    console.log(refsSelection);
    const refs = refsSelection && (getRefs(refsSelection, element) as R);
    return mapValues(refs, (element) => {
      return {
        element,
        events: (eventType: string) => {
          const event$ = xs.create();
          let count = 0;
          element.addEventListener(eventType, function (event: any) {
            // lol
            event$.shamefullySendNext({ event, count: count++ });
          });

          return event$;
        },
      };
    });
  };
};
