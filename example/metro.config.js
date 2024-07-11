/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');
const process = require('process'); // Ensure process is imported

const baseDir = path.resolve(__dirname, '..'); // Resolve base directory once

console.log('Base Directory:', baseDir);

const extraNodeModules = {
  'react-native': path.resolve(baseDir, 'node_modules/react-native'),
  'react': path.resolve(baseDir, 'node_modules/react'),
  'react-native-vision-camera': path.resolve(baseDir, 'node_modules/react-native-vision-camera'),
  'react-native-vision-camera-text-recognition': path.resolve(baseDir, 'node_modules/react-native-vision-camera-text-recognition'),
  'react-native-worklets-core': path.resolve(baseDir, 'node_modules/react-native-worklets-core'),
  'react-native-webview': path.resolve(baseDir, 'node_modules/react-native-webview'),
  'react-i18next': path.resolve(baseDir, 'node_modules/react-i18next'),
  'i18next': path.resolve(baseDir, 'node_modules/i18next'),
  'react-native-svg': path.resolve(baseDir, 'node_modules/react-native-svg'),
};

Object.keys(extraNodeModules).forEach((key) => {
  console.log(`Path for ${key}:`, extraNodeModules[key]);
});

module.exports = {
  watchFolders: [baseDir],
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: false,
      },
    }),
  },
  resolver: {
    extraNodeModules: new Proxy(extraNodeModules, {
      get: (target, name) => {
        const resolvedPath = name in target ? target[name] : path.join(process.cwd(), `node_modules/${name}`);
        console.log(`Resolving module ${name}:`, resolvedPath);
        return resolvedPath;
      },
    }),
  },
};
