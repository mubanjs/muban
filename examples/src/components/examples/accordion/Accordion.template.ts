/* eslint-disable @typescript-eslint/naming-convention */

import { html } from '@muban/template';
import { Accordion } from './Accordion';
import { accordionSlideTemplate } from './AccordionSlide.template';
import type { AccordionSlideTemplateProps } from './AccordionSlide.template';

// eslint-disable-next-line @typescript-eslint/ban-types
export type AccordionTemplateProps = {
  slides: Array<AccordionSlideTemplateProps>;
  activeIndex?: number;
};

export function accordionTemplate(
  { slides, activeIndex }: AccordionTemplateProps,
  ref?: string,
): string {
  return html`<div data-component=${Accordion.displayName} data-ref=${ref}>
    ${slides.map((slide, index) =>
      accordionSlideTemplate({ ...slide, expanded: index === activeIndex }, 'accordion-slide'),
    )}
  </div>`;
}
