import xs, { Stream } from 'xstream';

// A driver that allows selecting ref streams from the source and element mutation descriptior streams to the sink

export type ElementMutationDescription = {
  text?: Stream<string>;
  html?: Stream<string>;
  style?: Record<string, Stream<string>>;
  className?: Stream<string | Array<string>>;
};

const makeRefBinder = (targetElement: HTMLElement) => (
  mutationDescription: ElementMutationDescription,
) => {
  return {
    targetElement,
    mutationDescription,
  };
};

type ElementMutationDescriptionWithTarget = ReturnType<typeof makeRefBinder>;

const makeEventSelector = (element: HTMLElement) => (eventType: string) => {
  const event$ = xs.create();
  let count = 0;
  element.addEventListener(eventType, function (event: any) {
    // lol
    event$.shamefullySendNext({ event, count: count++ });
  });

  return event$;
};

const makeRefSelector = <E extends HTMLElement>(rootElement: HTMLElement) => (
  refSelector: string,
) => {
  const element = rootElement.querySelector(`[data-ref="${refSelector}"]`) as E;

  return {
    element: () => xs.of(element),
    bind: makeRefBinder(element),
    events: makeEventSelector(element),
  };
};

export const makeRefBindingDriver = (rootElement: HTMLElement) => () => {
  return {
    rootElement: () => xs.of(rootElement),
    select: makeRefSelector(rootElement),
    // TODO: selectOptional, selectMany, selectComponent
  };
};

export type RefSelectorSource = ReturnType<ReturnType<typeof makeRefBindingDriver>>;

export const bindingsDriver = (bindings$: Stream<Array<ElementMutationDescriptionWithTarget>>) => {
  bindings$.addListener({
    next: (binding) => {
      console.log(binding);
      // castArray(binding).forEach((binding) => {
      //   const el = (binding.target as any).element as HTMLElement;
      //   if (binding.text) {
      //     el.innerText = binding.text;
      //   }
      //   if (binding.style) {
      //     Object.entries(binding.style).forEach(([key, val]) => {
      //       (el.style as any)[key] = val;
      //     });
      //   }
      // });
    },
    error: (err) => console.error(err),
    complete: () => console.log('completed'),
  });

  return bindings$;
};
