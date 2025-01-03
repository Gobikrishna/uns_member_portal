import React from "react";

const Modal = ({ pageTitle, showModal, onClose, children }) => {
  if (!showModal) return null; // Don't render the modal if `showModal` is false

  return (
    <>
      {/* Lightbox Background */}
      <div className={`modal-backdrop ${showModal ? "show" : ""}`}></div>

      {/* Modal Content */}
      <div
        tabIndex="-1"
        role="dialog"
        aria-labelledby="modalLabel"
        aria-hidden={showModal ? "false" : "true"}
        className={`modal fade ${showModal ? "show d-block" : ""}`}
        style={{ display: showModal ? "block" : "none" }}
      >
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="modalLabel">
                <h4 className=" text-center mb-2">
                  {pageTitle || "Add New Member"}
                </h4>
              </h5>
              <button
                type="button"
                className="btn-close"
                aria-label="Close"
                onClick={onClose}
              ></button>
            </div>
            <div className="modal-body">
              {/* Render Register form or any other content inside the modal */}
              {children}
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
    </>
  );
};

export default Modal;
