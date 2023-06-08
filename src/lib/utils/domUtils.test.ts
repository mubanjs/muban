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
    expect(parent).toHaveAttribute('data-component', 'my-component');
  });
  it('should recursively look for parent components only for elements inside the boundary', () => {
    const element = document.createElement('div');
    element.dataset.component = 'my-component';
    element.innerHTML = `
      <div data-component="some-wrapper">
        <button data-ref="toggle">Toggle Content</button>
        <div data-ref="toggle-content" ${wrapperBoundaryName}>
          <span data-ref="foo">label</span>
        </div>
      </div>
    `;

    const toggleRef = element.querySelector('[data-ref=toggle]')!;
    const toggleContentRef = element.querySelector('[data-ref=toggle-content]')!;
    const fooRef = element.querySelector('[data-ref=foo]')!;
    const toggleRefParent = getOwnerComponent(toggleRef);
    const toggleContentRefParent = getOwnerComponent(toggleContentRef);
    const fooRefParent = getOwnerComponent(fooRef);
    expect(toggleRefParent).not.toBeNull();
    expect(toggleContentRefParent).not.toBeNull();
    expect(fooRefParent).not.toBeNull();
    expect(toggleRefParent).toHaveAttribute('data-component', 'some-wrapper');
    expect(toggleContentRefParent).toHaveAttribute('data-component', 'some-wrapper');
    expect(fooRefParent).toHaveAttribute('data-component', 'my-component');
  });
});
