import dedent from 'ts-dedent';
import { ensureElementIsComponentChild } from './refDefinitions';

describe('ensureElementIsComponentChild', () => {
  it('should allow the root element', () => {
    const root = document.createElement('div');
    root.innerHTML = dedent`
      <div data-component="my-component">
        <p data-ref="element-string">element-string</p>
      </div>
    `;
    const parent = root.querySelector<HTMLElement>('[data-component="my-component"]')!;

    const result = ensureElementIsComponentChild(parent, parent);
    expect(result).toEqual(parent);
    expect(result).not.toBeNull();
  });
  it('should allow the first child', () => {
    const root = document.createElement('div');
    root.innerHTML = dedent`
      <div data-component="my-component">
        <p data-ref="element-string">element-string</p>
      </div>
    `;
    const parent = root.querySelector<HTMLElement>('[data-component="my-component"]')!;
    const element = root.querySelector<HTMLElement>('[data-ref="element-string"]')!;

    const result = ensureElementIsComponentChild(parent, element);
    expect(result).toEqual(element);
    expect(result).not.toBeNull();
  });
  it('should allow for another chile component', () => {
    const root = document.createElement('div');
    root.innerHTML = dedent`
      <div data-component="my-component">
        <p data-component="child-component">element-string</p>
      </div>
    `;
    const parent = root.querySelector<HTMLElement>('[data-component="my-component"]')!;
    const element = root.querySelector<HTMLElement>('[data-component="child-component"]')!;

    const result = ensureElementIsComponentChild(parent, element);
    expect(result).toEqual(element);
    expect(result).not.toBeNull();
  });
  it('should not allow an element inside another component', () => {
    const root = document.createElement('div');
    root.innerHTML = dedent`
      <div data-component="my-component">
        <div data-component="child-component">
          <p data-ref="element-string">element-string</p>
        </div>
      </div>
    `;
    const parent = root.querySelector<HTMLElement>('[data-component="my-component"]')!;
    const element = root.querySelector<HTMLElement>('[data-ref="element-string"]')!;

    const result = ensureElementIsComponentChild(parent, element);
    expect(result).toBeNull();
  });
});
