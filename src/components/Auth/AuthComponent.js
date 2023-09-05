import React, { useState, useEffect, useContext, useCallback } from "react";
import queryString from "query-string";
import { Button, Text } from "@aws-amplify/ui-react";
import DataContext from "../../store/data-context";
import { useNavigate } from "react-router-dom";
import Card from "../Card";
import {
  generateCodeVerifier,
  generateCodeChallengeFromVerifier,
} from "../../utils/pkce";
import {
  CognitoUser,
  CognitoUserSession,
  CognitoAccessToken,
  CognitoIdToken,
  CognitoRefreshToken,
  CognitoUserPool,
} from "amazon-cognito-identity-js";

const {
  REACT_APP_COGNITO_DOMAIN,
  REACT_APP_CLIENT_ID,
  REACT_APP_REDIRECT_URI,
} = process.env;

const AuthComponent = () => {
  const [cognitoUrl, setCognitoURl] = useState(""); // Url del Cognito Hosted UI
  const [codeChallenge, setCodeChallenge] = useState(""); // Code challenge para PKCE flow
  const [codeVerifier, setCodeVerifier] = useState(""); // Code verifier para PKCE flow
  const [code, setCode] = useState(null); // Código de autorización
  const dataContext = useContext(DataContext); // Estado global
  const navigate = useNavigate();

  // Se genera un code verifier y un code challenger
  useEffect(() => {
    // Sólo obtiene un nuevo code challenge y verifier si aún no se envió uno. De esta forma se evita un mismatch cuando el componente se renderice nuevamente.
    if (!localStorage.getItem("generatedCodeVerifier")) {
      const generatedCodeVerifier = generateCodeVerifier();
      setCodeVerifier(generatedCodeVerifier);
      localStorage.setItem(
        "generatedCodeVerifier",
        JSON.stringify(generatedCodeVerifier)
      );

      const handleGenerateCodeChallenge = async () => {
        try {
          const generatedCodeChallenge =
            await generateCodeChallengeFromVerifier(generatedCodeVerifier);
          setCodeChallenge(generatedCodeChallenge);

          localStorage.setItem(
            "generatedCodeChallenge",
            JSON.stringify(generatedCodeChallenge)
          );
        } catch (error) {
          console.log(error);
        }
      };

      handleGenerateCodeChallenge();
    } else {
      setCodeVerifier(
        JSON.parse(localStorage.getItem("generatedCodeVerifier"))
      );
      setCodeChallenge(
        JSON.parse(localStorage.getItem("generatedCodeChallenge"))
      );
    }
  }, []);

  // Se arma la url para hacer la petición de un authorization code
  useEffect(() => {
    // Se actualiza la url cuando se reciba un code challenge
    const authorizationUrl = `${REACT_APP_COGNITO_DOMAIN}/oauth2/authorize`;
    const queryParams = {
      client_id: REACT_APP_CLIENT_ID,
      response_type: "code",
      scope: "email openid profile",
      redirect_uri: REACT_APP_REDIRECT_URI,
      code_challenge_method: "S256",
      code_challenge: codeChallenge,
      prompt: "login",
    };
    setCognitoURl(
      `${authorizationUrl}?${new URLSearchParams(queryParams).toString()}`
    );
  }, [codeChallenge, cognitoUrl]);

  // Se toma el authorization code de la callback url si fue recibido
  useEffect(() => {
    const urlParams = queryString.parse(window.location.search);
    setCode(urlParams.code);
  }, []);

  // Se intercambia el authorization code por tokens
  // Se almancenan los tokens
  useEffect(() => {
    if (code && !dataContext.tokens.hasOwnProperty("access_token")) {
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

      const urlencoded = new URLSearchParams();
      urlencoded.append("grant_type", "authorization_code");
      urlencoded.append("client_id", process.env.REACT_APP_CLIENT_ID);
      urlencoded.append("code", code);
      urlencoded.append("redirect_uri", process.env.REACT_APP_REDIRECT_URI);
      urlencoded.append("code_verifier", codeVerifier);

      var requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: urlencoded,
        redirect: "follow",
      };

      fetch(
        `${process.env.REACT_APP_COGNITO_DOMAIN}/oauth2/token`,
        requestOptions
      )
        .then((response) => response.json())
        .then((result) => {
          if (result.hasOwnProperty("access_token")) {
            // Se almacenan los tokens en el estado global
            dataContext.storeTokens(result);

            // La próxima petición usará un verifier y code challenge diferentes
            localStorage.removeItem("generatedCodeVerifier");
            localStorage.removeItem("generatedCodeChallenge");
          }
        })
        .catch((error) => console.log("error", error));
    }
  }, [code, dataContext, codeVerifier]);

  //getUserInfo trae el usuario del endpoint /userInfo
  //se almacena el username de la respuesta
  const getUserInfo = useCallback(async () => {
    try {
      let response = await fetch(
        `${process.env.REACT_APP_COGNITO_DOMAIN}/oauth2/userInfo`,
        {
          headers: {
            Authorization: `Bearer ${dataContext.tokens.access_token}`,
          },
        }
      );
      response = await response.json();
      dataContext.storeUsername(response.username);
    } catch (error) {
      console.log("FETCH ERROR");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataContext.tokens]);

  // Si ya hay tokens almacenados se puede llamar a getUsetInfo
  useEffect(() => {
    if (
      dataContext.tokens.hasOwnProperty("access_token") &&
      !dataContext.username
    ) {
      getUserInfo();
    }
  }, [getUserInfo, dataContext.tokens, dataContext.username]);

  // Con los tokens y el username se puede iniciar una sesión de usuario y verificar que los tokens sean válidos

  useEffect(() => {
    if (dataContext.username) {
      const accessToken = dataContext.tokens.access_token;
      const idToken = dataContext.tokens.id_token;
      const refreshToken = dataContext.tokens.refresh_token;

      const AccessToken = new CognitoAccessToken({
        AccessToken: accessToken,
      });
      const IdToken = new CognitoIdToken({ IdToken: idToken });
      const RefreshToken = new CognitoRefreshToken({
        RefreshToken: refreshToken,
      });

      const sessionData = {
        AccessToken,
        IdToken,
        RefreshToken,
      };

      const userSession = new CognitoUserSession(sessionData);

      const poolData = {
        UserPoolId: process.env.REACT_APP_USER_POOL_ID,
        ClientId: process.env.REACT_APP_CLIENT_ID,
      };

      const userPool = new CognitoUserPool(poolData);

      const cognitoUser = new CognitoUser({
        Username: dataContext.username,
        Pool: userPool, // Your Cognito User Pool instance
      });

      cognitoUser.setSignInUserSession(userSession);

      cognitoUser.getSession(function (err, session) {
        // You must run this to verify that session (internally)
        if (session.isValid()) {
          // redirect
          localStorage.setItem("userEmail", session.idToken.payload.email);

          navigate("/home");
        } else {
          console.log("session is not valid");
          // remove tokens from storage and context
          dataContext.removeUser();
        }
      });
    }
  }, [dataContext, navigate]);

  const handleSignIn = (event) => {
    event.preventDefault();
    if (navigator.onLine) {
      window.location.href = cognitoUrl;
    } else {
      alert("No estás conectado a internet");
    }
  };

  return (
    <>
      {!code && !dataContext.tokens.access_token ? (
        <Card>
          <div>
            <Text fontSize="2rem" fontWeight="600">
              QA Counter
            </Text>
          </div>
          <a href={cognitoUrl}>
            <Button variation="primary" onClick={handleSignIn}>
              Iniciar sesión
            </Button>
          </a>
        </Card>
      ) : (
        <div>Redirigiendo...</div>
      )}
    </>
  );
};

export default AuthComponent;
