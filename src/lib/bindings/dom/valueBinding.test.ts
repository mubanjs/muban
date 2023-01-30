import { bind, computed, defineComponent, propType } from '../../..';

describe('styleBinding', () => {
  it('should apply the binding', () => {
    const myInput = document.createElement('input');
    myInput.setAttribute('data-component', 'my-input');
    myInput.setAttribute('value', '123456');
    document.body.appendChild(myInput);
    console.error = jest.fn();

    const MyComponent = defineComponent({
      name: 'my-input',
      props: {
        value: propType.number.source({ type: 'attr' }),
      },
      setup({ refs, props }) {
        return [
          bind(refs.self, {
            value: computed(() => props.value),
          }),
        ];
      },
    })(myInput);

    expect(MyComponent.props.value).toBe(123456);
    expect(myInput.value).toBe('123456');
    expect(console.error).not.toHaveBeenCalled();
  });
});
