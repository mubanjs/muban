/* eslint-disable @typescript-eslint/no-explicit-any */
export type { RenderContext } from '@storybook/core';
import type { Args as DefaultArgs, Annotations, BaseMeta, BaseStory } from '@storybook/addons';
import { TemplateResult } from 'lit-html';
import type { ComponentFactory } from '../../../../src/lib/Component.types';

export { Args, ArgTypes, Parameters, StoryContext } from '@storybook/addons';

export declare type StoryFnMubanReturnType = {
  component: ComponentFactory<any>;
  template: (data: any) => TemplateResult;
};
export interface IStorybookStory {
  name: string;
  render: () => any;
}
export interface IStorybookSection {
  kind: string;
  stories: Array<IStorybookStory>;
}
export interface ShowErrorArgs {
  title: string;
  description: string;
}

type MubanComponent = any;
type MubanReturnType = StoryFnMubanReturnType;

export type Meta<Args = DefaultArgs> = BaseMeta<MubanComponent> &
  Annotations<Args, MubanReturnType>;

export type Story<Args = DefaultArgs> = BaseStory<Args, MubanReturnType> &
  Annotations<Args, MubanReturnType>;
