import gsap from 'gsap';
import { createContext } from '../inject';

type TransitionController = {
  getTimeline(): gsap.core.Timeline;
  transitionIn(): void;
};

export class TranistionContext {
  private readonly store: Array<{ element: HTMLElement; controller: TransitionController }> = [];
  public register(element: HTMLElement, controller: TransitionController) {
    this.store.push({ element, controller });
  }
  public getTimeline(element: HTMLElement) {
    return this.getController(element)?.getTimeline() || gsap.timeline();
  }
  public getController(element: HTMLElement) {
    return this.store.find((item) => item.element === element)?.controller;
  }
}
export const [provideTransitionContext, useTransitionContext] = createContext<
  TranistionContext | undefined
>('transitionContext');

export function useTransition(
  element: HTMLElement,
  {
    setupTransitionInTimeline,
  }: {
    setupTransitionInTimeline: (timeline: gsap.core.Timeline) => void;
  },
) {
  const transitionContext = useTransitionContext();
  const componentTimeline = gsap.timeline({ paused: true });

  const controller: TransitionController = {
    getTimeline() {
      const transitionTimeline = gsap.timeline();
      setupTransitionInTimeline(transitionTimeline);
      return transitionTimeline;
    },
    transitionIn() {
      componentTimeline.add(this.getTimeline()).play();
    },
  };

  transitionContext?.register(element, controller);

  return controller;
}
