// /* eslint-disable @typescript-eslint/no-explicit-any */
// import type { TimelineMax } from 'gsap';
// // import AbstractTransitionController from 'transition-controller';
// // import type { IAbstractTransitionControllerOptions } from 'transition-controller/lib/interface/IAbstractTranstitionControllerOptions';
// import { onMounted, onUnmounted } from '../../src/lib/utils/lifecycle';
//
// type TransitionHooks = {
//   setupTransitionInTimeline?: (timeline: TimelineMax, parent: any, id: string) => void;
//   setupTransitionOutTimeline?: (timeline: TimelineMax, parent: any, id: string) => void;
//   setupLoopingAnimationTimeline?: (timeline: TimelineMax, parent: any, id: string) => void;
// };
//
// export const useTransitionController = (
//   refs: Record<string, any> | undefined,
//   hooks: TransitionHooks,
//   options?: IAbstractTransitionControllerOptions,
// ) => {
//   const transitionController = new (class MubanTransitionController<
//     T extends any = any
//   > extends AbstractTransitionController<T> {
//     protected getComponent(): T {
//       return refs as T;
//     }
//
//     protected setupTransitionInTimeline(...args: [TimelineMax, any, string]): void {
//       hooks?.setupTransitionInTimeline?.(...args);
//     }
//
//     protected setupTransitionOutTimeline(...args: [TimelineMax, any, string]): void {
//       hooks?.setupTransitionOutTimeline?.(...args);
//     }
//
//     protected setupLoopingAnimationTimeline(...args: [TimelineMax, any, string]): void {
//       hooks?.setupTransitionInTimeline?.(...args);
//     }
//   })(refs, options);
//
//   onMounted(() => {
//     transitionController.transitionIn();
//   });
//
//   onUnmounted(() => {
//     transitionController.transitionOut();
//   });
// };
