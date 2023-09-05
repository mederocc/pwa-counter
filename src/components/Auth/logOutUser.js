export async function logOutUser(cognitoUser) {
  return new Promise((resolve, reject) => {
    cognitoUser.getSession((err, session) => {
      if (err) {
        reject(err);
        return;
      }

      const url = `${process.env.REACT_APP_COGNITO_DOMAIN}/oauth2/revoke`;
      const token = session.refreshToken.jwtToken;
      const client_id = process.env.REACT_APP_CLIENT_ID;

      const requestOptions = {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: `token=${encodeURIComponent(
          token
        )}&client_id=${encodeURIComponent(client_id)}`,
      };

      fetch(url, requestOptions)
        .then((response) => resolve(response))
        .catch((error) => {
          reject(error);
        });
    });
  });
}
