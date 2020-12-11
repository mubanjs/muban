import { Circ } from 'gsap';

export const defaultSelectMultiple = false;

export const selectExpandDuration = 0.4;
export const selectExpandEase = Circ.easeInOut;
export const selectOverflowBuffer = 4;

export const selectOptionExtractConfig = {
  list: true,
  query: '.select-option',
  data: {
    value: {
      query: 'button',
      attr: 'value',
    },
    label: {
      query: '.button-label',
      html: true,
    },
  },
};
