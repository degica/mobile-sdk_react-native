import {Alert} from 'react-native';

const getPublishableKey = async () => {
  try {
    const url = 'https://rn-komoju-app.glitch.me/serve-keys';
    const response = await fetch(url);
    const {publishableKey} = await response.json();

    return publishableKey;
  } catch (e) {
    Alert.alert('Error', 'Unable to fetch session. Is your server running?');
    return null;
  }
};

export default getPublishableKey;
