/* eslint-disable @typescript-eslint/no-explicit-any */
import Accordion, { accordion, AccordionProps } from './Accordion';
import type { Story } from '@muban/storybook/dist/client/preview/types-6-0';

export default {
  title: 'Accordion',
  argTypes: {
    activeIndex: { control: 'number' },
  },
};

// eslint-disable-next-line @typescript-eslint/naming-convention
export const Default: Story<AccordionProps> = () => ({
  template: accordion,
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
