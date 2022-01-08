import type { imageObjectFitOptions } from './CfA3Image.config';

export type ImageObjectFit = typeof imageObjectFitOptions[number];

export type CfA3ImageTypes = {
  src: string;
  alt: string;
  enableLazyLoading?: boolean;
  enableTransitionIn?: boolean;
  objectFit?: ImageObjectFit;
  sources: Array<{
    media: string;
    srcset: string;
  }>;
  className?: Array<string> | string;
};
