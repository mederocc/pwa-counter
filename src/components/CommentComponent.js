import React from "react";
import { TextAreaField } from "@aws-amplify/ui-react";
import { StackedButton } from "../utils/styledComponents";

function CommentComponent({ isOpen, onOpen, comments, handleComments }) {
  return (
    <>
      <StackedButton variation="primary" onClick={onOpen}>
        Agregar comentarios
      </StackedButton>
      {isOpen && (
        <TextAreaField
          defaultValue={comments}
          onChange={handleComments}
          placeholder="Agregar comentarios (fuera de recuento)..."
        />
      )}
    </>
  );
}

export default CommentComponent;
