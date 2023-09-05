import React from "react";
import DataContext from "../store/data-context";
import { useContext } from "react";
import { Button } from "@aws-amplify/ui-react";
import styles from "./Counter.module.css";

function Counter({ gender, name, index }) {
  const dataContext = useContext(DataContext);

  const handleCount = (e) => {
    if (e.target.value === "+") {
      dataContext.addToCategory(gender, name);
    } else {
      dataContext.removeFromCategory(gender, name);
    }
  };

  return (
    <div
      className={`${styles["counter-container"]} ${
        index % 2 ? styles["dark"] : styles["light"]
      }`}
    >
      <div className={styles["name-container"]}>
        <p>{name}</p>
      </div>

      <div className={styles["button-container"]}>
        <Button value="-" onClick={handleCount} size="small" isFullWidth={true}>
          -
        </Button>
        <p>{dataContext[gender][name]}</p>
        <Button value="+" onClick={handleCount} size="small" isFullWidth={true}>
          +
        </Button>
      </div>
    </div>
  );
}

export default Counter;
