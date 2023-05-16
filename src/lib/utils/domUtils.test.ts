import { recursiveParentComponentLookup, wrapperBoundaryName } from './domUtils';

describe('recursiveParentComponentLookup', () => {
  it('should recursively look for parent components', () => {
    const element = document.createElement('div');
    element.dataset.component = 'my-component';
    element.innerHTML = `
      <div data-component="some-wrapper" ${wrapperBoundaryName}>
        <div data-component="some-wrapper-2" ${wrapperBoundaryName}>
          <div data-component="some-wrapper-3" ${wrapperBoundaryName}>
            <span data-ref="foo">label</span>
          </div>
        </div>
      </div>
    `;
    const ref = element.querySelector('[data-ref=foo]')!;
    const parent = recursiveParentComponentLookup(ref);
    expect(parent).not.toBeNull();
    expect(parent?.getAttribute('data-component')).toBe('my-component');
  });
});
