import { expect } from '@storybook/jest';

const wait = (miliseconds) => new Promise((r) => setTimeout(r, miliseconds));
const waitToBe = async (
  element: Object,
  property: string,
  expectedValue: unknown,
  waitTime = 100,
) => {
  await wait(waitTime);
  expect(element[property]).toBe(expectedValue);
};

export { wait, waitToBe };
