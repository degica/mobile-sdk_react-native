module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    ['module:react-native-dotenv', {
      envName: 'APP_ENV',
      moduleName: '@env',
      path: '.env',
    }],
    [
      'module-resolver',
      {
        alias: {
          'react-native': './node_modules/react-native',
          react: './node_modules/react',
        },
      },
    ],
  ],
};