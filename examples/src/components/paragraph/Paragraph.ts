import { html } from 'lit-html';

import './paragraph.css';

type TitleProps = {
  title: string;
  headingClass?: 'heading-01' | 'heading-02' | 'heading-03' | 'heading-04' | 'custom-heading';
  alignment?: 'left' | 'center' | 'right';
  className?: string;
  eyebrow?: string;
  mustache?: string;
};

export function titleTemplate({
  headingClass = 'heading-01',
  alignment = 'center',
  className,
  eyebrow,
  title,
  mustache,
}: TitleProps) {
  return html`
    <h2
      data-component="m01-title"
      class=${[headingClass, `is-${alignment}`, className].join(' ')}
      data-alignment=${alignment}
    >
      ${eyebrow && html`<small class="js-eyebrow body-m eyebrow">${eyebrow}</small>`}
      <span class="js-title">${title}</span>
      ${mustache && html`<small class="js-mustache mustache">${mustache}</small>`}
    </h2>
  `;
}

export type ParagraphProps = {
  title: TitleProps;
  copy: string;
};

export function paragraph({ title, copy }: ParagraphProps) {
  return html`
    <div class="responsivegrid aem-GridColumn aem-GridColumn--default--12">
      <section data-component="c02-paragraph" ?data-scroll-component=${false}>
        <div class="content-wrapper">
          <div class="component-content">
            ${titleTemplate({ ...title, headingClass: 'custom-heading' })}
            <p class="body-m component-copy">${copy}</p>
          </div>
        </div>
      </section>
    </div>
  `;
}
