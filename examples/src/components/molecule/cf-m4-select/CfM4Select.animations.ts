import gsap from 'gsap';
import { selectExpandDuration, selectExpandEase } from './CfM4Select.config';

export const openSelectOptions = (optionsWrapper: HTMLElement): Promise<void> =>
  new Promise((resolve) => {
    {
      gsap.set(optionsWrapper, {
        height: 'auto',
      });

      // Then animate from 0
      gsap.from(optionsWrapper, {
        height: 0,
        duration: selectExpandDuration,
        ease: selectExpandEase,
        onComplete: resolve,
      });
    }
  });

export const closeSelectOptions = (optionsWrapper: HTMLElement): Promise<void> =>
  new Promise((resolve) => {
    gsap.to(optionsWrapper, {
      height: 0,
      duration: selectExpandDuration,
      ease: selectExpandEase,
      onComplete: resolve,
    });
  });
