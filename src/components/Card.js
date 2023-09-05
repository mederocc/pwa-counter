import React from "react";
import classes from "./Card.module.css";

function Card({ children }) {
  return (
    <div className={classes.container}>
      <div className={classes.card}>{children}</div>
    </div>
  );
}

export default Card;
