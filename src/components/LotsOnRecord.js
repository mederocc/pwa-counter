import React, { useState } from "react";
import { StyledHeading, ActionButton } from "../utils/styledComponents";
import LotOnRecord from "./LotOnRecord";
import { RadioGroupField } from "@aws-amplify/ui-react";
import classes from "./LotsOnRecord.module.css";

const LotsOnRecord = ({ data, handleReturn, handleCurrentLot, zone }) => {
  let lots = data.allEntries.filter((entry) => entry.zone === zone);
  lots = lots.map((entry) => entry.lot_name);
  lots = [...new Set(lots)];

  const [localValue, setLocalValue] = useState(lots[0]);

  const handleSelection = (e) => {
    console.log(e.target.value);
    setLocalValue(e.target.value);
  };
  return (
    <div className={classes["container"]}>
      <div className={classes["records-container"]}>
        <StyledHeading level={4}>Lotes registrados</StyledHeading>

        <RadioGroupField name="LotsOnRecord" size="large" fontWeight={"bold"}>
          {lots.map((lot) => (
            <LotOnRecord
              key={lot}
              name={lot}
              handleSelection={handleSelection}
              localValue={localValue}
            />
          ))}
        </RadioGroupField>
      </div>
      <div className={classes["button-container"]}>
        <ActionButton
          variation="primary"
          onClick={() => {
            handleCurrentLot(localValue);
          }}
        >
          Seleccionar
        </ActionButton>
        <ActionButton
          onClick={() => {
            handleReturn(true);
          }}
        >
          Regresar
        </ActionButton>
      </div>
    </div>
  );
};

export default LotsOnRecord;
