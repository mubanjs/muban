/* eslint-disable @typescript-eslint/no-explicit-any */
import { ref } from '@vue/reactivity';
import { watch, watchEffect } from '@vue/runtime-core';
import { html } from '../../../../src/lib/utils/template/mhtml';
import { defineComponent } from '../../../../src/lib/Component.Reactive';
import { propType } from '../../../../src/lib/utils/props/propDefinitions';
import { refCollection } from '../../../../src/lib/utils/refs/refDefinitions';
import { bind } from '../../../../src/lib/utils/bindings/bindingDefinitions';

export const FilterProductsChecklist = defineComponent({
  name: 'filter-products-checklist',
  props: {
    // TODO: add Array proptype, although that needs a nested type (conversion)
    categoryId: propType.string,
    onChange: propType.func.shape<(category: string, value: Array<string>) => void>().optional,
    selected: propType.string.optional,
  },
  refs: {
    checkboxes: refCollection('checkbox'),
  },
  setup({ props, refs }) {
    const selectedItems = ref<Array<string>>([]);

    watchEffect(() => {
      selectedItems.value = (props.selected || undefined)?.split(',') || [];
    });

    watch(
      () => selectedItems.value,
      (items) => {
        props.onChange?.(props.categoryId, items);
      },
    );

    return [bind(refs.checkboxes, { checked: selectedItems })];
  },
});

export type FilterProductsChecklistProps = {
  id: string;
  label: string;
  options: Array<{
    id: string;
    label: string;
  }>;
  selected?: Array<string>;
};
export const filterProductsChecklist = (
  { id, label, options, selected = [] }: FilterProductsChecklistProps,
  ref?: string,
) => html`
  <fieldset
    data-component=${FilterProductsChecklist.displayName}
    data-ref=${ref}
    class="form-fieldset"
    data-category-id=${id}
    data-selected=${selected.join(',')}
  >
    <legend>${label}</legend>
    <div class="form-group">
      ${options.map(
        (option) => html`
          <div class="form-check">
            <input
              type="checkbox"
              class="form-check-input"
              id=${`${id}${option.id}`}
              name=${`${id}[]`}
              value=${option.id}
              ?checked=${selected.includes(option.id)}
              data-ref="checkbox"
            />
            <label class="form-check-label" for=${`${id}${option.id}`}>${option.label}</label>
          </div>
        `,
      )}
    </div>
  </fieldset>
`;

export const meta = {
  component: FilterProductsChecklist,
  template: filterProductsChecklist,
};
