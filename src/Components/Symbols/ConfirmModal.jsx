import React from "react";

export default function ConfirmModal({
  modalIcon,
  modalId,
  modalDesc,
  deleteRecord,
}) {
  return (
    <span className="px-2">
      <i
        className={`fa-solid ${modalIcon} text-danger fs-5`}
        title="Delete"
        data-bs-toggle="modal"
        data-bs-target={`#${modalId}`}
      ></i>

      <div
        className="modal fade"
        id={modalId}
        tabIndex="-1"
        aria-labelledby={`${modalId}Label`}
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id={`${modalId}Label`}>
                Confirm
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">{modalDesc}</div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-danger"
                onClick={deleteRecord}
                data-bs-dismiss="modal"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      </div>
    </span>
  );
}
