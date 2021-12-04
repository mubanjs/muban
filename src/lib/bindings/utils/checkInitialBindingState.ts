export function checkInitialBindingState(
  bindingName: string,
  htmlValue: unknown,
  bindingValue: unknown,
  valueSource: 'html' | 'binding' | undefined,
): 'html' | 'binding' | undefined {
  // before we do anything, we need to check if our two sources are compatible
  // check if the value the model would set is the same as the currently checked value
  if (htmlValue !== bindingValue) {
    // if model is undefined, sync html to model initially
    if (bindingValue === undefined || valueSource === 'html') {
      return 'binding';
    }
    if (!valueSource) {
      // TODO: Dev only?
      // eslint-disable-next-line no-console
      console.error(
        `[${bindingName} binding] Your initial binding value is different from the html source;
html source: ${htmlValue}
binding value: ${bindingValue}

Please make sure your initial binding value is either "undefined" or matches the HTML source.
By default, the html source is leading, and will ignore and update your binding value.

Alternatively, you can configure this binding to take the binding value as the source of truth
by passing "initialValueSource: 'binding'" a part of this binding.

If you are unable to change the binding value, but want to using keep the HTML source value and
remove the warning, you can explicitly pass "initialValueSource: 'html'"
`,
      );
      return 'binding';
    }
  }
}
