import React, { useEffect } from "react";

export default function Modal({ show, ...props }) {
  const modalElement = document.getElementById("staticBackdrop");
  useEffect(() => {
    if (modalElement) {
      if (show) {
        modalElement.classList.add("show");
        modalElement.style.display = "block";
        const modal = new window.bootstrap.Modal(modalElement);
        modal.show();
      } else {
        modalElement.classList.remove("show");
        modalElement.style.display = "none";
      }
    }
  }, [show]);
  const CloseModal = () => {
    modalElement.style.display = "block";
  };
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
            <div className={`modal-header ${props.bgColor}`}>
              <h1 className="modal-title fs-5" id="staticBackdropLabel">
                {props.TitleMsg}
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                onClick={CloseModal}
              ></button>
            </div>
            <div className="modal-body">{props.ModalDesc}</div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
                onClick={CloseModal}
              >
                Ok
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
