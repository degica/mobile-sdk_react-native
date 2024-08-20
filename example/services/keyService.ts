import {Alert} from 'react-native';
import {PUBLISHABLE_KEY_URL} from './constants';

const getPublishableKey = async () => {
  try {
    const response = await fetch(PUBLISHABLE_KEY_URL);
    const {publishableKey} = await response.json();

    return publishableKey;
  } catch (e) {
    Alert.alert(
      'Error',
      'Unable to fetch publishable Key. Is your server running?',
    );
    return null;
  }
};

export default getPublishableKey;
