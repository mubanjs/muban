# Lifecycle

## current order

1. Render component template
2. Init component DOM element
    
    1. resolve props from sources
    2. resolve refs from config > DOM
    
        1. for elements/collections - query the DOM for the element(s)
        2. for component bindings - create child components (recursion at step 2 above)
        
    3. watch for mutation changes in DOM to update refs or create new components (step 2 above)
    4. make lifecycle registration active
    5. call setup function (return bindings)
    
        1. get access to props and refs
        2. firing of parent callback functions won't work at this point, they are undefined
        3. return binding definitions
        
    6. deactivate lifecycle registration
    7. apply bindings
        
        1. for elements/collections - apply DOM bindings
        2. for component bindings - call setProps for all defined props (incl passing callback
         functions)
        3. for template bindings:
        
            1. extract data (optionally)
            2. render template with currently active data
            
                * this will update the DOM, triggering step "iii"
                
            3. watch for new data, and re-do step "b"
             
    8. call mount lifecycle
    9. return component API (name, setProps, dispose)

## questions

- **Q:** When can we execute "initial" callback functions to the parent

  **A:** when setProps has been called, when applying the parent bindings, but its parent is not yet
    fully constructed
     
  **P:** The problem with the above, is that the component is constructed when only the HTML props
    are available, but not the parent props. They come in a bit later (same frame), but it means
    that the callback functions are not available yet in the setup function.


- **Q:** How do we deal with props that we want to set on change, but not initially?

  **A:** Find a way to get access to the props from the child component to correctly get the value in
    the parent component when setting up the binding.
     
  **P:** Props have 2 sources, the HTML and the parent component. For "data" props, the one from the
    HTML are always leading and more important, but only initially.  
    After initial setup, when interacting with the UI, things can change, and props might need to
    be updated. The problem with this, is that the binding setup is done just once, and it should
    already contain this prop binding, with an initial value, that might override the value from
    the HTML. So it's key to get value of the prop that you're trying to set correct with the
    initial value, and this initial value has to come from the child.

- **Q:** If we expose props from child to parent, should they be reactive?
  **A:** Probably set them based on initial HTML props, and update them if they are accessed
   later to reflect the correct value, but not make them reactive or update the HTML.
  **P:** We have a few options:
    1. Set them based on initial HTML props
    2. Update them as they are changed from the parent, but not reactive
    3. Make them fully reactive as well, so they can be "watched"
    4. As an addition to i or ii, also update the HTML
    5. As an addition, have the props being update whenever the HTML is changed later.
    
    So the minimum we need is option "i", to sync up the correct initial state from child to parent.
    In that scenario we would only use them to initialize our observables in the setup function.
    If they are used in any async code (watch, callbacks), they might be incorrect / stale, so this
    can never be used like that.
    
    To support updated props in async code, we would need to update the exposed props whenever
    the parent changes them. This used case is probably very seldom, since you could have already
    stored them locally in the setup function.
    
    Making props reactive might make things more complex:
    * It enables 2 ways on how to listen for changes (through callbacks, and watching props)
    * It could result in infinite recursion (since bindings can set props, they would trigger the
      watch, which could update the bindings again).
    
    So it's probably not a good idea to enable this.
    
    Then we have 2 related additional options, if we should update the HTML to reflect the
    internal state of the component, and if we should update the props when any html (through
    other means) is updated. Doing this could also result in recursion.
    But more importantly, it would "move" the logic to keep using and mutating props in the
    component, which is probably not good practice. So we'll ignore this for now.

- **Q:** Do we need an "adopted" lifecycle hook? Would it trigger on Parent or Root adoption? Do we
    need both? Should we "delay" the "mount" lifecycle hook? Of have "created", "mounted" and
    "adopted"?
     
  **A:** Not sure, if we want to be extensive, we would have; setup(1), created(2), mounted(3) and
    adopted(4). If we want to be minimal, we would have; setup(1) and mounted(4).
     
  **P:** We have 3 "moment" in the creation process of a component. Since components are created as
    part the parent creation, it's always "completed" earlier than the parent. This means we
    have the moment where a component itself is created, we have the moment where its parent
    is created as well (and we receive their props, e.g. callbacks), and we have the moment the
    whole app is created (up to the root component).
    In most cases, we only care about the component in isolation, so we can use the first one.
    In some cases, we might need something from the parent (e.g. calling a function passed
    through the props), which we can only do when the parent has been fully created.
    And in other cases, we need access to the root, global state, etc to be set up correctly.
    
    Timing wise, these should all happen in the same frame, since the creation process is all
    synchronous (it's just that other stuff happens in between).  We could just chose the have 1
    hook (when the root has been created), and use that for everything.
    
    We already have the setup function itself, so the current "mounted" has not much additional
    value in its current state. Only difference is that bindings are applied,
    so manual DOM mutations will update correctly. It could be useful if we ever want to delay
    child component creation to the "applyBindings" phase, and only have those instances
    accessible in the mount hook.
        
