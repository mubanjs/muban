// /* eslint-disable @typescript-eslint/no-explicit-any */
// import { TNG } from 'tng-hooks';
// import {
//   ComponentFactory,
//   ComponentReturnValue,
//   DefineComponentOptionsReact,
//   getProps,
//   getRefs,
// } from './Component';
// import type { Binding } from './JSX.Vue';
// // TODO: not sure how much vue-specific stuff gets included in the bundle by this
//
// const applyBindings = (bindings: Array<Binding>) => {
//   bindings.forEach((b) => {
//     console.log('binding', b);
//   });
// };
//
// export const defineComponent = <P extends Record<string, any>, R extends Record<string, any>>(
//   options: DefineComponentOptionsReact<P, R>,
// ): ComponentFactory<P> => {
//   const fn: ComponentReturnValue<P> = (element) => {
//     const resolvedProps = getProps(options.props, element);
//     const resolvedRefs = getRefs(options.refs, element);
//
//     const render = TNG(options.render);
//
//     const bindings = render(resolvedProps, resolvedRefs, { element });
//
//     applyBindings(bindings);
//
//     return {
//       name: options.name,
//       setProps(props) {
//         console.log('new props', props);
//       },
//       dispose() {
//         console.log('dispose');
//       },
//     };
//   };
//   (fn as ComponentFactory<P>).displayName = options.name;
//   return fn as ComponentFactory<P>;
// };
