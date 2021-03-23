# Dev Status

## Generic component structure

**Done**
+ Created a setup functions that expects an options-object and returns a factory function to
 initialize the component
+ Add support for props, refs, and a setup function
+ Setup function receives the props, refs and the component element as arguments
+ Implement Provide/Inject/Context support to component tree
+ Add API to render your root component/template using mhtml rendering
+ re-export vue and lit-html types and used methods
+ async component lazy loading, only supported for the anonymous `components` array, not for refs
+ Make sure lazy components are only inited when the `data-component` value exists in the DOM.
+ Add registerGlobalComponent to allow components to be auto-created whenever they exist in the DOM
+ Add Devtools integration

**Todo**
- [build] focus on package size
- Improve logging
- [build] Introduce dev MODE and Devtools FLAG
- Find a way to have template-less components that can act as logic (e.g. context) wrappers
  without having to render "data-component divs" for them.

**External**
- Animation setup, with nested component animations
  - move towards a separate animation library that can make use of the context
- Form tooling and validation
  - should be an external library that makes uses of muban features and bindings

## Props

Research: [component-props](docs/research/component-props.md).

**Done**
+ define props as part of component definition
+ pass prop type
+ pass prop validation
+ pass default value
+ type inferred to the setup function
+ read prop from data attribute
+ read prop from json script
+ read prop from reactive (parent) source
+ Access the props of a child component to reads its initial state
+ Make difference between required/optional input, or the resolved prop is missing a value
  (possible being undefined)

**Todo**
- Add "any" prop until we have support for complex objects
- Allow props to be retrieved from other attributes besides `data-foo`
  - figure out how to "specify" the element+property source as part of the propTypes
- Add (better) parsing and typing of non-primitive props (Arrays of strings, Objects) (Potentially
  using third party libs like io.ts or Joy)
  - get rid of the chaining API to be consistent with `refs`
- [tests] Finish unit tests for all cases

## Refs

Research: [component-refs](docs/research/component-refs.md).

**Done**
+ define refs as part of component definition
+ support ref element
+ support ref collection
+ support ref component
+ support ref components
+ type inferred to the setup function
+ add ref validation with runtime error logging
+ update refs when DOM updates
+ update bindings when refs update
+ destroy ref bindings when component unmounts
+ Rename `refs.foo.value` to either `refs.foo.element(s)` or `refs.foo.component(s)`
+ Add default `self` ref to the component root element, to allow bindings on that as well
+ Add `bindMap` util to better map over a collection of elements/components where logic is needed
  to create the binding values based up on the ref props or array index
+ Add a `components` prop to component definitions to init any child components it finds without
  having to use explicit refs. Useful for dynamic component rendering.
+ update refDefinition with custom element selection function, allowing users to provide their
  own implementation if they want to opt-out of the default "ref" selection.
+ Make sure to don't init global components that are also specified as ref, otherwise you'll get
  duplicate instances
+ Limit the depth of initialize child component to only direct children.

**Todo**
- [tests] Add unit tests
- rename to element/elements/component/components

**Parked**
- [api] rename refs to something else, to not conflict with the reactive `ref/unref` functions?
    - github Catalyst uses `target`
- [internal] move the `createRef` out of the `refDefinition`, since it's implementation is too 
  complex to ask
  users to provide it themselves. Just need to figure out how to type these, probably using the same
  look up map as used during runtime based on the `type` field.
    - This became a bit easier now we introduced `queryRef`, and if we choose to only limit ref 
      creation for those 4 types (element/component/single/collection)


## Child components

**Done**
+ Can init child component configured as Ref
+ Can react to parent prop updates
+ Can communicate back to parent props (e.g. call function)

**Todo**
- test use case with template binding and child components where bindings are not passed as props

## Bindings

**Done**
+ Can be defined via functions
+ Fully typed
+ Reactive when observable properties are passed
+ Implemented simple text, click, style and class bindings
+ Implement 2-way `checked` binding
+ Cleanup bindings on onmount
+ Rebind when refs change
+ Remove JSX support - too much setup, code complexity and typing issues
+ Improve bindings by allowing refs in binding object values vs the complete object
+ Allow basic event/css/style/attr bindings on component refs
+ add registerDomBinding to allow user-land bindings, including types by extending an Interface

**Progress**
- Implement robust bindings for everything
- [examples] Add storybook examples for all bindings

**Todo**
- [tests] Add unit tests
- move `registerDomBinding` to the `createApp` interface
- [css] make "removing classes" work where object keys are combined classname strings

## Lifecycle

**Done**
+ Add mount and unmount lifecycle hooks
+ Unmount components when their DOM element gets removed (using MutationObserver)
+ Clear all (element) bindings when unmounting a component

**Todo**
- [app.mount] same as `bindTemplate`, combine template + data into a render function

**Parked**
- Figure out if/how (lifecycle) hooks can be shared between Muban and future Vue integration in
 projects 

## Templates

**Done**
+ Add TS templates using lit-html
+ Add TS template props
+ Render child components (by calling their template functions as inline expressions, passing data)
+ Pass down ref ids to child components, so they can be referenced by the parent component
+ switch to htm+vhtml for templating, creating mhtml with utils
+ add unsafeHtml util
+ add classMap util (has been removed, use existing `classnames` module)
+ replace classMap helper with classnames npm package

**Todo**
- Add runtime (during dev) and build-time template prop validation
- split off in own package (@muban/mtl`) to further separate the code (no need for code 
  splitting)


## Styles

**Done**
+ Support for normal CSS when imported in the template file

**Todo**

**Parked**
- Figure out if we can do some kind of CSS-in-JS, but that is hard when templates move to CMS
    - basically impossible - or loses most benefits

## Storybook

**Done**
+ Basic support for rendering a component
+ Support for render props passed to the template
+ Add proper @muban/storybook framework as NPM module for this new version
+ Make TS component optional
+ Add data as optional story prop to modify incoming args

**Todo**
- Add support for component sources (which is more difficult, since templates are now TS
 functions, potentially in the same file, and data is just defined in stories)
- Add support for component event props, logging them as actions

## Runtime dynamic templates

Research: [component-dynamic-templates](docs/research/component-dynamic-templates.md).

**Done**
+ Add `Template` binding with support for extracting data from existing HTML, and re-rendering
  a given template with reactive data.
+ Add linked typings between `template` props and `data` computed for bindTemplate parameters
+ Add a boolean to not re-render the template initially, and only when the passed data changes.
  This could be useful for when you're never re-rendering based on client-side logic, but only
  rendering what comes back from the API after interacting with the page (e.g. load more,
  filtering). This would save an unneeded re-render during page load.

**Todo**
- [bindTemplate] See if we can combine template + data into a render function that is watched
- [bindTemplate] be smarter about immediateRender usage (based on existing DOM), and do a
  forceRender as override
