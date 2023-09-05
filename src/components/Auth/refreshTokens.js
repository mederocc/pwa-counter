export async function refreshTokens(cognitoUser) {
  return new Promise((resolve, reject) => {
    cognitoUser.getSession((err, session) => {
      if (err) {
        reject(err);
        return;
      }

      cognitoUser.refreshSession(
        session.refreshToken,
        (err, refreshedSession) => {
          if (err) {
            reject(err);
            return;
          }

          resolve(refreshedSession);
        }
      );
    });
  });
}
