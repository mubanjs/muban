import type { Story } from '@muban/storybook/dist/client/preview/types-6-0';
import { meta, TabbedContentProps } from './TabbedContent';

export default {
  title: 'TabbedContent',
  argTypes: {
    selectedIndex: { control: 'text' },
  },
};

export const Default: Story<TabbedContentProps> = () => meta;
Default.args = {
  selectedIndex: 1,
  items: [
    {
      label: 'item 1',
      content: `
        <h2>content <strong>1</strong></h2>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Atque consequatur cum laboriosam
          voluptate voluptatibus. Alias aut autem eligendi perspiciatis provident quae quisquam sapiente
          sequi, vero voluptatibus. Dolores dolorum exercitationem voluptate.
        </p>`,
      isActive: true,
    },
    {
      label: 'item 2',
      content: `
        <h2>content <em>2</em></h2>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Atque consequatur cum laboriosam
          voluptate voluptatibus. Alias aut autem eligendi perspiciatis provident quae quisquam sapiente
          sequi, vero voluptatibus. Dolores dolorum exercitationem voluptate.
        </p>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Atque consequatur cum laboriosam
          voluptate voluptatibus. Alias aut autem eligendi perspiciatis provident quae quisquam sapiente
          sequi, vero voluptatibus. Dolores dolorum exercitationem voluptate.
        </p>
      `,
    },
    {
      label: 'item 3',
      content: `
        <h2>content <strong><em>3</em></strong></h2>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Atque consequatur cum laboriosam
          voluptate voluptatibus. Alias aut autem eligendi perspiciatis provident quae quisquam sapiente
          sequi, vero voluptatibus. Dolores dolorum exercitationem voluptate.
        </p>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Atque consequatur cum laboriosam
          voluptate voluptatibus. Alias aut autem eligendi perspiciatis provident quae quisquam sapiente
          sequi, vero voluptatibus. Dolores dolorum exercitationem voluptate.
        </p>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Atque consequatur cum laboriosam
          voluptate voluptatibus. Alias aut autem eligendi perspiciatis provident quae quisquam sapiente
          sequi, vero voluptatibus. Dolores dolorum exercitationem voluptate.
        </p>
      `,
    },
  ],
};
