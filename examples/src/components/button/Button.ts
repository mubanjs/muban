import { html } from 'lit-html';
import { ifDefined } from 'lit-html/directives/if-defined';

type TemplateProps = {
  label: string;
};

export const button = ({ label }: TemplateProps, ref?: string) => {
  return html`<button data-component="button" data-ref=${ifDefined(ref)} class="btn btn-primary">
    ${label}
  </button>`;
};
