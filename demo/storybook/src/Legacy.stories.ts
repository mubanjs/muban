import type { Meta } from "@muban/storybook";
import type { Story } from "@muban/storybook/types-6-0";
import { StoryComponent, storyTemplate } from './TestComponent';

export default {
  title: 'Legacy',
  component: StoryComponent,
} as Meta;

// Storybook 6.x Story function - CSFv2
export const ClientFn: Story<{ initialValue?: boolean }> = () => ({
  component: StoryComponent,
  template: storyTemplate
});
ClientFn.args = {
  initialValue: false,
};

