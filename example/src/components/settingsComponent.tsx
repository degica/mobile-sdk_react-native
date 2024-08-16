import React, {useState} from 'react';
import {
  Image,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  useColorScheme,
  View,
} from 'react-native';

const SettingsModal = ({
  komojuKeys,
  setKomojuKeys,
  modalVisible,
  setModalVisible,
}: {
  komojuKeys: {PUBLIC_KEY: string; SECRET_KEY: string};
  setKomojuKeys: (v: any) => void;
  modalVisible: boolean;
  setModalVisible: (v: any) => void;
}) => {
  const [komojuKeyState, setKomojuKeyState] = useState(komojuKeys);
  const toggleModal = () => setModalVisible((pre: boolean) => !pre);

  const onChangePublicKey = (val: string) => {
    setKomojuKeyState({...komojuKeyState, PUBLIC_KEY: val});
  };

  const onChangePrivateKey = (val: string) => {
    setKomojuKeyState({...komojuKeyState, SECRET_KEY: val});
  };

  const onSave = () => {
    setKomojuKeys(komojuKeyState);
    toggleModal();
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={toggleModal}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <View style={styles.inputContainer}>
            <Text style={styles.modalText}>Publishable key:</Text>
            <TextInput
              style={styles.input}
              value={komojuKeyState.PUBLIC_KEY}
              onChangeText={onChangePublicKey}
            />
            <Text style={styles.modalText}>Secret key:</Text>
            <TextInput
              style={styles.input}
              value={komojuKeyState.SECRET_KEY}
              onChangeText={onChangePrivateKey}
            />
          </View>
          <View style={styles.buttonContainer}>
            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={toggleModal}>
              <Text style={[styles.textStyle, styles.cancelBtnText]}>
                Cancel
              </Text>
            </Pressable>
            <Pressable
              style={[styles.button, styles.buttonSave]}
              onPress={onSave}>
              <Text style={styles.textStyle}>Save</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export const SettingsIcon = ({
  setModalVisible,
}: {
  setModalVisible: (v: any) => void;
}) => {
  const toggleModal = () => setModalVisible((pre: boolean) => !pre);

  const colorScheme = useColorScheme(); // Detects the color scheme of the device

  const dynamicStyles = StyleSheet.create({
    container: {
      backgroundColor: colorScheme === 'dark' ? '#333' : '#FFF',
    },
  });

  return (
    <View style={[styles.gearIconContainer, dynamicStyles.container]}>
      <Pressable onPress={toggleModal}>
        <Image
          source={require('../assets/gear_icon.png')}
          style={styles.gearIcon}
        />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  gearIcon: {
    width: 30,
    height: 30,
  },
  gearIconContainer: {
    alignItems: 'flex-end',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginBottom: 5,
    textAlign: 'center',
    color: '#000',
  },
  inputContainer: {
    alignItems: 'flex-start',
  },
  buttonContainer: {
    flexDirection: 'row',
  },
  buttonClose: {
    borderColor: '#2196F3',
    backgroundColor: 'white',
    borderWidth: 1,
    marginRight: 10,
  },
  buttonSave: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  cancelBtnText: {
    color: '#2196F3',
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  input: {
    height: 40,
    minWidth: 200,
    borderColor: 'gray',
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 8,
    backgroundColor: 'white',
    color: '#000',
  },
});

export default SettingsModal;
