/* eslint-disable @typescript-eslint/naming-convention */
import classnames from 'classnames';
import { html, unsafeHTML } from '../../../../src/lib/utils/template/mhtml';
import { TabbedContent } from './TabbedContent';

export type TabButtonTemplateProps = {
  label: string;
  index: number;
  isActive?: boolean;
};

export const tabButtonTemplate = (
  { label, index, isActive }: TabButtonTemplateProps,
  ref?: string,
): string => html`
  <li class="nav-item">
    <button
      class="nav-link ${classnames({ active: !!isActive })}"
      data-ref=${ref}
      data-index=${index}
    >
      ${label}
    </button>
  </li>
`;

/////

type TabContentItemTemplateProps = {
  content: string;
  index: number;
};

export const tabContentItem = (
  { content, index }: TabContentItemTemplateProps,
  ref?: string,
): string =>
  html`<div class="tab-content" data-ref=${ref} data-index=${index}>${unsafeHTML(content)}</div>`;

/////

export type TabbedContentTemplateProps = {
  items: Array<Omit<TabButtonTemplateProps & TabContentItemTemplateProps, 'index'>>;
  selectedIndex?: number;
};

export const tabbedContentTemplate = (
  { items, selectedIndex }: TabbedContentTemplateProps,
  ref?: string,
): string => html`
  <div
    data-component=${TabbedContent.displayName}
    data-ref=${ref}
    data-selected-index=${selectedIndex}
  >
    <ul class="nav nav-tabs">
      ${items.map((item, index) => tabButtonTemplate({ ...item, index }, 'tab'))}
    </ul>
    ${items.map((item, index) => tabContentItem({ ...item, index }, 'tab-content'))}
  </div>
`;
