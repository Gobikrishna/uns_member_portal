import React from "react";

const Modal = ({ title, showModal, onClose, onSave, formData, handleChange }) => {
  if (!showModal) return null; // Don't render the modal if `showModal` is false

  return (
    <div
      className="modal fade show d-block"
      tabIndex="-1"
      role="dialog"
      aria-labelledby="modalLabel"
      aria-hidden="true"
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
            <div className="mb-3">
              <label htmlFor="sNo" className="form-label">
                S.No
              </label>
              <input
                type="text"
                className="form-control"
                id="sNo"
                name="sNo"
                value={formData.sNo}
                onChange={handleChange}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="memberId" className="form-label">
                Member ID
              </label>
              <input
                type="text"
                className="form-control"
                id="memberId"
                name="memberId"
                value={formData.memberId}
                onChange={handleChange}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="memberName" className="form-label">
                Member Name
              </label>
              <input
                type="text"
                className="form-control"
                id="memberName"
                name="memberName"
                value={formData.memberName}
                onChange={handleChange}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="mobileNumber" className="form-label">
                Mobile Number
              </label>
              <input
                type="text"
                className="form-control"
                id="mobileNumber"
                name="mobileNumber"
                value={formData.mobileNumber}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Close
            </button>
            <button type="button" className="btn btn-primary" onClick={onSave}>
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
