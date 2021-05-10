import { html } from '@muban/template';
import classNames from 'classnames';
import { CfA2Icon } from './CfA2Icon';
import type { CfA2IconTypes } from './CfA2Icon.types';

export const cfA2IconTemplate = ({ name, className }: CfA2IconTypes, ref?: string) => html`<span
  data-component=${CfA2Icon.displayName}
  data-name=${name}
  data-ref=${ref}
  ...${{ class: className ? classNames(className) : null }}
/>`;
