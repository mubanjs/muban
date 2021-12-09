import { unref, watchEffect } from '@vue/runtime-core';
// import { debounce } from 'lodash-es';
import type { BindingValue } from '../bindings.types';

// TODO: this might be _slightly_ more performant, but could have downsides
//  like race conditions or queue-mismanagement
// const queue = [] as Array<[HTMLElement, string]>;
// const processQueue = debounce(() => {
//   console.log('process', queue.length);
//   // optimized code
//   for (let i = 0; i < queue.length; ++i) {
//     if (queue[i][0].innerHTML !== queue[i][1]) {
//       queue[i][0].innerHTML = queue[i][1];
//     }
//   }
//   queue.length = 0;
// }, 10);

/**
 * We don't safety-check anything, it's your responsibility to make sure the HTML is safe.
 * - Use https://github.com/cure53/DOMPurify to sanitize your HTML by removing all dangerous things
 * - Use https://github.com/component/escape-html to sanitize any variables you include in your "already safe" html
 * - use the `text` binding if you don't need any HTML
 *
 * @param target
 * @param value
 */
export function htmlBinding(target: HTMLElement, valueAccessor: BindingValue<string>) {
  return watchEffect(() => {
    const newValue = unref(valueAccessor);
    // only update HTML when it has changed
    // - reading it is fairly cheap
    // - writing when nothing has changed causes MutationObserver to trigger, which can be heavy
    if (target.innerHTML !== newValue) {
      target.innerHTML = newValue;
    }
  });
  // TODO; see above in file
  // return watchEffect(() => {
  //   queue.push([target, unref(valueAccessor)]);
  //   processQueue();
  // });
}
