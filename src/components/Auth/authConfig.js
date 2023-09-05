const awsConfig = {
  Auth: {
    identityPoolId: process.env.REACT_APP_IDENTITY_POOL_ID,
    region: process.env.REACT_APP_REGION,
    userPoolId: process.env.REACT_APP_USER_POOL_ID,
    userPoolWebClientId: process.env.REACT_APP_CLIENT_ID,
    oauth: {
      domain: process.env.REACT_APP_COGNITO_DOMAIN_ONLY,
      scope: ["email", "profile", "openid"],
      redirectSignIn: process.env.REACT_APP_REDIRECT_URI,
      redirectSignOut: process.env.REACT_APP_REDIRECT_URI,
      responseType: "token",
    },
  },
};

export default awsConfig;
