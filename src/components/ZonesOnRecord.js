import React, { useState } from "react";
import { StyledHeading, ActionButton } from "../utils/styledComponents";
import ZoneOnRecord from "./ZoneOnRecord";
import { RadioGroupField } from "@aws-amplify/ui-react";
import classes from "./LotsOnRecord.module.css";

const ZonesOnRecord = ({ data, handleReturn, handleCurrentZone }) => {
  let zones = data.allEntries.map((entry) => entry.zone);
  zones = [...new Set(zones)];
  const [localValue, setLocalValue] = useState(zones[0]);

  const handleSelection = (e) => {
    console.log(e.target.value);
    setLocalValue(e.target.value);
  };
  return (
    <>
      <div className={classes["container"]}>
        <div className={classes["records-container"]}>
          <StyledHeading level={4}>Zonas registradas</StyledHeading>

          <RadioGroupField
            name="ZonesOnRecord"
            size="large"
            fontWeight={"bold"}
          >
            {zones.map((zone) => (
              <ZoneOnRecord
                key={zone}
                name={zone}
                handleSelection={handleSelection}
                localValue={localValue}
              />
            ))}
          </RadioGroupField>
        </div>
      </div>
      <div className={classes["button-container"]}>
        <ActionButton
          variation="primary"
          onClick={() => {
            handleCurrentZone(localValue);
          }}
        >
          Seleccionar
        </ActionButton>
        <ActionButton
          onClick={() => {
            handleReturn();
          }}
        >
          Regresar
        </ActionButton>
      </div>
    </>
  );
};

export default ZonesOnRecord;
