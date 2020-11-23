import { html } from '../../../../src/lib/utils/template/mhtml';

type TemplateProps = {
  label: string;
};

export const button = ({ label }: TemplateProps, ref?: string) => {
  return html`<button data-component="button" data-ref=${ref} class="btn btn-primary">
    ${label}
  </button>`;
};
