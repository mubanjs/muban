import { defineComponent, propType, supportLazy } from "@muban/muban";
import { isBoolean, optional } from "isntnt";

export const LazyTest = defineComponent({
  name: 'lazy-test',
  props: {
    initialValue: propType.boolean,
    isExpanded: propType.boolean.validate(optional(isBoolean)),
  },
  setup() {
    return [];
  },
});

export const lazy = supportLazy(LazyTest);
