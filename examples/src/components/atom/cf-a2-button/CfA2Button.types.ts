export type CfA2ButtonTypes = {
  label: string;
  title?: string;
  href?: string;
  target?: string;
  className?: Array<string> | string;
  disabled?: boolean;
  ariaLabel?: string;
  ariaControls?: string;
  onClick?: (event: MouseEvent) => void;
};
