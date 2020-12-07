// Define the default values so we can re-use them in the stories.
import type { ButtonSize, CfA2ButtonTypes, IconAlignment } from './CfA2Button.types';

export const iconAlignments = ['left', 'right'] as const;
export const buttonSizes = ['small', 'medium'] as const;

export const defaultTarget: CfA2ButtonTypes['target'] = '_self';
export const defaultDisabled: CfA2ButtonTypes['disabled'] = false;
export const defaultLoading: CfA2ButtonTypes['loading'] = false;
export const defaultIconAlignment: IconAlignment = 'right';
export const defaultButtonSize: ButtonSize = 'medium';
