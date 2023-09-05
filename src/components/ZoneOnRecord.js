import React from "react";
import { Radio } from "@aws-amplify/ui-react";

const ZoneOnRecord = ({ name, handleSelection, localValue }) => {
  return (
    <Radio
      onChange={handleSelection}
      checked={localValue === name}
      value={name}
    >
      {`Zona ${name.toUpperCase()}`}
    </Radio>
  );
};

export default ZoneOnRecord;
