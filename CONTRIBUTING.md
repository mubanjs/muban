# Welcome to the Muban contributing guide

Thank you for investing your time in contributing to our project!


# Development

There are multiple areas in this project that can benefit from your help:

### Core development of the library

This is the most involved part, and requires extensive knowledge on how muban works internally.

Unfortunately there is currently no documentation that explains the architecture, so to get this 
knowledge it requires hands-on experience and some personal guidance.

The Github Issue list has a `good first issue` tag for issues that are a bit easier to pick up. 
Starting with those should give you a nice way into the project.

### Writing "extensions"

Muban doesn't really have extensions, but there are parts of the library that live more on the 
"surface", and are easier to pick up.

Examples of this are the `bindings` and the `property sources`.

We also have `hooks`, but besides the lifecycle hooks, other hooks are not part of the core 
library, and should live in user-land. We do have
[@muban/hooks](https://github.com/mubanjs/muban-hooks) where we collect often-used hooks that 
benefit most developers and projects.

And there are other parts of the ecosystem that could use support, like:
* [@muban/storybook](https://github.com/mubanjs/muban-storybook)
* [@muban/template](https://github.com/mubanjs/muban-template)

### Documentation

The muban docs are an important piece of information that allows developers to actually use this 
library. It contains a bit of the why and the how, and is written with both guides and API specs.

Down the road it should contain guides about other libraries in the ecosystem, and cover topipcs 
like testing, performance, conventions, etc.

If you feel the docs are wrong or missing some information or clarity, please create a ticket, 
or try to improve them yourself.

### Examples

Having examples of how to do solve certain problems is very useful for new developers. These 
could be inside this repository (most likely the `demo/examples` folder), but could also be 
links to codesandbox.

### Test coverage

If you're a big fan of testing, but don't know the library yet, you can still be very useful in 
adding tests to the areas of the library that don't have them yet.

This could either be unit tests with `jest`, dom tests of Stories using `testing-library`, or 
Stories with interactive `play` functions that contain their own tests.

### Tickets

If you find a bug, have a new idea, or just want to let us know if something doesn't work well 
or could be improved; please don't hesitate to create tickets!

## Repo Layout

### Root project

The root of the repo is the core library.

* `src` – the project source
* `docs` – the public documentation 

#### Commands

Check the `package.json` for all scripts to run. The important ones are:

```shell
# Run a "publish" build of esm/cjs/types
npm run build

# Runs the esm build in watch mode, to allow working alongside in
# some of the other projects in this repo 
npm run dev 

# Type checking
npm run check-types

# Linting
npm run lint

# Unit testing
npm run test
npm run test --watch

# docs:dev
Run the docs locally
```

### Storybook testing

The `test-storybook` folder contains a child project that contains stories to test the main 
functionality.

Even though a most of the library has unit tests, seeing certain functionality in action using 
full components with options to debug things helps a lot.

#### Commands

Before running storybook, make sure you run `npm run dev` in the root project.

```shell
# Run storybook
npm run storybook


# Type checking
npm run check-types
```

## Demo projects

The `demo` folder contains multiple subprojects to test different kind of things related to the 
library.

* `examples` – some more flushed out components
* `library-size` – build the library using webpack, and inspect the file size of itself and its 
  dependencies.
* `storybook` – test different types of muban stories / types in Storybook
* `tests` – isolated tests
