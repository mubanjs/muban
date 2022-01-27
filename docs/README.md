---
home: true
#heroImage: /hero.png
heroText: Muban
tagline: Writing components for server-rendered HTML
actions:
  - text: Get Started →
    link: /guide/
    type: primary
features:
  - title: Backend agnostic
    details: |
      Muban components only care about the rendered HTML, and will bind to that. During development
      it can render its own templates using lit-html, and are fully typed.
      Never be slowed down by waiting on backend setup and integration, use mock data to preview
      all your components.
  - title: Component based
    details: |
      Create small reusable components by keeping the template, style and script together, and 
      compose them to build blocks that make up your site.
      When the HTML is rendered on the server, Muban will attach components to the DOM and manage 
      interaction between them.
  - title: Modern setup
    details: |
      Muban uses Typescript to write your components and templates, uses the Vue reactivity API to
      manage component states, and has an easy way to setup bindings to your components to make them
      interactive, following a data-first approach.
footer: MIT Licensed | Copyright © 2020-present MediaMonks
---

```ts
export default defineComponent({
  name: 'toggle-expand',
  props: {
    isExpanded: propType.boolean.validate(optional(isBoolean)),
  },
  refs: {
    expandButton: refElement('expand-button'),
    expandContent: 'expand-content',
  },
  setup({ props, refs }) {
    const [isExpanded, toggleExpanded] = useToggle(props.isExpanded ?? false);
    const expandButtonLabel = computed(() => getButtonLabel(isExpanded.value));

    return [
      bind(refs.expandButton, { text: expandButtonLabel, click: () => toggleExpanded() }),
      bind(refs.self, {
        css: { isExpanded },
      }),
    ];
  },
});
```
