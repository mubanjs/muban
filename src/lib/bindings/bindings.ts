/* eslint-disable @typescript-eslint/no-explicit-any */
import type { BindingsHelpers, DataBinding } from './bindings.types';
import { attrBinding } from './dom/attrBinding';
import { checkedBinding, checkedValueBinding } from './dom/checkedBinding';
import { cssBinding } from './dom/cssBinding';
import { disableBinding, enableBinding } from './dom/enableDisableBinding';
import { eventBinding, createEventBinding } from './dom/eventBinding';
import { hasFocusBinding } from './dom/hasFocusBinding';
import { htmlBinding } from './dom/htmlBinding';
import { styleBinding } from './dom/styleBinding';
import { submitBinding } from './dom/submitBinding';
import { textBinding } from './dom/textBinding';
import { textInputBinding } from './dom/textInputBinding';
import { valueBinding } from './dom/valueBinding';
import { hiddenBinding, visibleBinding } from './dom/visibleHiddenBinding';

export const bindingsList = {
  event: eventBinding,
  click: createEventBinding('click'),
  mousedown: createEventBinding('mousedown'),
  mouseenter: createEventBinding('mouseenter'),
  mouseleave: createEventBinding('mouseleave'),
  mousemove: createEventBinding('mousemove'),
  mouseout: createEventBinding('mouseout'),
  mouseover: createEventBinding('mouseover'),
  mouseup: createEventBinding('mouseup'),
  submit: submitBinding,
  text: textBinding,
  html: htmlBinding,
  css: cssBinding,
  style: styleBinding,
  attr: attrBinding,
  visible: visibleBinding,
  hidden: hiddenBinding,
  enable: enableBinding,
  disable: disableBinding,
  hasFocus: hasFocusBinding,
  value: valueBinding, // "value" must be processed before "checked" to set the "checkedValue"
  checked: checkedBinding,
  checkedValue: checkedValueBinding,
  textInput: textInputBinding,
  // bindings that only store data used by other bindings, but not execute any logic
  allowUnset: (() => undefined) as DataBinding<boolean>,
  // selectedOptions // for multi-select list
  // options binding (need to decide if needed, or what to do if options are already rendered in the HTML)
};

export function registerDomBinding(
  name: string,
  fn: (target: HTMLElement, value: any, bindingHelpers: BindingsHelpers) => void | (() => void),
): void {
  if (name in bindingsList) {
    // eslint-disable-next-line no-console
    console.error(`Binding "${name}" has already been registered`);
    return;
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (bindingsList as any)[name] = fn;
}
