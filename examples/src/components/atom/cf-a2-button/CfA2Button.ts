import { bind, computed, defineComponent, html, propType, refComponent } from '../../../../../src';
import classNames from 'classnames';

import {
  defaultButtonSize,
  defaultDisabled,
  defaultIconAlignment,
  defaultLoading,
  defaultTarget,
} from './CfA2Button.config';
import type { CfA2ButtonTypes } from './CfA2Button.types';
import { CfA3Icon, cfA3Icon } from '../cf-a3-icon/CfA3Icon';

import './cf-a2-button.scss';
import { isIcon } from '../cf-a3-icon/CfA3Icon.config';

export const CfA2Button = defineComponent({
  name: 'cf-a2-button',
  props: {
    onClick: propType.func.shape<(event: MouseEvent) => void>().optional,
    icon: propType.string.optional.validate(isIcon),
  },
  refs: {
    buttonIcon: refComponent(CfA3Icon, {
      ref: 'button-icon',
      isRequired: false,
    }),
    loadingIcon: refComponent(CfA3Icon, {
      ref: 'loading-icon',
      isRequired: false,
    }),
  },
  setup({ props, refs }) {
    return [
      bind(refs.self, {
        click: (event) => props.onClick?.(event),
      }),
      bind(refs.buttonIcon, {
        name: computed(() => props.icon || refs.buttonIcon.component?.props.name || ''),
      }),
    ];
  },
});

export const cfA2Button = (
  {
    label,
    size = defaultButtonSize,
    title,
    href,
    disabled = defaultDisabled,
    ariaLabel,
    ariaControls,
    target = defaultTarget,
    icon,
    iconAlignment = defaultIconAlignment,
    className,
    loading = defaultLoading,
  }: CfA2ButtonTypes,
  ref?: string,
) => {
  const tag = href ? 'a' : 'button';

  return html`<${tag}
    data-component=${CfA2Button.displayName}
    data-ref=${ref}
    ...${{
      disabled: disabled || loading,
      href,
      title: title ?? label,
      target: href ? target : null,
      rel: href ? 'noopener' : null,
      class: classNames(
        { [`icon-alignment-${iconAlignment}`]: icon !== '' },
        `size-${size}`,
        className,
      ),
      'aria-label': ariaLabel,
      'aria-controls': ariaControls,
    }}
  >
    ${loading
      ? cfA3Icon({ name: 'loader', className: 'button-icon' }, 'loading-icon')
      : html`
          ${label && html`<span class="button-label">${label}</span>`}
          ${icon && cfA3Icon({ name: icon, className: 'button-icon' }, 'button-icon')}
        `}
  <//>`;
};
