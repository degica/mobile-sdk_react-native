import React, {useEffect, useState} from 'react';
import {Button, SafeAreaView, useColorScheme} from 'react-native';
import {KomojuSDK} from 'react-native-komoju';

import {Colors} from 'react-native/Libraries/NewAppScreen';
import createSession from './services/sessionService';

function Component(): React.JSX.Element {
  const [sessionId, setSessionId] = useState('');

  const isDarkMode = useColorScheme() === 'dark';

  const {createPayment} = KomojuSDK.useKomoju();

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  useEffect(() => {
    const fetchSession = async () => {
      const sessionData = await createSession('20');
      setSessionId(sessionData);
    };

    fetchSession();
  }, []);

  const handleOpenSheet = () => {
    createPayment({
      sessionId,
    });
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <Button title="Press me" onPress={handleOpenSheet} />
    </SafeAreaView>
  );
}

export default Component;
