import { expect } from '@storybook/jest';
import * as matchers from '@testing-library/jest-dom/matchers';
expect.extend(matchers);

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  server: {
    url: `http://localhost:3000/story`,
    // customFetchStoryHtml,
  },
}
