/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Story } from '@muban/storybook/dist/client/preview/types-6-0';
import { meta, ParagraphProps } from './Paragraph';

export default {
  title: 'Paragraph',
  argTypes: {
    isExpanded: { control: 'boolean' },
  },
};

export const Default: Story<ParagraphProps> = () => meta;
Default.args = {
  title: {
    eyebrow: `A model for`,
    title: `Urban design in harmony with nature`,
  },
  copy: `THE LINE is a 170km-long belt linear urban development of multiple, hyper-connected cognitive
  cities, green natural open spaces and walkable communities with 100% renewable energy.`,
};
