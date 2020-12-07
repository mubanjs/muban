import type { iconAlignments } from './CfA2Button.config';

export type IconAlignment = typeof iconAlignments[number];

export type CfA2ButtonTypes = {
  label: string;
  title?: string;
  href?: string;
  target?: string;
  className?: Array<string> | string;
  disabled?: boolean;
  ariaLabel?: string;
  ariaControls?: string;
  icon?: string;
  iconAlignment?: IconAlignment;
  loading?: boolean;
  onClick?: (event: MouseEvent) => void;
};
