import { getOwnerComponent, wrapperBoundaryName } from './domUtils';

describe('getOwnerComponent', () => {
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
    const parent = getOwnerComponent(ref);
    expect(parent).not.toBeNull();
    expect(parent?.getAttribute('data-component')).toBe('my-component');
  });
  it('should recursively look for parent components and stop if there is a wrapper component without the boundary', () => {
    const element = document.createElement('div');
    element.dataset.component = 'my-component';
    element.innerHTML = `
      <div data-component="some-wrapper">
        <button data-ref="toggle">Toggle Content</button>
        <div data-ref="toggle-content" data-wrapper-boundary>
          <span data-ref="foo">label</span>
        </div>
      </div>
    `;
    const fooRef = element.querySelector('[data-ref=foo]')!;
    const toggleRef = element.querySelector('[data-ref=foo]')!;
    const fooRefParent = getOwnerComponent(fooRef);
    const toggleRefParent = getOwnerComponent(toggleRef);
    expect(fooRefParent).not.toBeNull();
    expect(toggleRefParent).not.toBeNull();
    expect(fooRefParent?.getAttribute('data-component')).toBe('some-wrapper');
    expect(toggleRefParent?.getAttribute('data-component')).toBe('some-wrapper');
  });
});
