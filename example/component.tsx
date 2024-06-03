import React from 'react';
import {Button, SafeAreaView, useColorScheme} from 'react-native';
import {KomojuSDK} from 'react-native-komoju';

import {Colors} from 'react-native/Libraries/NewAppScreen';

function Component(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  const {createPayment} = KomojuSDK.useKomoju();

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const handleOpenSheet = () => {
    console.log(createPayment);
    createPayment();
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <Button title="Press me" onPress={handleOpenSheet} />
    </SafeAreaView>
  );
}

export default Component;
