import { TemplateResult, render as renderTemplate } from 'lit-html';
import type { ComponentFactory } from '../Component.types';

export function mount<P extends Record<string, unknown>>(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  component: ComponentFactory<any>,
  container: HTMLElement,
  template?: (props?: P) => TemplateResult | Array<TemplateResult>,
  data?: P,
): void {
  if (template) {
    const templateResult = template(data);
    renderTemplate(templateResult, container);
  }

  const rootElement =
    container.dataset['data-component'] === component.displayName
      ? container
      : container.querySelector<HTMLElement>(`[data-component="${component.displayName}"]`);

  if (!rootElement) {
    console.error(
      `No element found with "data-component" set to "${component.displayName}", unable to render the component.`,
    );
    return;
  }

  component(rootElement);
}
