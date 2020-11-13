import { createElement } from './JSX.ts';

function setup() {

  // JSX
  return (
    <>
      <refs.expandButton
        text={expandButtonLabel}
        click={toggleExpanded}
      />
      <refs.expandContent
        style={() => ({
          display: isExpanded.value ? 'block' : 'none',
        })}
      />
    </>
  );

  // turns into createElement calls
  return [
    createElement(refs.expandButton, { text: expandButtonLabel, click: toggleExpanded }),
    createElement(refs.expandContent, {
      style: computed(() => ({
        display: isExpanded.value ? 'block' : 'none',
      })),
    }),
  ];

  // which internally do this
  return [
    refs.expandButton({ text: expandButtonLabel, click: toggleExpanded }),
    refs.expandContent({
      style: computed(() => ({
        display: isExpanded.value ? 'block' : 'none',
      })),
    }),
  ];

  // which is a Proxy for this
  BindElement({ ref: refs.expandButton, text: expandButtonLabel, click: toggleExpanded });

  // which could be written as
  <BindElement
    ref={refs.expandButton}
    text={expandButtonLabel}
    click={toggleExpanded}
  />

  // and both turn into
  return {
    type: 'element',
    props: { ref: refs.expandButton, text: expandButtonLabel, click: toggleExpanded },
  };
}



