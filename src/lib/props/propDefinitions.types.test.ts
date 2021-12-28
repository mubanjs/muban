/* eslint-disable @typescript-eslint/no-explicit-any,@typescript-eslint/ban-types,@typescript-eslint/no-unused-vars,@typescript-eslint/naming-convention */
import { defineComponent } from '../Component';
import type { ComponentFactory, IfAny } from '../Component.types';
import type { ComponentSetPropsParam } from '../refs/refDefinitions.types';
import { propType } from './propDefinitions';

// TODO: the below was an older implementation, but seems to not be needed anymore?
// The IsAny check makes sure that "any" component props result in "any" instead of {}
// This is used for generic component typing
// TODO: explain why {} is bad
import type { PropTypeDefinition, TypedProp, TypedProps } from './propDefinitions.types';

export type TypedPropsOld<T extends Record<string, PropTypeDefinition>> = IfAny<
  T,
  any,
  {
    [P in keyof T]: TypedProp<T[P]>;
  }
>;

// type X = typeof propType.string;
// type P = PropTypeDefinition<any>;
// type A = TypedProp<PropTypeDefinition<any>>;
// type B = ExtractType<PropTypeDefinition<any>>;

const Foo = defineComponent({
  name: 'foo',
  props: {
    foo: propType.string,
  },
  setup() {
    return [];
  },
});

function acceptAnyComponent(component: ComponentFactory) {
  return component;
}

acceptAnyComponent(Foo);

type A = TypedProps<any>;
type B = TypedPropsOld<any>;

type C = TypedProps<Record<string, PropTypeDefinition<any>>>;
type D = TypedProps<any>;
type E = TypedProps<{}>;

function createTest<P extends Record<string, PropTypeDefinition> = any>(options: { props?: P }) {
  return {
    setProps(props: TypedProps<P>) {
      // eslint-disable-next-line no-console
      console.log('nothing', options, props);
    },
  };
}
const x = createTest({
  props: {
    foo: propType.string,
  },
});
const y = createTest({});

type CC = ComponentSetPropsParam<typeof x>;
type DD = ComponentSetPropsParam<typeof y>;
