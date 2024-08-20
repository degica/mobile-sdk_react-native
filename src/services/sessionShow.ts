import { BASE_URL_API, API_HEADER } from '../util/constants';
import { printLog } from '../util/helpers';
import { SessionShowResponseType } from '../util/types';

type SessionShowProps = {
  sessionId: string;
  publishableKey: string;
};

const sessionShow = async ({
  sessionId,
  publishableKey,
}: SessionShowProps): Promise<SessionShowResponseType | null> => {
  try {
    const url = `${BASE_URL_API}/sessions/${sessionId}`;
    const options = {
      method: "GET",
      headers: API_HEADER(publishableKey),
    };

    const response = await fetch(url, options);
    const data = await response.json();

    return data;
  } catch (e) {
    printLog({
      logName: 'Error:',
      message: 'Invalid Session',
    });
    return null;
  }
};

export default sessionShow;
