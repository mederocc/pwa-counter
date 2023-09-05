import React, { useState, useContext, useEffect } from "react";
import DataContext from "../../store/data-context";
import { useNavigate, Navigate } from "react-router-dom";
import { refreshTokensAndAWS } from "./refreshTokensAndAWS";
import { CognitoUserPool } from "amazon-cognito-identity-js";
import { logOutUser } from "./logOutUser";

function PrivateRoute({ Component }) {
  const dataContext = useContext(DataContext);
  const navigate = useNavigate();
  const [didSignOut, setDidSignOut] = useState(false);
  const [sessionIsValid, setSessionIsValid] = useState(
    JSON.parse(localStorage.getItem("sessionIsValid")) ?? null
  );
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  const handleOnline = () => {
    setIsOnline(true);
  };

  const handleOffline = () => {
    setIsOnline(false);
  };

  useEffect(() => {
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  useEffect(() => {
    if (sessionIsValid === false) {
      dataContext.removeUser();
      navigate("/");
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (dataContext.username) {
      const poolData = {
        UserPoolId: process.env.REACT_APP_USER_POOL_ID,
        ClientId: process.env.REACT_APP_CLIENT_ID,
      };

      const userPool = new CognitoUserPool(poolData);
      const cognitoUser = userPool.getCurrentUser();

      if (!cognitoUser) {
        dataContext.removeUser();
        navigate("/");
      }

      if (didSignOut && cognitoUser) {
        const logout = logOutUser(cognitoUser);
        logout
          .then((res) => {
            console.log(res);
            cognitoUser.signOut();
            dataContext.removeUser();
            navigate("/");
          })
          .catch((e) => console.log(e));
      }

      if (cognitoUser && !didSignOut && isOnline) {
        // validates on mount.

        refreshTokensAndAWS(cognitoUser).then((res) => {
          localStorage.setItem("sessionIsValid", JSON.stringify(res));
          setSessionIsValid(res);
        });

        const refreshInterval = setInterval(() => {
          console.log("refreshing tokens");
          refreshTokensAndAWS(cognitoUser).then((res) => {
            setSessionIsValid(res);
            localStorage.setItem("sessionIsValid", JSON.stringify(res));
          });
        }, 50 * 60 * 1000); // 50 minutes in milliseconds

        // Clean up the interval when the component unmounts
        return () => clearInterval(refreshInterval);
      }
    } else if (!dataContext.username) {
      navigate("/");
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataContext.username, navigate, didSignOut, isOnline]);

  useEffect(() => {
    if (sessionIsValid === false) {
      const poolData = {
        UserPoolId: process.env.REACT_APP_USER_POOL_ID,
        ClientId: process.env.REACT_APP_CLIENT_ID,
      };

      const userPool = new CognitoUserPool(poolData);
      const cognitoUser = userPool.getCurrentUser();
      const logout = logOutUser(cognitoUser);
      logout
        .then((res) => {
          cognitoUser.signOut();
          dataContext.removeUser();
        })
        .catch((e) => console.log(e));
    }
    console.log("SESSION IS VALID", sessionIsValid);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionIsValid]);

  return (
    <>
      {sessionIsValid ? (
        <Component
          isOnline={isOnline}
          signOut={() => {
            setDidSignOut(true);
          }}
        />
      ) : (
        <div>Redirigiendo...</div>
      )}
      {sessionIsValid === false && <Navigate to="/" />}
    </>
  );
}

export default PrivateRoute;
