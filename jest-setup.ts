import '@testing-library/jest-native/extend-expect';
jest.mock('expo/src/winter/ImportMetaRegistry', () => ({ ImportMetaRegistry: { url: '' } }));
jest.mock('@ungap/structured-clone', () => {
  return {
    __esModule: true,
    default: (val) => val,
  };
});
