export type CfM4SelectTypes = {
  className?: Array<string> | string;
  placeholder?: string;
  name: string;
  options: Array<{
    label: string;
    value: string;
    selected?: boolean;
  }>;
};
