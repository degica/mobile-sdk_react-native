import React, {useState} from 'react';
import {SafeAreaView, StyleSheet} from 'react-native';
import {KomojuSDK, LanguageTypes} from '@komoju/komoju-react-native';

import PaymentScreen from './PaymentScreen';
import SettingsModal, {SettingsIcon} from './components/settingsComponent';
import LanguageSelectComponent from './components/languageSelectComponet';

/**
 * You can get your public key and secret keys from https://komoju.com/en/sign_in
 * Your publishable key is required in order for Fields to access the KOMOJU API.
 * Your secret key is required in order to create a session. This should be done in your backend on a real world application
 */
const PUBLIC_KEY = '';
const SECRET_KEY = '';

function App(): React.JSX.Element {
  const [komojuKeys, setKomojuKeys] = useState({
    PUBLIC_KEY: PUBLIC_KEY,
    SECRET_KEY: SECRET_KEY,
  });
  const [modalVisible, setModalVisible] = useState(false);
  const [language, setLanguage] = useState(LanguageTypes.ENGLISH);

  return (
    <SafeAreaView style={styles.mainContainer}>
      <SettingsIcon setModalVisible={setModalVisible} />
      <LanguageSelectComponent language={language} setLanguage={setLanguage} />

      <KomojuSDK.KomojuProvider
        publicKey={komojuKeys.PUBLIC_KEY}
        language={language}>
        <PaymentScreen secretKey={komojuKeys.SECRET_KEY} />
      </KomojuSDK.KomojuProvider>

      {modalVisible ? (
        <SettingsModal
          komojuKeys={komojuKeys}
          modalVisible={modalVisible}
          setModalVisible={setModalVisible}
          setKomojuKeys={setKomojuKeys}
        />
      ) : null}
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
