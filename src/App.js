import React from "react";
import AuthComponent from "./components/Auth/AuthComponent";
import { Route, Routes } from "react-router-dom";
import "@aws-amplify/ui-react/styles.css";
import classes from "./App.module.css";
import DataProvider from "./store/DataProvider";
import PrivateRoute from "./components/Auth/PrivateRoute";
import Home from "./views/Home";
import OfflinePageWarning from "./utils/OfflinePageWarning";

const App = () => {
  return (
    <DataProvider>
      <div className={classes["app-container"]}>
        <Routes>
          <Route path="/" element={<AuthComponent />} />
          <Route path="/home" element={<PrivateRoute Component={Home} />} />
        </Routes>
        <OfflinePageWarning />
      </div>
    </DataProvider>
  );
};

export default App;
