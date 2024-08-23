import React, {useEffect, useState} from 'react';
import {SafeAreaView, StyleSheet} from 'react-native';
import {KomojuSDK, LanguageTypes} from '@komoju/komoju-react-native';

import PaymentScreen from './components/PaymentScreen';
import LanguageSelectComponent from './components/languageSelectComponet';
import getPublishableKey from './services/keyService';
import Loader from './components/Loader';

/**
 * You can get your Publishable key and Secret keys from https://komoju.com/en/sign_in
 * Your publishable key is required in order for Fields to access the KOMOJU API.
 * Your secret key is required in order to create a session. This should be done in your backend on a real world application
 */

function App(): React.JSX.Element {
  const [publishableKey, setPublishableKey] = useState('');
  const [loading, setLoading] = useState(true);
  const [language, setLanguage] = useState(LanguageTypes.ENGLISH);

  useEffect(() => {
    const keyService = async () => {
      const key = await getPublishableKey();
      setPublishableKey(key);
      setLoading(false);
    };

    keyService();
  }, []);

  return (
    <SafeAreaView style={styles.mainContainer}>
      <LanguageSelectComponent language={language} setLanguage={setLanguage} />

      <KomojuSDK.KomojuProvider
        publishableKey={publishableKey}
        language={language}>
        <PaymentScreen language={language} setLoading={setLoading} />
      </KomojuSDK.KomojuProvider>

      {loading ? <Loader /> : null}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    height: '100%',
  },
});

export default App;
