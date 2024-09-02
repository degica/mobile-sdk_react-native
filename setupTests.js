global.__DEV__ = process.env.NODE_ENV !== "production";

jest.mock('react-i18next', () => ({
    useTranslation: () => {
      return {
        t: (str) => str,
        i18n: {
          changeLanguage: () => new Promise(() => {}),
        },
      };
    },
    initReactI18next: {
      type: '3rdParty',
      init: () => {},
    },
  }));

  jest.mock('./src/context/ThemeContext', () => ({
    ThemeProvider: ({ children }) => children,
    useTheme: () => ({
      mode: 'light',
      toggleMode: jest.fn(),
    }),
  }));