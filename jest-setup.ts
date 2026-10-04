import '@testing-library/jest-native/extend-expect';

jest.mock('expo/src/winter/ImportMetaRegistry', () => ({ ImportMetaRegistry: { url: '' } }));
jest.mock('@ungap/structured-clone', () => {
  return {
    __esModule: true,
    default: (val: any) => val,
  };
});

jest.mock('expo-sqlite', () => ({
  openDatabaseSync: jest.fn(() => ({
    execAsync: jest.fn().mockResolvedValue(undefined),
    runAsync: jest.fn().mockResolvedValue(undefined),
    getAllAsync: jest.fn().mockResolvedValue([]),
  })),
  SQLiteProvider: ({ children }: { children: React.ReactNode }) => children,
}));
