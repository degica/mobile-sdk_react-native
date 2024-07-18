global.__DEV__ = process.env.NODE_ENV !== "production";

// jest.mock('react-native-vision-camera', () => ({
//     Camera: 'mockCamera',
//     useCameraDevices: jest.fn(),
//     useFrameProcessor: jest.fn(),
//   }));
  
//   jest.mock('react-native-vision-camera-text-recognition', () => ({
//     useTextRecognition: jest.fn(),
//   }));
  
//   jest.mock('react-native-worklets-core', () => ({
//     Worklets: jest.fn(),
//   }));

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