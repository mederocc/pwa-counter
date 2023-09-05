import * as AWS from "aws-sdk/global";

export async function initAWSWithCredentials(refreshedSession) {
  const { idToken } = refreshedSession;
  const idTokenStr = idToken.jwtToken;

  AWS.config.update({
    region: process.env.REACT_APP_REGION,
  });

  // Set up AWS SDK with new tokens
  AWS.config.credentials = new AWS.CognitoIdentityCredentials({
    IdentityPoolId: process.env.REACT_APP_IDENTITY_POOL_ID,
    Logins: {
      // Use Cognito as the identity provider
      [`cognito-idp.${process.env.REACT_APP_REGION}.amazonaws.com/${process.env.REACT_APP_USER_POOL_ID}`]:
        idTokenStr,
    },
  });

  // Update the AWS credentials with the new tokens
  return new Promise((resolve, reject) => {
    AWS.config.credentials.get((err) => {
      if (err) {
        console.error("Error updating AWS credentials:", err);
        reject(false);
      } else {
        // console.log("Successfully refreshed AWS credentials!");
        resolve(true);
      }
    });
  });
}
