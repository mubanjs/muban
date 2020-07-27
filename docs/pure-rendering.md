# Pure rendering

When dealing with state and DOM updates within components, there are to main methods of approaching this;

1. Re-render everything as a pure function, and compare the outcome to detect what DOM updates are needed.
   This is how React approaches it.

2. Make your state reactive, and only apply specific updates when that specific data changes.
   This is how Vue/Mobx/Knockout and others approach it.
   
The advantage of the reactive approach is that the main thing we do is _changing_ the dom (instead of creating it), so
what we're looking for is when changes happen - which is exactly what reactivity is made for.

However, it can become tricky when you have to pass reactive values around - you always have to think; if I do this,
will it lose its reactivity? It can create quite some overhead, both mentally and in code.

This is where pure render function can make things simpler; with a given start state (the HTML that exists), we run our
component function. The output it produces are the DOM changes that should be made. If we need to react on user
interactions through events, we change our internal state. That change causes a re-execution of our function, resulting
in new or updated Dom changes as output. Or, it can undo a previous change that was done.

After each execution, we can diff the previous list of change instructions to the current one, and the difference in
that can be applied to the DOM.

## Register "state changes"

Let's see how that concept could work, using react hooks for the internal data structure. Let's assume we get our props
and refs from the outside.

```js
function Item(props, refs) {
  // props.count would be our starting count, grabbed from the attributes
  const [count, setCount] = useState(props.count ?? 0);
  
  // use a toggle hook to toggle between active and not active
  const [isActive, toggleActive] = useToggle(props.isActive ?? false);

  // when clicked on a button, we update our internal count
  // this will cause our function to re-execute
  useEvent(refs.button, 'click', () => {
    setCount(count + 1);
  });
  
  // listen for our toggle change
  useEvent(refs.toggle, 'click', () => {
    // switch the toggle, which will cause this function to re-render.
    toggleActive();
  });
  // we could probably reguster useCallbacks here, and add the click binding in the below list, but that feels like
  // we're duplicating things, without adding much value  

  // this could register all our bindings that we ever want to change for out component
  // basically, it's just a small part of a template engine, represending only the parts that we want to change 
  return [
    registerState(refs.button, 'text', `count: ${count}`),
    registerState(refs.status, 'css', {'is-active': isActive}),
  ];
}
```

The "DOM changes" that were mentioned earlier don't really work well, since you never know when to return what.
You don't want to detect changes internally and register changes from there. You just want to output the state as you
know it, and let the framework do the rest. That's why each component pass should always return the same list of
"potential" changes. On initial execution, the output of the render should exactly match with the current DOM.

Only when starting to react to changes, will our list start to contain actual changes.

## Using JSX

Instead of returning a list of state "changes", what if we could return JSX, just like in react? But instead of
rendering the full Component which already exists in HTML, let's just render the part we're interested in. The only
rule is that we can only return nodes that have a unique `ref` assigned to them, so they can be matched up with the
existing HTML.

```jsx
function Item(props, refs) {
  const [count, setCount] = useState(props.count ?? 0);
  const [isActive, toggleActive] = useToggle(props.isActive ?? false);

  return (
   <div ref={refs.status} className={{'is-active': isActive}}>
      <button ref={refs.toggle} click={toggleActive} />
      <button ref={refs.button} text={`count: ${count}`} click={() => setCount(count + 1)} />
    </div>
  );
}
```

Since it's JSX, we could use nesting to mimic our actual DOM, making it easier to locate where certain elements are.
Most likely we won't even use that information when registering the change-list and do the diffing, but we could apply
some validation and warn if it doesn't match up.

## Appending new HTML

The only thing we can't do yet, is introduce new elements, or remove any existing ones.

Adding new elements could be done by a special node that can inject new JSX into an existing container:

```jsx
function Item(props, refs) {
  return (
    <>
      <div ref={refs.container2}>
        {/* append the content within here at the bottom, which is the default behaviour */}
        <Append location="bottom">
          <input type="text" placeholder="your value here" />
        </Append>
      </div>
      <div ref={refs.container1}>
        {/* or append at the top */}
        <Append location="top">
          <input type="text" placeholder="your value here" />
        </Append>
      </div>
      <div ref={refs.container2}>
        {/* or below an existing ref, or above, or at an index, etc */}
        <Append below={refs.item}>
          <input type="text" placeholder="your value here" />
        </Append>
      </div>
    </>
  )
}
```

The tricky part of the above, is that we are communicating mutations, not state. We don't want to execute the mutation
on each render, but just once if it's there. And on a next render, we might conditionally hide the `<Append>` node,
which indicates that it should be removed again.

Maybe, instead of calling it `Append`, we should treat it as an `exact` slot. A piece in the HTML we only control
from our component, just like actual react. We just need to make sure to specify that exact location. Which could be
either replacing an existing DOM item (which is there as placeholder), rendering inside it (if it was empty), or at a
specific position in an existing NodeList. That might actually work.

That "portal" that we register, could actually be managed by (p)react itself if we could allow for importing existing
components in here. The only downside is that the hooks are not compatible between muban and (p)react components.

### Removal and conditional rendering

The removal part is a bit trickier. Removal could ally to complete elements (which is irreversible), or attributes on
existing HTML elements.

We could set up a rule that whatever we want to remove, should have existind before, so it can be picked up by our
diffing algorithm. For complete elements, that would just mean the ref. For attributes, it should be the attribute with
its value the way it is rendered in the HTML. Then, whenever we conditionally _not_ render that part, we know we must
remove it. And when rendering it again later, we can add it again (except for DOM nodes, unless we choose to keep them
in memory, but just detached?).

If we won't revert DOM removal, we'll have to throw errors on any nested "changes" that are returned after that moment,
which should be fine.

#### Merging attribute values

In some cases, most notable CSS classes, multiple values can exist in the attribute. Some values might exist in the
original HTML, while we want to only conditionally add additional ones. These types of attributes should have the
original and "managed" values merged in the end result. It could even be the case that those attributes are all
managed by the [DOMTokenList](https://developer.mozilla.org/en-US/docs/Web/API/DOMTokenList) API, which should make
this relatively straightforward.


## TBC

Even though the developer interface of such pure components are quite simple, there is more to be explored around the
JSX, diffing and DOM mutation layer. And of course, the "portal" feature to add and manage new HTML into the dom.