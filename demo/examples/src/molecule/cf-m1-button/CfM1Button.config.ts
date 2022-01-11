// Define the default values so we can re-use them in the stories.
import type { ButtonSize, CfM1ButtonTypes, IconAlignment } from './CfM1Button.types';

export const iconAlignments = ['left', 'right'] as const;
export const buttonSizes = ['small', 'medium'] as const;

export const defaultTarget: CfM1ButtonTypes['target'] = '_self';
export const defaultDisabled: CfM1ButtonTypes['disabled'] = false;
export const defaultLoading: CfM1ButtonTypes['loading'] = false;
export const defaultIconAlignment: IconAlignment = 'right';
export const defaultButtonSize: ButtonSize = 'medium';
