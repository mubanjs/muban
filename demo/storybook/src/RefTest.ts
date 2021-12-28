import { defineComponent, refElement } from '@muban/muban';
import type { ElementRef } from '@muban/muban';

// These are some library functions that can be typed as generic or specific
// uses the generic type, defaults to HTMLElement
function defaultRef(ref: ElementRef) {
  return ref;
}
// uses a specific type
function htmlRef(ref: ElementRef<HTMLDivElement>) {
  return ref;
}
// uses an SVG element
function svgRef(ref: ElementRef<SVGElement>) {
  return ref;
}

export const RefTest = defineComponent({
  name: 'ref-test',
  refs: {
    defaultRef: 'default',
    htmlRef: refElement<HTMLDivElement>('html'),
    svgRef: refElement<SVGElement>('svg'),
  },
  setup({ refs }) {
    defaultRef(refs.defaultRef);
    htmlRef(refs.htmlRef);
    svgRef(refs.svgRef);
    return [];
  },
});

