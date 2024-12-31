import React from "react";

const Modal = ({ title, showModal, onClose, children }) => {
  if (!showModal) return null; // Don't render the modal if `showModal` is false

  return (
    <div
      tabIndex="-1"
      role="dialog"
      aria-labelledby="modalLabel"
      aria-hidden={showModal ? "false" : "true"} // Correct aria-hidden usage
      className={`modal fade ${showModal ? "show d-block" : ""}`}
      style={{ display: showModal ? "block" : "none" }}
    >
      <div className="modal-dialog modal-dialog-centered" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="modalLabel">
              {title}
            </h5>
            <button
              type="button"
              className="btn-close"
              aria-label="Close"
              onClick={onClose}
            ></button>
          </div>
          <div className="modal-body">
            {/* Form Fields */}
            {/* Modal Content */}
            {children} {/* Render Register form inside the modal */}
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
