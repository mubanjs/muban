# Hooks

::: warning
Note that these hooks can only be registered in the `setup` function within `defineComponent`, or
any other hook that is called from there. These hooks will "bind" to the component that's in the
current sync "execution stack".
:::

## onMount

```ts
declare function onMount(fn: () => void): void;
```
```ts
defineComponent({
  name: 'my-component',
  setup() {
    onMount(() => {
      // do stuff when the component is mounted
    })
  }
})
````

## onUnmount

```ts
declare function onUnmount(fn: () => void): void;
```
```ts
defineComponent({
  name: 'my-component',
  setup() {
    onUnmount(() => {
      // do cleanup stuff right before the component is unmounted
    })
  }
})
````
