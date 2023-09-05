import React from "react";
import classes from "./CenteringCard.module.css";

function CenteringCard({ children }) {
  return <div className={classes.container}>{children}</div>;
}

export default CenteringCard;
