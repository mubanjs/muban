/* eslint-disable @typescript-eslint/no-explicit-any */
import attributeBinding from './dom/attributeBinding';
import checkedBinding from './dom/checkedBinding';
import cssBinding from './dom/cssBinding';

// TODO: these are just prototype bindings
// eslint-disable-next-line @typescript-eslint/ban-types
import eventBinding, { createEventBinding } from './dom/eventBinding';
import htmlBinding from './dom/htmlBinding';
import styleBinding from './dom/styleBinding';
import textBinding from './dom/textBinding';

export const bindingsList = {
  event: eventBinding,
  click: createEventBinding('click'),
  checked: checkedBinding,
  text: textBinding,
  style: styleBinding,
  css: cssBinding,
  html: htmlBinding,
  attr: attributeBinding,
};

export function registerDomBinding(
  name: string,
  fn: (target: HTMLElement, value: any) => void | (() => void),
): void {
  if (name in bindingsList) {
    console.error(`Binding "${name}" has already been registered`);
    return;
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (bindingsList as any)[name] = fn;
}
