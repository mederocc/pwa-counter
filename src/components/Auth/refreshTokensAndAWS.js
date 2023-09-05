import { refreshTokens } from "./refreshTokens";
import { initAWSWithCredentials } from "./initAWSWithCredentials";

export async function refreshTokensAndAWS(cognitoUser) {
  try {
    const refreshedSession = await refreshTokens(cognitoUser);
    return await initAWSWithCredentials(refreshedSession);
  } catch (err) {
    console.error("Error refreshing tokens:", err);
  }
}
