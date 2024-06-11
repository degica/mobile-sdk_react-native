import { BASE_URL } from "../util/constants";
import { printLog } from "../util/helpers";
import { SessionShowResponseType } from "../util/types";

type SessionShowProps = {
  sessionId: string;
  publicKey: string;
};

const sessionShow = async ({
  sessionId,
  publicKey,
}: SessionShowProps): Promise<SessionShowResponseType | null> => {
  try {
    const url = `${BASE_URL}/sessions/${sessionId}`;
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Basic ${btoa(publicKey + ":")}`,
      },
    };

    const response = await fetch(url, options);
    const data = await response.json();

    return data;
  } catch (e) {
    printLog({
      logName: "Error:",
      message: "Invalid Session",
    });
    return null;
  }
};

export default sessionShow;
