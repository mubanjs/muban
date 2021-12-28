import type { iconAlignments, buttonSizes } from './CfM1Button.config';

export type IconAlignment = typeof iconAlignments[number];
export type ButtonSize = typeof buttonSizes[number];

export type CfM1ButtonTypes = {
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
