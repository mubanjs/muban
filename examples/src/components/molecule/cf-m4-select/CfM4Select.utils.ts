export type FocusDirection = 'up' | 'down';

const focussableElements = [
  'a[href]',
  'area[href]',
  'button',
  'details',
  'input',
  'iframe',
  'select',
  'textarea',
];

export const getSelectedValues = (options: Array<HTMLOptionElement>): Array<string> =>
  options.filter((option) => option.selected).map((option) => option.value);


export const moveFocus = (
  direction: FocusDirection,
  boundaryElement: HTMLElement = document.body,
): void => {
  const activeElement = document.activeElement as HTMLButtonElement;
  const elements = Array.from<HTMLElement>(
    boundaryElement.querySelectorAll(focussableElements.join(', ')),
  );
  const activeIndex = elements.indexOf(activeElement);

  let newIndex = activeIndex;

  switch (direction) {
    case 'up':
      newIndex = activeIndex - 1 >= 0 ? newIndex - 1 : elements.length - 1;
      break;
    case 'down':
      newIndex = (activeIndex + 1) % elements.length;
      break;
    default:
    // No default statement
  }

  if (elements[newIndex]) {
    elements[newIndex].focus();
  }
};
