import React, {useEffect, useState} from 'react';
import {Button, SafeAreaView, useColorScheme} from 'react-native';
import {KomojuSDK} from 'react-native-komoju';

import {Colors} from 'react-native/Libraries/NewAppScreen';
import createSession from './services/sessionService';
import PaymentScreen from './PaymentScreen';

const PAYMENT_AMOUNT = '2000';

function Component(): React.JSX.Element {
  const [sessionId, setSessionId] = useState<string | null>('');

  const isDarkMode = useColorScheme() === 'dark';

  const {createPayment} = KomojuSDK.useKomoju();

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
    flex: 1,
  };

  useEffect(() => {
    const fetchSession = async () => {
      const sessionData = await createSession(PAYMENT_AMOUNT);
      setSessionId(sessionData);
    };

    fetchSession();
  }, []);

  const handleOpenSheet = () => {
    sessionId &&
      createPayment({
        sessionId,
      });
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      {/* <Button title="Press me" onPress={handleOpenSheet} /> */}
      <PaymentScreen />
    </SafeAreaView>
  );
}

export default Component;
