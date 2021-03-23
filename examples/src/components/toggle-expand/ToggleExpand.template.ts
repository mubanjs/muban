/* eslint-disable react/jsx-key */
import { templateComponentFactory } from '../../../../src/lib/template/templateComponentFactory';
import { html } from '../../../../src/lib/template/mhtml';
import { buttonTemplate } from '../button/Button.template';

import { ToggleExpand } from './ToggleExpand';

const getButtonLabel = (isExpanded: boolean) => (isExpanded ? 'read less...' : 'read more...');

export type ToggleExpandTemplateProps = {
  isExpanded?: boolean;
};

export const toggleExpandTemplate = templateComponentFactory({
  component: ToggleExpand,
  jsonProps(props) {
    return props;
  },
  children({ isExpanded = false }) {
    return html`
      <p>
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Atque consequatur cum laboriosam
        voluptate voluptatibus. Alias aut autem eligendi perspiciatis provident quae quisquam
        sapiente sequi, vero voluptatibus. Dolores dolorum exercitationem voluptate.
      </p>
      <p>${buttonTemplate({ label: getButtonLabel(isExpanded) }, 'expand-button')}</p>
      <p data-ref="expand-content">
        Lorem ipsum <strong>dolor</strong> sit <em>amet</em>, consectetur adipisicing elit.
        Distinctio error incidunt necessitatibus repellendus sint. A, deleniti ducimus ex facere
        ipsam libero quae quas temporibus voluptas voluptates. Blanditiis consequatur deserunt
        facere!
      </p>
    `;
  },
});
