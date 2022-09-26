import type { PropTypeInfo } from '../props/propDefinitions.types';

const getPropTypeInfo = (propTypeInfo: PropTypeInfo): PropTypeInfo => ({
  ...propTypeInfo,
  source: {
    ...propTypeInfo.source,
    name: propTypeInfo.source.name || propTypeInfo.name,
  },
});

export default getPropTypeInfo;
