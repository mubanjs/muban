import gsap from 'gsap';
import type { SplitText } from 'gsap/SplitText';
import { CustomEase } from 'gsap/CustomEase';

gsap.registerPlugin(CustomEase);

export enum SplitAnimationStart {
  LEFT = 'start',
  CENTER = 'center',
  RIGHT = 'end',
}

export function splitWordAnimation(split: SplitText): gsap.core.Timeline {
  const timeline = gsap.timeline();

  const staggerAmount = Math.min(0.8, split.words.length * 0.05);

  split.lines.forEach((line, index) => {
    timeline.fromTo(
      line.children,
      {
        y: 50,
        autoAlpha: 0,
      },
      {
        y: 0,
        autoAlpha: 1,
        clearProps: 'y,opacity,visibility',
        ease: CustomEase.create('VinnieInOut', 'M0,0 C0.2,0 0,1 1,1'),
        stagger: {
          from: SplitAnimationStart.LEFT,
          amount: staggerAmount,
        },
        duration: 0.8,
      },
      index * 0.1,
    );
  });

  return timeline;
}
