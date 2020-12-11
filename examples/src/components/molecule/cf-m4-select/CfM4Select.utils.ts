export const getSelectedValues = (options: Array<HTMLOptionElement>): Array<string> =>
  options.filter((option) => option.selected).map((option) => option.value);
