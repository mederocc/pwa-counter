import React from "react";
import { StyledButton } from "../utils/styledComponents";

function Zone(props) {
  const { handleClick } = props;

  return (
    <StyledButton
      variation="primary"
      onClick={() => {
        handleClick("zone", props.zone);
      }}
    >
      {props.zone}
    </StyledButton>
  );
}

export default Zone;
