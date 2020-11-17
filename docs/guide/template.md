# Template

::: warning
The current template implementation is subject to change. `lit-html` is very light-weight, and has
some nice features, but also has stuff that's unused, and not quite flexible enough in all
 situations. 
:::

Templates in Muban mostly serves a role during development, since the whole reason Muban exists is
to make components for HTML rendered on the server. But to help local development to become easier,
and not require waiting on complex server integrations before development can start, it plays an
important role in the daily use of Muban.

The two small use cases it has for production are:

1. For dynamic templates that have to be rendered from JavaScript, after receiving JSON data from
   an API, or complex local interaction is needed.
   
2. Although not built or marketed as such, with Muban it's possible to statically generate pages
   based on mock data and its templates. This is mostly used to generate static preview builds to
   showcase full pages for testing and sign-of, but can be used in production with some
   additional care. 

## TypeScript

There are a lot of template languages in existence, and most of them have 2 things in common;

1. It's a text-based format, with its own syntax for variables, control flow, inclusion of child
   templates, passing down context, etc.
2. There is no type checking between the data you pass when rendering the template (or including
   child templates), and how you use that data inside your template itself. It doesn't help you
   while writing your templates, and only warns you when running them with the wrong data.
   
The purpose of adding TypeScript in the equation of templates, is to offer a solution to both
problems described above. React has proven that writing your templates in a language familiar to
everyone works just fine, and a vast amount of people even prefer it. And if your templates are
just functions that receive props, and output the resulting template based on the passed data,
you have support of typing within your template, and when passing data from the outside. 

What's used inside the template functions is less important, and could even be as simple as
string concatenation. Whatever solution is chosen, keep in mind that the only purpose is to render
out an HTML string to the DOM. There is no interactivity or event binding in place. The purpose
is to simulate HTML that is rendered on the server, which is also just plain text.

The bare-bones version of any template would look like this:

```ts
type MyTemplateProps = {
  products: Array<MyProductTemplateProps>;
};

function myTemplate({ products }: MyTemplateProps) {
  // return ...
} 
```

## lit-html

