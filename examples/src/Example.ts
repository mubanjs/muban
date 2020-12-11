/* eslint-disable @typescript-eslint/no-use-before-define */
import { computed, ref } from '@vue/reactivity';
import { isBoolean, optional } from 'isntnt';
import type { Story } from '@muban/storybook/dist/client/preview/types-6-0';
import { bind, html } from '../../src';
import { defineComponent } from '../../src/lib/Component.Reactive';
import { propType } from '../../src/lib/utils/props/propDefinitions';
import { refElement } from '../../src/lib/utils/refs/refDefinitions';
import { buttonTemplate } from './components/button/Button.template';

////////////////////////////////////////////////////////////////////////////////////////////////////
//                                    Create a story
////////////////////////////////////////////////////////////////////////////////////////////////////

// Component info
export default {
  title: 'ToggleExpand',
  argTypes: {
    isExpanded: { control: 'boolean' },
  },
};

// The story
// It's typed with the template props
export const Default: Story<ToggleExpandProps> = () => ({
  template: toggleExpand,
  component: ToggleExpand,
});
// Story preset args
Default.args = {
  isExpanded: true,
};

////////////////////////////////////////////////////////////////////////////////////////////////////
//                                    Write a template
////////////////////////////////////////////////////////////////////////////////////////////////////

// template props
type ToggleExpandProps = {
  isExpanded?: boolean;
};

// typed template
function toggleExpand({ isExpanded = false }: ToggleExpandProps = {}) {
  // setting the data-is-expanded state to be used as prop, and also the class itself
  return html`<div
    data-component="toggle-expand"
    data-is-expanded=${isExpanded ? 'true' : 'false'}
    class=${isExpanded ? 'isExpanded' : ''}
  >
    <p>
      Lorem ipsum dolor sit amet, consectetur adipisicing elit. Atque consequatur cum laboriosam
    </p>
    <p>
      <!-- include child template, passing any data, and a ref so we can access it -->
      ${buttonTemplate({ label: isExpanded ? 'read less...' : 'read more...' }, 'expand-button')}
    </p>
    <!-- specify a ref so we can target this in our component -->
    <p data-ref="expand-content">
      Lorem ipsum dolor sit amet, consectetur adipisicing elit. Distinctio error incidunt
    </p>
  </div>`;
}

////////////////////////////////////////////////////////////////////////////////////////////////////
//                                    Write a component
////////////////////////////////////////////////////////////////////////////////////////////////////

// just a simple reusable hook for a toggle state
const useToggle = (initialValue: boolean) => {
  // keep track of this boolean
  const state = ref(initialValue);

  // a toggle function
  const toggle = () => (state.value = !state.value);

  // expose the state and the function to the outside
  return [state, toggle] as const;
};

// define the component
const ToggleExpand = defineComponent({
  // provide the name
  name: 'toggle-expand',
  // specify all the props we want to extract from the HTML
  props: {
    // just an optional boolean for the expanded state
    isExpanded: propType.boolean.validate(optional(isBoolean)),
  },
  // specify references to elements we want to apply bindings to
  refs: {
    // we have multiple ref functions to get access to different type of html elements
    expandButton: refElement('expand-button'),
    // or a shortcut to get always get a single element
    expandContent: 'expand-content',
    // elements always get queried using the "data-ref" attribute
  },
  // the setup function, runs once per component instance creation, and sets up everything
  // get access to the props and the refs specified above, but resolved to values and DOM elements
  setup({ props, refs }) {
    // use the toggle hook, initiate it with the initial state from the HTML props
    const [isExpanded, toggleExpanded] = useToggle(props.isExpanded ?? false);

    // create a computed to show the right copy based on the expanded state
    const expandButtonLabel = computed(() => (isExpanded.value ? 'read less...' : 'read more...'));

    // return the JSX bindings
    // JSX is optional
    return [
      // // pass the label to the text binding, and the toggle function to the click binding
      // // these will auto-update the HTML whenever the state changes
      bind(refs.expandButton, { text: expandButtonLabel, click: () => toggleExpanded() }),
      // // toggle the css class of the expanded content based on the state
      bind(refs.expandContent, { css: computed(() => ({ isExpanded: isExpanded.value })) }),
    ];
  },
});
