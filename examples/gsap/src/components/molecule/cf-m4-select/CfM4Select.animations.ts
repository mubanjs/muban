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
        duration: selectExpandDuration,
        height: 0,
        ease: selectExpandEase,
        onComplete: resolve,
      });
    }
  });

export const closeSelectOptions = (optionsWrapper: HTMLElement): Promise<void> =>
  new Promise((resolve) => {
    gsap.to(optionsWrapper, {
      height: 0,
      duration: optionsWrapper.hasAttribute('style') ? selectExpandDuration : 0,
      ease: selectExpandEase,
      onComplete: resolve,
    });
  });
