import React, { useEffect } from "react";

export default function ConfirmModal({ isVisible, ...props }) {
  useEffect(() => {
    const modalElement = document.getElementById("staticBackdrop");
    if (modalElement) {
      if (isVisible) {
        modalElement.classList.add("isVisible");
        modalElement.style.display = "block";
        const modal = new window.bootstrap.Modal(modalElement);
        modal.show();
      } else {
        modalElement.classList.remove("isVisible");
        modalElement.style.display = "none";
      }
    }
  }, [isVisible]);

  return (
    <div>
      <div
        className="modal fade"
        id="staticBackdrop"
        data-bs-backdrop="static"
        data-bs-keyboard="false"
        tabIndex="-1"
        aria-labelledby="staticBackdropLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div>
              <h1 className="modal-title fs-5" id="staticBackdropLabel">
                {props.title}
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                onClick={props.close}
              ></button>
            </div>
            <div className="modal-body">{props.description}</div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
                onClick={props.Close}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-success"
                data-bs-dismiss="modal"
                onClick={props.Confirm}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
