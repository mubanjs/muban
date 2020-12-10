import type { Story } from '@muban/storybook/dist/client/preview/types-6-0';

import type { CfA4WYSIWYGTypes } from './CfA4WYSIWYG.types';
import { cfA4WYSIWYG } from './CfA4WYSIWYG';
import { contentAlignments, defaultContentAlignment } from './CfA4WYSIWYG.config';
import { className } from '../../../storybook/argTypes';

export default {
  title: 'Atom/cf-a4-wysiwyg',
  argTypes: {
    className,
    alignment: {
      defaultValue: defaultContentAlignment,
      control: {
        type: 'select',
        options: contentAlignments,
      },
      description: 'The global alignment of the content',
      type: {
        required: false,
      },
      table: {
        category: 'Visual',
        defaultValue: {
          summary: defaultContentAlignment,
        },
        type: {
          summary: contentAlignments.join(' | '),
        },
      },
    },
  },
};

export const Default: Story<CfA4WYSIWYGTypes> = () => ({
  template: cfA4WYSIWYG,
});

Default.args = {
  content: `
    <h1>Ut molestie felis dignissim, euismod mauris sed, lacinia est.</h1>
    <h2>Quisque ut sem id ex mattis pulvinar a ac quam.</h2>
    <h3>Curabitur non quam non risus hendrerit euismod.</h3>
    <h4>Aliquam a massa condimentum, ornare ex eu, molestie elit.</h4>
    <h5>Donec ut elit vestibulum leo semper tincidunt.</h5>
    <h6>Donec ut elit vestibulum leo semper tincidunt.</h6>
    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque ipsum nibh, suscipit non elit
    ac, <b>venenatis euismod</b> mauris. Curabitur consequat mauris pharetra, ullamcorper
    felis id, tincidunt risus. Sed sed sapien suscipit, <a href="#">commodo libero nec, porta</a> odio.
    Fusce maximus leo a erat aliquam, quis vestibulum lectus placerat. Donec pulvinar maximus risus a
    facilisis. <i>Aliquam imperdiet</i> nisi in ullamcorper consectetur. In placerat venenatis dolor,
    id tristique justo aliquam ac. <u>Curabitur ullamcorper</u> sem facilisis quam placerat, sit amet
    suscipit nibh interdum. Etiam nec dignissim nulla.Nullam vitae mauris<sub>hendrerit</sub>, scelerisque
    nulla ac, scelerisque ipsum.</p>
    <ul>
      <li>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</li>
      <li>Integer sed metus nec lorem maximus lobortis et vitae odio.</li>
      <li>Donec ultrices elit vitae est dignissim, id consectetur velit venenatis.</li>
      <li>Sed feugiat leo et dictum cursus.</li>
    </ul>
    <p>Donec ut dolor a risus laoreet <sup>imperdiet</sup> in nec neque. Nulla eleifend est vitae magna cursus,
    sit amet tempus ipsum suscipit. Pellentesque laoreet elit at varius malesuada. Aenean euismod
    venenatis <strike>mauris nec</strike> viverra. Nam eleifend justo ipsum, id scelerisque velit pharetra ac. Nunc
    sed ante maximus, auctor diam non, luctus nibh. Etiam lobortis tellus elit, ac pretium nulla
    interdum non.</p>
    <ol>
      <li>Morbi quis lectus placerat, gravida elit vitae, fermentum nulla.</li>
      <li>Sed faucibus neque non erat viverra ultricies.</li>
      <li>Aliquam sit amet magna pharetra, convallis orci sed, ultricies sapien.</li>
    </ol>
    <blockquote>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc tincidunt neque nec metus aliquet viverra.
      <small>John Doe</small>
    </blockquote>
  `,
};
