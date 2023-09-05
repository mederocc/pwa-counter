import React from "react";
import ReactDom from "react-dom";
import { ModalButton } from "../utils/styledComponents";

const MODAL_STYLES = {
  position: "fixed",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  backgroundColor: "#FFF",
  padding: "50px",
  zIndex: 1000,
  borderRadius: "6px",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  width: "22rem",
};

const OVERLAY_STYLES = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(0, 0, 0, .7)",
  zIndex: 1000,
};

const BUTTON_CONTAINER_STYLES = {
  display: "flex",
  flexDirection: "row",
  marginTop: "1rem",
};

export default function Modal({
  open,
  children,
  onClose,
  onConfirm,
  isConfirmationMessage,
  hideConfirm,
  isLoadingMessage,
}) {
  if (!open) return null;

  return ReactDom.createPortal(
    <>
      <div style={OVERLAY_STYLES} />
      <div style={MODAL_STYLES}>
        {children}
        {!isConfirmationMessage && !isLoadingMessage && (
          <div style={BUTTON_CONTAINER_STYLES}>
            <ModalButton onClick={onClose}>Cancelar</ModalButton>
            {!hideConfirm && (
              <ModalButton onClick={onConfirm}>Confirmar</ModalButton>
            )}
          </div>
        )}
      </div>
    </>,
    document.getElementById("portal")
  );
}
