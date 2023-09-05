import React, { useContext } from "react";
import { StyledButton } from "../utils/styledComponents";
import DataContext from "../store/data-context";
import { Text } from "@aws-amplify/ui-react";
import styles from "./Lot.module.css";

function Lot(props) {
  const dataContext = useContext(DataContext);

  const { handleClick } = props;

  const handleLot = () => {
    dataContext.setBaseValues({ lot: props.lot });
    handleClick("lot_id", props.lot.lot_id);
  };

  return (
    <StyledButton variation="primary" onClick={handleLot}>
      <div className={styles["lot-container"]}>
        {<Text color="white">{props.lot.name}</Text>}
        {
          <Text color="white" fontWeight="500">
            {props.lot.season} season
          </Text>
        }
      </div>
    </StyledButton>
  );
}

export default Lot;
