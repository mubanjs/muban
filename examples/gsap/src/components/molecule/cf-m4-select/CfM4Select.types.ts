export type SelectOption = {
  label: string;
  value: string;
  selected?: boolean;
};

export type CfM4SelectTypes = {
  className?: Array<string> | string;
  placeholder?: string;
  name: string;
  options: Array<SelectOption>;
  multiple?: boolean;
};
