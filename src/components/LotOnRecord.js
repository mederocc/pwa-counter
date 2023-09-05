import React from "react";
import { Radio } from "@aws-amplify/ui-react";

const LotOnRecord = ({ name, handleSelection, localValue }) => {
  return (
    <Radio
      onChange={handleSelection}
      checked={localValue === name}
      value={name}
    >
      {name}
    </Radio>
  );
};

export default LotOnRecord;
