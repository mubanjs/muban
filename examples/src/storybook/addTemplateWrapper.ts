import type { ComponentTemplate } from '../../../src/lib/Component.types';

/**
 * Helper util to wrap you Storybook templates with some custom HTML.
 *
 * Example usage
 * ```ts
 * // 1. Create a custom wrapper function that will wrap you template.
 * const customTemplateWrapper = (children: () => void) =>
 *   html`<div style="background: red">${children()}</div>`;
 *
 * // 2. Wrap the template with the `addTemplateWrapper` function
 * export const Default: Story<ComponentTemplateProps> = () => ({
 *   template: addTemplateWrapper(customTemplateWrapper, componentTemplate),
 * });
 * ```
 *
 * @param wrapper - The wrapper that will be surrounding your template.
 * @param template - The template that you want to have wrapped.
 */
export const addTemplateWrapper = <T extends Record<string, unknown>>(
  wrapper: (children: () => void) => string,
  template: ComponentTemplate<T>,
): ((props: T) => string) => (props: T) => wrapper(() => template(props));
