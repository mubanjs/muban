# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.0.0-alpha.27] - 2021-05-16

### Added
- Add validation on component bindings that try to set props that don't exist.
- Add an `ignoreGuard` option to all `ref` helpers to bypass the default child-component guard.
- Add support for passing multiple components to `refComponent` –
  e.g. `refComponent([Button, Link], { ref: 'some-button' })`.
- Make the `defaultValue` on props actually do something, setting the value when no other 
  "error" case is triggered.

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
- Add `minimumItemsRequired` option to collection refs –
  e.g. `refCollection('item', { minimumItemsRequired: 3 })`.
- Support `null` in predicates for any type

## [1.0.0-alpha.25] - 2021-03-30

### Changed

- Refactor the propType generation and typing

  Drastically reducing the generated TS declarations (was over 96000 lines)
  to only 60 by using Generics.

  Also set a fixed order of setters in the chaining API, while still allowing
  omitting helpers in the middle.

  `propType.[type].[optional / defaultValue].[validate].[source]`
  `propType.func.[optional].[shape]`

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

- Guard `ref` query selection to only select direct children. This will make sure that no refs 
  in child components can be selected.

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
  
  This will "replace" the `mount` and `registerGlobalComponents`, and other things
  that were kind of global / settings.

- Change lifecycle hooks to mimic the Vue structure a bit more, and get rid of external
  eventEmitter dependency.

### Misc

- Updated the folder structure to match the almost final shape of the API.
- Add some unit tests, and include babel in those tests to get everything working again.
- Introduce "component instances" for `refs` to support devtools, keeping track of bindings and 
  when they update.
- Add devtools support, highly inspired by the Vue Devtools.

## Older

Older versions are too much PoC to list here retro-actively.
