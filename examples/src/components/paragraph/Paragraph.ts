import { html } from '../../../../src/lib/utils/template/mhtml';
import { SplitText } from 'gsap/SplitText';

import './paragraph.css';
import { defineComponent, refComponent, refElement } from '../../../../src';
import { onMount } from '../../../../src/lib/Component.Reactive';
import {
  provideTransitionContext,
  TransitionContext,
  useTransition,
} from '../../../../src/lib/utils/animation/transitions';
import { splitWordAnimation } from '../../splitTextAnimation';

////////////////////////////////////////////////////////////////////////////////
// Title

export const Title = defineComponent({
  name: 'm01-title',
  refs: {
    eyebrow: refElement('eyebrow', { isRequired: false }),
    title: 'title',
    mustache: refElement('mustache', { isRequired: false }),
  },
  setup({ refs, element }) {
    useTransition(element, {
      setupTransitionInTimeline(timeline) {
        if (refs.eyebrow.element) {
          timeline.add(
            splitWordAnimation(new SplitText(refs.eyebrow.element, { type: 'lines,words' })),
          );
        }
        if (refs.title.element) {
          timeline.add(
            splitWordAnimation(new SplitText(refs.title.element, { type: 'lines,words' })),
            refs.eyebrow.element ? 0.1 : 0,
          );
        }
        if (refs.mustache.element) {
          timeline.add(
            splitWordAnimation(new SplitText(refs.mustache.element, { type: 'lines,words' })),
          );
        }
      },
    });

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
}: TitleProps) {
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

////////////////////////////////////////////////////////////////////////////////
// Paragraph

export const Paragraph = defineComponent({
  name: 'c02-paragraph',
  refs: {
    title: refComponent(Title),
  },
  setup({ refs, element }) {
    const transitionContext = new TransitionContext();
    provideTransitionContext(transitionContext);

    const controller = useTransition(element, {
      setupTransitionInTimeline(timeline) {
        timeline.add(transitionContext.getTimeline(refs.title.component!.element));
      },
    });

    onMount(() => {
      controller.transitionIn();
    });
    return [];
  },
});

export type ParagraphProps = {
  title: TitleProps;
  copy: string;
};

export function paragraph({ title, copy }: ParagraphProps, ref?: string) {
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