Currently, the chosen template language is [lit-html](https://lit-html.polymer-project.org/guide/getting-started).
It makes use of tagged template strings, is very light-weight, and has some helpers for attribute
slots that could be useful.

A typical template would looks like this:

```ts
type AccordionSlideProps = {
  heading: string;
  content: string;
  expanded?: boolean;
};

export function accordionSlide({ heading, content, expanded }: AccordionSlideProps, ref?: string) {
  return html`<div
    data-component=${AccordionSlide.displayName}
    data-ref=${ifDefined(ref)}
    data-expanded=${expanded}
  >
    <div data-ref="slide-wrapper" class=${classMap({ expanded: !!expanded })}>
      <h4 data-ref="slide-heading">${heading}</h4>
      <p data-ref="slide-content">${content}</p>
    </div>
  </div>`;
}


export type AccordionProps = {
  slides: Array<AccordionSlideProps>;
  activeIndex?: number;
};

export function accordion({ slides, activeIndex }: AccordionProps) {
  return html`<div data-component=${Accordion.displayName}>
    ${slides.map(
      (slide, index) => accordionSlide({ ...slide, expanded: index === activeIndex }, 'accordion-slide'),
    )}
  </div>`;
}
```

Let's go step by step and see how we would write a template.

#### 1. Starting with the props and template function

If we know what our template should render, we can already define the template function and its
props, so we can start rendering it to see how it looks.


```ts
type AccordionSlideProps = {
  heading: string;
  content: string;
  expanded?: boolean;
};

export function accordionSlide({ heading, content, expanded }: AccordionSlideProps) {
  return html`<div></div>`;
}
```

A template should return a lit-html `TemplatResult` (or a `string`). Using the `html` tagged
template string will do exactly that. 

```ts {2}
export function accordionSlide({ heading, content, expanded }: AccordionSlideProps) {
  return html`<div></div>`;
}
```

#### 2. Add the template HTML with some data filled in

Next we can just create our HTML, and start adding

```ts {3-6}
export function accordionSlide({ heading, content, expanded }: AccordionSlideProps) {
  return html`<div>
    <div>
      <h4>${heading}</h4>
      <p>${content}</p>
    </div>
  </div>`;
}
```

Notice that we're just using `${}` placeholders to render our variables, just like we normally do
in your template strings.

#### 3. Add the data-component attribute

If we know our template is going to be for a component, we should add the `data-component`
attribute.

```ts {2}
export function accordionSlide({ heading, content, expanded }: AccordionSlideProps) {
  return html`<div data-component=${AccordionSlide.displayName}>
    <div>
      <h4>${heading}</h4>
      <p>${content}</p>
    </div>
  </div>`;
}
```

This is just a string, but if we already have our TS component, we can just reference it from
there, so we always know they are in sync.

#### 4. Add other data

We still have to manage how our `expanded` property should behave. Let's add it as a css class on
the container div, and as a `data-` attribute on the component.

```ts {4,6}
export function accordionSlide({ heading, content, expanded }: AccordionSlideProps) {
  return html`<div
    data-component=${AccordionSlide.displayName}
    data-expanded=${expanded}
  >
    <div class=${classMap({ expanded: !!expanded })}>
      <h4>${heading}</h4>
      <p>${content}</p>
    </div>
  </div>`;
}
```

By setting the `data-expanded` attribute, our TS component can pull it in as property to set it's
initial state correctly.

For setting the `class` attribute, we can use the `classMap` utility from lit-html, and applies
any classes which value is truthy.

::: warning Component state
If the component should update the visual representation after interaction, and from the server
it can be rendered in either of those options, the rendered HTML should always make sure both the
visual representation is correctly rendered, along with providing the state in a `data-` attribute.

The component should read that state through the props, and set up the same bindings to reflect
that visual representation, so both are in sync.
:::

#### 5. Define your refs

After that you should know what parts of your HTML your component is interested in updating
through the bindings. Those elements should add a `data-ref` attribute with a semi-unique value,
so your component can query those elements.

```ts {6-8}
export function accordionSlide({ heading, content, expanded }: AccordionSlideProps) {
  return html`<div
    data-component=${AccordionSlide.displayName}
    data-expanded=${expanded}
  >
    <div data-ref="slide-wrapper" class=${classMap({ expanded: !!expanded })}>
      <h4 data-ref="slide-heading">${heading}</h4>
      <p data-ref="slide-content">${content}</p>
    </div>
  </div>`;
}
```

The value of the `data-ref` should be unique within your component (tree). Some things to keep
in mind about those refs:
* When using `refElement` to select refs, it uses `querySelector` to pick the first matching
  element.
* When using `refCollection`, it uses `querySelectorAll` to select al matching refs it finds.
* When using `refComponent` or `refComponents`, and passing the `ref` value, the same behaviour
  as above is applied. When not passing a `ref`, it uses the `data-component` attribute, and the
  same behaviour applies.

::: tip data-ref
Rather than selecting arbitrary css classnames that can change over time, or abuse js-foo
classnames that are only used to query from JS, we use dedicated `data-ref` attributes to make
the intent of use fully transparent.
:::

#### 6. Define your own component's ref

When your component template is rendered inside other component templates, it might want to
target this component as part of a collection or as a specific single element. To allow this, we
must also accept a `ref` parameter in our template function, and render it in our root element.
 
 ```ts {1,4}
export function accordionSlide({ heading, content, expanded }: AccordionSlideProps, ref?: string) {
  return html`<div
    data-component=${AccordionSlide.displayName}
    data-ref=${ifDefined(ref)}
    data-expanded=${expanded}
  >
    <div data-ref="slide-wrapper" class=${classMap({ expanded: !!expanded })}>
      <h4 data-ref="slide-heading">${heading}</h4>
      <p data-ref="slide-content">${content}</p>
    </div>
  </div>`;
}
 ```

The `ifDefined` helper from `lit-html` makes sure to only render the attribute when it has an
actual value, which is useful for when you render this template without passing a ref.


#### 7. Doing the same for our parent component

First we specify our template props, and rendering the outer element, filling the `data-component`
attribute with the component's name.

```ts {2}
export type AccordionProps = {
  slides: Array<AccordionSlideProps>;
  activeIndex?: number;
};

export function accordion({ slides, activeIndex }: AccordionProps) {
  return html`<div data-component=${Accordion.displayName}></div>`;
}
```

Note that we're composing our prop types by referencing `AccordionSlideProps`. We can do this
because we're actually going to render our child template here, and passing that data along.

```ts {3-5}
export function accordion({ slides, activeIndex }: AccordionProps) {
  return html`<div data-component=${Accordion.displayName}>
    ${slides.map(
      (slide, index) => accordionSlide({ ...slide, expanded: index === activeIndex }, 'accordion-slide'),
    )}
  </div>`;
}
```

We're just using the `${}` tokens to inline our child templates. We map over our slides Array,
invoke our child template function, and pass our data for each slide as props. Additionally, we
pass the `ref` we want as the 2nd argument.
