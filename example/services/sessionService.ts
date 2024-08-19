import {Alert} from 'react-native';
import {CREATE_SESSION_URL} from './constants';

// Refer documentation on https://doc.komoju.com/reference/post_sessions
// for creating a session

type createSessionProps = {
  amount: string;
  currency: string;
};

const createSession = async ({
  amount,
  currency,
}: createSessionProps): Promise<string | null> => {
  try {
    const options = {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        amount,
        currency,
      }),
    };
    const response = await fetch(CREATE_SESSION_URL, options);
    const {sessionId} = await response.json();

    return sessionId;
  } catch (e) {
    Alert.alert('Error', 'Unable to fetch session. Is your server running?');
    return null;
  }
};

export default createSession;
