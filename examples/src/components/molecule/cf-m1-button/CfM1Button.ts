import {
  bind,
  computed,
  defineComponent,
  html,
  propType,
  refComponent,
  refElement,
} from '../../../../../src';
import classNames from 'classnames';

import {
  defaultButtonSize,
  defaultDisabled,
  defaultIconAlignment,
  defaultLoading,
  defaultTarget,
} from './CfM1Button.config';
import type { CfM1ButtonTypes } from './CfM1Button.types';

import './cf-m1-button.scss';
import { isIcon } from '../../atom/cf-a2-icon/CfA2Icon.config';
import { CfA2Icon, cfA2Icon } from '../../atom/cf-a2-icon/CfA2Icon';

export const CfM1Button = defineComponent({
  name: 'cf-m1-button',
  props: {
    onClick: propType.func.shape<(event: MouseEvent) => void>().optional,
    icon: propType.string.optional.validate(isIcon),
    label: propType.string.optional,
  },
  refs: {
    buttonIcon: refComponent(CfA2Icon, {
      ref: 'button-icon',
      isRequired: false,
    }),
    buttonLabel: refElement('button-label', { isRequired: false }),
    loadingIcon: refComponent(CfA2Icon, {
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
      bind(refs.buttonLabel, {
        text: computed(() => props.label || ''),
      }),
    ];
  },
});

export const cfM1Button = (
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
  }: CfM1ButtonTypes,
  ref?: string,
) => {
  const tag = href ? 'a' : 'button';

  return html`<${tag}
    data-component=${CfM1Button.displayName}
    data-ref=${ref}
    data-label=${label}
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
      ? cfA2Icon({ name: 'loader', className: 'button-icon' }, 'loading-icon')
      : html`
          ${label && html`<span data-ref="button-label" class="button-label">${label}</span>`}
          ${icon && cfA2Icon({ name: icon, className: 'button-icon' }, 'button-icon')}
        `}
  <//>`;
};
