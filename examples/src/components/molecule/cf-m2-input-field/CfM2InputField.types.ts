import type { inputTypeOptions } from './CfM2InputField.config';

export type TextInputType = typeof inputTypeOptions[number];

export type CfM2InputFieldTypes = {
  label?: string;
  note?: Array<string> | string;
  className?: Array<string> | string;
  type: TextInputType;
  name: string;
  value: string;
};
