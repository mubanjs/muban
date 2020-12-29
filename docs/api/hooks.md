# Hooks

::: warning
Note that these hooks can only be registered in the `setup` function within `defineComponent`, or
any other hook that is called from there. These hooks will "bind" to the component that's in the
current sync "execution stack".
:::

## onMount

```ts
declare function onMounted(fn: () => void): void;
```
```ts
defineComponent({
  name: 'my-component',
  setup() {
    onMounted(() => {
      // do stuff when the component is mounted
    })
  }
})
````

## onUnmount

```ts
declare function onUnmounted(fn: () => void): void;
```
```ts
defineComponent({
  name: 'my-component',
  setup() {
    onUnmounted(() => {
      // do cleanup stuff right before the component is unmounted
    })
  }
})
````
