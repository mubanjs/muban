// TODO: move this to the "demo" area, where we _could_ install gsap in some way

export const openSelectOptions = (optionsWrapper: HTMLElement): Promise<void> =>
  new Promise((resolve) => {
    // eslint-disable-next-line no-param-reassign
    optionsWrapper.style.height = 'auto';
    resolve();

    // gsap.set(optionsWrapper, {
    //   height: 'auto',
    // });
    //
    // // Then animate from 0
    // gsap.from(optionsWrapper, {
    //   duration: selectExpandDuration,
    //   height: 0,
    //   ease: selectExpandEase,
    //   onComplete: resolve,
    // });
  });

export const closeSelectOptions = (optionsWrapper: HTMLElement): Promise<void> =>
  new Promise((resolve) => {
    // eslint-disable-next-line no-param-reassign
    optionsWrapper.style.height = '0';
    resolve();
    // gsap.to(optionsWrapper, {
    //   height: 0,
    //   duration: optionsWrapper.hasAttribute('style') ? selectExpandDuration : 0,
    //   ease: selectExpandEase,
    //   onComplete: resolve,
    // });
  });
