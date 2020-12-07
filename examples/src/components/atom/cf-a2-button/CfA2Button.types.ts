import type { iconAlignments } from './CfA2Button.config';
import type { buttonSizes } from './CfA2Button.config';

export type IconAlignment = typeof iconAlignments[number];
export type ButtonSize = typeof buttonSizes[number];

export type CfA2ButtonTypes = {
  label?: string;
  size?: ButtonSize;
  title?: HTMLElement['title'];
  href?: HTMLAnchorElement['href'];
  target?: HTMLAnchorElement['target'];
  className?: Array<string> | string;
  disabled?: boolean;
  ariaLabel?: string;
  ariaControls?: string;
  icon?: string;
  iconAlignment?: IconAlignment;
  loading?: boolean;
  onClick?: (event: MouseEvent) => void;
};
