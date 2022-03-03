import { ref } from '../../..';
import { styleBinding } from './styleBinding';

describe('styleBinding', () => {
  it('should add only valid style attributes to the inline style of the element', () => {
    const myElement = document.createElement('div');

    styleBinding(myElement, {
      top: ref(undefined),
      left: ref(null),
      bottom: ref(false),
      right: ref('10px'),
    })();

    // Not using element.style here because that will return the full list of css properties
    // we need to test only inline css styles
    const styleEntries = myElement
      .getAttribute('style')!
      .split(';')
      .filter((property) => property.length > 0)
      .map((property) => [property.split(':')[0].trim(), property.split(':')[1].trim()]);

    const styleObject = Object.fromEntries(styleEntries);

    expect(styleObject.right).toBe('10px');
    expect(styleObject.top).toBe(undefined);
    expect(styleObject.left).toBe(undefined);
    expect(styleObject.bottom).toBe(undefined);
  });
});
