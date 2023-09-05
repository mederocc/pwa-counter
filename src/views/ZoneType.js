import React, { useState } from "react";
import styles from "./ZoneType.module.css";
import { ActionButton, StyledHeading } from "../utils/styledComponents";
import { RadioGroupField, Radio } from "@aws-amplify/ui-react";

function ZoneType({ handleCheckbox, children, isLoading }) {
  const [localType, setLocalType] = useState("Commercial");

  const handleSelection = (e) => {
    setLocalType(e.target.value);
  };

  return (
    <div className={styles["zone-container"]}>
      <div className={styles.top}>
        <StyledHeading level={4}>{children}</StyledHeading>
        {!isLoading && (
          <div className={styles["button-container"]}>
            <RadioGroupField name="Tipos" size="large" fontWeight={"bold"}>
              <Radio
                className={styles.button}
                onChange={handleSelection}
                checked={localType === "Commercial"}
                value="Commercial"
              >
                Comercial
              </Radio>
              <Radio
                className={styles.button}
                onChange={handleSelection}
                checked={localType === "Foundation"}
                value="Foundation"
              >
                Fundadora
              </Radio>
            </RadioGroupField>
          </div>
        )}
      </div>
      <div className={styles["bottom-buttons"]}>
        <ActionButton
          variation="primary"
          onClick={() => {
            handleCheckbox(localType);
          }}
        >
          Confirmar
        </ActionButton>
      </div>
    </div>
  );
}

export default ZoneType;
