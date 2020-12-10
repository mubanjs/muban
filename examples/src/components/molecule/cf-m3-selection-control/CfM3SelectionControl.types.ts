import type { selectionControlInputTypes } from './CfM3SelectionControl.config';

export type SelectionControlType = typeof selectionControlInputTypes[number];

export type CfM3SelectionControlTypes = {
  label?: string;
  note?: Array<string> | string;
  className?: Array<string> | string;
  type: SelectionControlType;
} & Omit<HTMLInputElement, 'type'>;
