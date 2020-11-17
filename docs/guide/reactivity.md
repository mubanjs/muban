# Reactivity

Instead of updating the DOM by hand after manually adding event listeners to manually queried
elements, Muban makes used of the [@vue/reactivity]() package to - with the help of some additional
utils and binding setup - create a single data flow from user input to DOM mutations, that take
the component state as the focus.

Good articles to read are:
* [https://v3.vuejs.org/guide/composition-api-introduction.html](https://v3.vuejs.org/guide/composition-api-introduction.html)
* [https://composition-api.vuejs.org/api.html](https://composition-api.vuejs.org/api.html)

It would also help to point out similarities and differences in how reactivity is used between Vue
and Muban, since other parts of the component setup are a bit different.

#### Similarities

* Both Vue and Muban use a `setup` function to manage component state.

* Component state is managed through `ref`, `reactive` and `computed`

* with the help of `watch` and `watch` effect (from the `@vue/runtime-core` package) you can react
  to changes in the state, and trigger side-effects
  
* Both have lifecycle "hooks" (e.g. `onMount`) that can be used in the `setup` function.

* "hooks" or "compositions" are separate functions with reusable code that can be invoked in the
`setup` function or other "hooks", and can make use both the reactive state and lifecycle hooks.

* Incoming props are "reactive", so they can be used in bindings or be watched, resulting in
 targeted DOM updates only to those affected elements.

* State is used to define how the DOM should be displayed (although the methods are different).

* Passing down reactive data between hooks or templates/bindings has the same caveats with
  destructuring and wrapping things in refs.

#### Differences

* **Vue** creates all elements in the template/JSX, while **Muban** only changes certain elements
  with bindings.
 
* In **Vue** and **React**, because they render everything, the data/state flows from top to
  bottom. Your props always come from the parent.
  
  In **Muban** the rendered HTML is your initial source of truth. Similar-ish to an SSR setup,
  the components need to "re-hydrate" their initial state based on the rendered HTML.
  This initial state is placed on the elements itself, being passed to / queried from (child)
  components directly. Which means that most initial data flows bottom-up from child to parent
  components. 

* In **Vue** and **React**, a `ref` is a boxed primitive you can assign directly to HTML tags with
  the `ref=` attribute.
  
  In **Muban** you also have the `data-ref=` attribute, and have the same `ref` in your state, but
  they are not linked up. So the concept is the same, but the technical solution is slightly
  different. In Muban you define your refs in the component definition (that will query your
  `data-ref` elements), and they become "ref items" that can be used in bindings.
