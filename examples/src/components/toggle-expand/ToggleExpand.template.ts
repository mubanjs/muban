import { htmlSync as html } from 'lit-ntml';

type TemplateProps = {
  isExpanded?: boolean;
};

export const template = ({ isExpanded = false }: TemplateProps) => {
  console.log('isExpanded', isExpanded);
  return html`<div
    data-component="toggle-expand"
    data-is-expanded="${isExpanded ? 'true' : 'false'}"
    class="${isExpanded ? 'isExpanded' : ''}"
  >
    <script type="application/json">
      {
        "isExpanded": ${isExpanded}
      }
    </script>
    <p>
      Lorem ipsum dolor sit amet, consectetur adipisicing elit. Atque consequatur cum laboriosam
      voluptate voluptatibus. Alias aut autem eligendi perspiciatis provident quae quisquam sapiente
      sequi, vero voluptatibus. Dolores dolorum exercitationem voluptate.
    </p>
    <p><button class="btn btn-primary" data-ref="expand-button">read more...</button></p>
    <p data-ref="expand-content">
      Lorem ipsum dolor sit amet, consectetur adipisicing elit. Distinctio error incidunt
      necessitatibus repellendus sint. A, deleniti ducimus ex facere ipsam libero quae quas
      temporibus voluptas voluptates. Blanditiis consequatur deserunt facere!
    </p>
  </div>`;
};
