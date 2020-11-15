# Dynamic Templates

[[toc]]

This document explores how to render templates dynamically from within the component based on
received data or user input.

In muban, ideally all HTML is rendered on the server, where muban components will just make things
interactive. This means that rendering HTML from JS is not the core part of muban.

However, there are cases where we want to "render" something from JS:
- When having a list of tiles, and we want to change the sorting or do local filtering, we need
  to take those existing items, and (conditionally) hide them or move them around.
- When having a list of tiles, and we have a "load more" button to load more content, and the API
  returns structured JSON data instead of plain HTML, we need to use that to render more items.
- Or a combination of the above, when sorting/filtering happens in the API, and we received back
  structured data.
- When searching, and we receive the results as structured data from the API.

There are a few different (technical) scenarios related to the above, so let's explore them:

1. In most cases, the templates that we need to render on the client, are also used to render those
   same items from the CMS. (e.g. load more) In other cases, some tiles are client-only. It's
   best to treat those templates exactly the same, and don't have a different syntax or mechanism
   to render each use case.
   
   Something to always keep in mind is that when rendering templates from
   the client, they should always be kept up-to-date with the CMS templates.
   
2. In some cases (like with client side filtering/sorting), the DOM elements already exist with the
   right data, so we don't _need_ to render them again, just hide/move them in the DOM. However, to
   execute any client side logic on those items, we need to extract the data first, which leaves
   us in the same place as the API use case - structured data that needs to be rendered (again).
   
   If we have a solid way of extracting all data from those items as a separate step, we can then
   continue from there the same way as the API use case.


So, what do we actually need to render dynamic templates from within a component?

- We need to have data, and know when it changes - so it should be defined as a binding, linked to
  an observable object
- We need to have a container where to render it in.
- If we go based on data, we have no way to make "append" mode work
- We need a template to render
    - This template can be a single item/component we pass data to
    - Or it can be for a list, and contains the loop and wrapping logic to render multiple items

Potential solutions could look like:

```tsx
// item template
type ItemTemplateProps = { title: string };
const itemTemplate = ({ title }: ItemTemplateProps = {}) => {
  return html`<div>
    <p>${title}</p>
  </div>`;
};
// list template

type ListTemplateProps = { items: Array<ItemTemplateProps> };
const listTemplate = ({ items = [] }: ListTemplateProps = {}) => {
  return html`<div>
    <ul>
      ${items.map(item => html`<li>${itemTemplate(item)}</li>`)}
    <ul>
  </div>`;
};

// store the items to render
const items = reactive([]);

// config to extract the data from the already rendered HTML
const extractOptions = {
  config: {},
  // when extracted, add the data to the items array
  onData: data => items.push(...data),
}

// set up dynamic template rendering
<refs.listContainer extract={extractOptions} data={{ items }} template={listTemplate} />
// or
<Template ref={refs.listContainer} extract={extractOptions} data={{ items }} template={listTemplate} />

```
