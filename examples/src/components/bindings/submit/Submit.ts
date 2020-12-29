import { defineComponent, bind } from '../../../../../src';

export const Submit = defineComponent({
  name: 'submit',
  refs: {
    form: 'user-form',
  },
  setup({ refs }) {
    return [
      bind(refs.form, {
        submit: () => {
          console.log('call submit');
        },
      }),
    ];
  },
});
