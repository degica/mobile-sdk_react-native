import React from 'react';
import {KomojuSDK} from 'react-native-komoju';

import Component from './component';

function App(): React.JSX.Element {
  return (
    <KomojuSDK.KomojouProvider urlScheme="" pubickKey="">
      <Component />
    </KomojuSDK.KomojouProvider>
  );
}

export default App;
