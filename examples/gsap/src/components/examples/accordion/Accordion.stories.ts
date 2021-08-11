/* eslint-disable @typescript-eslint/no-explicit-any */
import { Accordion } from './Accordion';
import type { Story } from '@muban/storybook/dist/client/preview/types-6-0';
import { accordionTemplate } from './Accordion.template';
import type { AccordionTemplateProps } from './Accordion.template';

export default {
  title: 'Accordion',
  argTypes: {
    activeIndex: { control: 'number' },
  },
};

// eslint-disable-next-line @typescript-eslint/naming-convention
export const Default: Story<AccordionTemplateProps> = () => ({
  template: accordionTemplate,
  component: Accordion,
});
Default.args = {
  activeIndex: 1,
  slides: [
    {
      heading: 'Heading 1',
      content: 'Content 1',
    },
    {
      heading: 'Heading 2',
      content: 'Content 2',
    },
    {
      heading: 'Heading 3',
      content: 'Content 3',
    },
  ],
};
