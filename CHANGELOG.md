# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project
adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0-alpha.32] - 2022-02-28

### Fixed

- Fixed bug from `alpha.31` where component props would be typed as `Ref` in bindings.

## [1.0.0-alpha.31] - 2022-02-28

### Breaking

Highlights of breaking changes from the log further down:

#### Simplify usage of `lazy` components

In order to use components as `lazy`, they had to be exported with the `supportLazy` helper. This is
not needed anymore. The `lazy` function now determines the export based on the `displayName` (1st
parameter), which should match the export based on convention. If you follow this convention for
your components, you don't have to change anything.

If you had a `webpackExports: lazy` comment in your `import` statement (as was previously
recommended in the docs and examples), this can be removed.

If your component export doesn't match the convention, you can provide the `exportName` (3rd
parameter).

See the docs for [lazy](https://mubanjs.github.io/muban/api/component.html#lazy) for more details.

#### Only allow passing reactive values to component `props` in `bindings`

Previously you could pass non-reactive values to component `prop` `bindings`. While this technically
works, this is **often not intended**, and results in the unexpected behaviour of the component not
receiving updated values. This change requires all bindings to component props to be reactive.

Even though this is technically a breaking change, any cases that will give an error after upgrading
to this version, were probably mistakes in your existing code.

If you do have a need for static values in your bindings, you should now wrap them in a `computed`.

#### Two-way input `bindings`

Two-way bindings sync up the state between the component and the HTML. If the initial state of the
two match up, there is nothing to do here. But if the initial state is different (e.g. a `ref` has
`true`, but html has `false`), the binding code doesn't know what to do.

By default, it still picks the HTML as the initial source, but a warning is logged that they were
not equal. To change this behaviour, or get rid of the warning, you can explicitly provide the
source by setting the `initialValueSource` binding config to either `html` or `binding`.

See the docs for [bindings](https://mubanjs.github.io/muban/api/bindings.html#form-bindings) for
more details.

#### Make the `props` object parameter in the `setup` function `readonly`.

Previously it was possible to abuse the `props` objects that is passed in the `setup` function as
internal component state. While this can work for extracted props, for the ones passed from parent
components this could result in conflicts.

Since the data flow should be predictable, props should only flow from source (html or parent) to
target (child), and should be immutable. This is why this object is now `readonly`. Both at runtime
(will log an error) and in the type system.

If your code relies on this current behaviour, you should copy this state to an internal `ref`, and
use that to read and write the value instead.

#### Improve control over `bindTemplate` rendering

The biggest change here is that the `data` and `template` properties are now merged into a single
`onUpdate` function, that acts as a `watchEffect`. All usages of `bindTemplate` have to be updated.

Previously:

```ts
bindTemplate(
  refs.container,
  () => someData.value,
  (data) => data.map(renderTemplate),
);
```

Now:

```ts
bindTemplate(refs.container, () => someData.value.map(renderTemplate));
```

Read the docs on [bindTemplate](https://mubanjs.github.io/muban/api/bindings.html#bindtemplate) to
understand when the optional `onlyWach` parameter from `onUpdate` can be used to improve performance
in advanced use cases.

Additionally, the `renderImmediate` option has been changed to `forceImmediateRender` to indicate
the new behaviour. Previously you would have to be explicit about when the `bindTemplate` should
render immediately or not, while the new implementation does this based on the existence of any HTML
inside the container. `forceImmediateRender` can override this behaviour.

### Added

- Allow the `.source()` option of the `propType.` helper to receive an array of source
  configurations. The first hit will be used.
- Add support for multiple components in `refComponents` – same as already was possible in
  `refComponent`
- Proxy `watch`/`watchEffect` to allow auto-cleanup on component unmount – no need to clean these up
  yourself anymore.
- Allow typing refs as `SVGElement`

### Fixed

- Fix usage of the `css` "string" binding.
- Fix usage of multiple classes as key for the `css` "object" binding.
- Fix issues with **two-way** input `bindings`.
- Allow DOM `bindings` on components without `props`
- Fix issue with `queryRef` where a nested element would be found and ignored

### Changed

- Simplify usage of `lazy` components.
- Only allow passing **reactive values** to component `props` in `bindings`.
- When **two-way** input `bindings` don't match between the html and the initial binding value, the
  `initialValueSource` binding config should be added to specify which source should be used.
- Make the `props` object parameter in the `setup` function `readonly`.
- Improve control over `bindTemplate` rendering.
- Update `@vue/reactivity` and `@vue/runtime-core` to `3.2.31`

### Deprecated

- The `supportLazy` is a no-op function, the `lazy` export is not used anymore

### Misc

- Improve bundle size by switching some external libraries, or replace them by internal utils.
- Update internal repo structure into multiple projects folders for specific test cases

## [1.0.0-alpha.30] - 2022-02-28

Deprecated

## [1.0.0-alpha.29] - 2022-01-18

### Fixed

- Don't set refs to undefined in component or element ref collections that stay in the DOM.

## [1.0.0-alpha.28] - 2021-12-09

### Added

- Add `propType.any`
- Fix `propType.object.defaultValue` to allow receiving function value

### Fixed

- Don't re-create ref components when previously created globally
- Fix `attr` source conversion
- Improve `bindMap` and other bindings after `bindTemplate` updates
- Fix some internal typing issues that were causing build error
- Check current HTML value before setting innerHTML
- Improve performance with global MutationObserver

### Changed

- Upgrade `vue/reactivity` and `vue/runtime-core` to `3.2.22`
- Improve types for prop `source` options
- Improve error reporting for invalid refs

### Misc

- Add example stories
- Update docs
- Exclude type test files in Jest
- Update Arrays for refs/elements to ReadonlyArray
- Change target for ESM builds to es6 to be more modern

## [1.0.0-alpha.27] - 2021-05-16

### Added

- Add validation on component bindings that try to set props that don't exist.
- Add an `ignoreGuard` option to all `ref` helpers to bypass the default child-component guard.
- Add support for passing multiple components to `refComponent` – e.g.
  `refComponent([Button, Link], { ref: 'some-button' })`.
- Make the `defaultValue` on props actually do something, setting the value when no other "error"
  case is triggered.

### Fixed

- Fix incorrect invalid binding warnings, showing logs in the console that were not correct.
- Prevent refs on collections to update when "inner" HTML updates, causing bindings to re-apply
  without cleanup.
- Apply `validation` (correctly) on all variations of how to pass props. Don't run validation on
  `undefined` values.

### Misc

- Fix small errors in docs
- Update `refs` API docs to be accurate, and add more examples
- Reorganize and add more Stories for testing
- Add more unit tests

## [1.0.0-alpha.26] - 2021-03-31

### Added

- Add `minimumItemsRequired` option to collection refs – e.g.
  `refCollection('item', { minimumItemsRequired: 3 })`.
- Support `null` in predicates for any type

## [1.0.0-alpha.25] - 2021-03-30

### Changed

- Refactor the propType generation and typing

  Drastically reducing the generated TS declarations (was over 96000 lines) to only 60 by using
  Generics.

  Also set a fixed order of setters in the chaining API, while still allowing omitting helpers in
  the middle.

  `propType.[type].[optional / defaultValue].[validate].[source]` `propType.func.[optional].[shape]`

### Misc

- Add unit tests for props
- Add type tests for props

## [1.0.0-alpha.24] - 2021-03-29

### Fixed

- Fix ordering of adding the propType source helper

## [1.0.0-alpha.23] - 2021-03-29

### Added

- Allow for optional source "attributes"

### Misc

- Fix doc typos

## [1.0.0-alpha.22] - 2021-03-29

### Added

- Add support for `source` in `propType` helper
- Add `text` and `html` sources

### Misc

- Fix all unit tests
- Add propType stories as tests and examples
- Add and update docs about props usage
- Remove template code, use `@muban/template` instead (internal change only)

## [1.0.0-alpha.21] - 2021-03-24

### Added

- Add `object` propType

### Misc

- Remove old transition prototype code

## [1.0.0-alpha.20] - 2021-03-24

### Changed

- Guard `ref` query selection to only select direct children. This will make sure that no refs in
  child components can be selected.

### Misc

- Remove old transition prototype code

## [1.0.0-alpha.19] - 2021-03-23

### Added

- `bindMap` now accepts an "`Array` of `refs`" in addition to a `collection`.
- [typing] Add and move template types

### Fixed

- [typing] Allow `ComponentFactory` to allow any component in "strict" mode by mapping any to `any`
  instead of `{}` in component props.

### Misc

- Add stories to showcase and test the bindMap use cases
- [typing] Fix all TS errors in example components after previous refactors

## [1.0.0-alpha.18] - 2021-03-19

### Fixed

- Fix provide/inject bugs by moving `Object.create(provides)` from `provide` to "component
  creation".

## [1.0.0-alpha.17] - 2021-03-18

### Added

- Allow `event` bindings on component `refs`

## [1.0.0-alpha.16] - 2021-03-17

### Added

- Add reactive `bindMap` implementation

### Removed

- Remove `renderChildTemplate`, wasn't doing what it should

## [1.0.0-alpha.15] - 2021-03-17

### Added

- Add `renderChildTemplate` util function

## [1.0.0-alpha.14] - 2021-03-16

### Added

- Add new `bindings`; `checked`, `html`, `style`, `text`, `textInput` and `value`.
- Allow `refs` to on the root element using its `data-ref`, helps when wrapping and unwrapping
  elements and those sometimes becoming the root element.

## [1.0.0-alpha.12] - 2020-12-29

### Fixed

- Re-export `supportLazy` in `index`.
- Use `globalThis` to support building and running in node.

## [1.0.0-alpha.11] - 2020-12-29

### Added

- Add new `bindings`; `hasFocus`, `enable/disable`, `visible/hidden` and `submit`.
- [types] Improve the types of refs/bindings

### Changed

- Introduced a "global" `App` using `createApp` as a starting point.

  This will "replace" the `mount` and `registerGlobalComponents`, and other things that were kind of
  global / settings.

- Change lifecycle hooks to mimic the Vue structure a bit more, and get rid of external eventEmitter
  dependency.

### Misc

- Updated the folder structure to match the almost final shape of the API.
- Add some unit tests, and include babel in those tests to get everything working again.
- Introduce "component instances" for `refs` to support devtools, keeping track of bindings and when
  they update.
- Add devtools support, highly inspired by the Vue Devtools.

## Older

Older versions are too much PoC to list here retro-actively.
