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
              <label htmlFor="firstName" className="form-label">
                First Name
              </label>
              <input
                type="text"
                className="form-control"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="lastName" className="form-label">
                Last Name
              </label>
              <input
                type="text"
                className="form-control"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
              />
            </div>
            {/* <div className="mb-3">
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
            </div> */}
            
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
            <div className="mb-3">
              <label htmlFor="sNo" className="form-label">
                Email
              </label>
              <input
                type="text"
                className="form-control"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
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
