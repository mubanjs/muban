import { html } from '@muban/template';
import { ref } from '@vue/reactivity';

import './paragraph.css';
import { bind, defineComponent, refComponent, refElement } from '../../../../../src';

/// /////////////////////////////////////////////////////////////////////////////
// Title

export const Title = defineComponent({
  name: 'm01-title',
  refs: {
    eyebrow: refElement('eyebrow', { isRequired: false }),
    title: 'title',
    mustache: refElement('mustache', { isRequired: false }),
  },
  props: {},
  setup() {
    return [];
  },
});

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
}: TitleProps): string {
  return html`
    <h2
      data-component="m01-title"
      class=${[headingClass, `is-${alignment}`, className].join(' ')}
      data-alignment=${alignment}
    >
      ${eyebrow && html`<small class="body-m eyebrow" data-ref="eyebrow">${eyebrow}</small>`}
      <span data-ref="title">${title}</span>
      ${mustache && html`<small class="mustache" data-ref="c">${mustache}</small>`}
    </h2>
  `;
}

/// /////////////////////////////////////////////////////////////////////////////
// Paragraph

export const Paragraph = defineComponent({
  name: 'c02-paragraph',
  refs: {
    title: refComponent(Title),
  },
  setup({ refs }) {
    return [
      // allow css bindings on Components for custom styling
      bind(refs.title, {
        css: { foo: ref(true) },
        style: { fontSize: ref('32px') },
        attr: { 'data-test': ref('foobar') },
      }),
    ];
  },
});

export type ParagraphProps = {
  title: TitleProps;
  copy: string;
};

export function paragraph({ title, copy }: ParagraphProps, ref?: string): string {
  return html`
    <div class="responsivegrid aem-GridColumn aem-GridColumn--default--12">
      <section data-component="c02-paragraph" data-ref=${ref} data-scroll-component=${false}>
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

export const meta = {
  component: Paragraph,
  template: paragraph,
};
