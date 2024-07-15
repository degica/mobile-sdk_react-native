module.exports = {
  presets: [
    "@babel/preset-env",
    "@babel/preset-react",
    "@babel/preset-typescript",
    "module:@react-native/babel-preset",
  ],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./src'],
        extensions: ['.ios.js', '.android.js', '.js', '.ts', '.tsx', '.json'],
        alias: {
          "@services": "./src/services",
          "@assets": "./src/assets",
          "@components": "./src/components",
          "@util": "./src/util",
          "@context": "./src/context"
        }
      }
    ]
  ]
};
