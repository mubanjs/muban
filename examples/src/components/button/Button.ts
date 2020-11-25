import { html } from '../../../../src/lib/utils/template/mhtml';

export type ButtonProps = {
  label: string;
};

export const button = ({ label }: ButtonProps, ref?: string) => {
  return html`<button data-component="button" data-ref=${ref} class="btn btn-primary">
    ${label}
  </button>`;
};

export const meta = {
  template: button,
};
