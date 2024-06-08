import React from "react";

export default function Spinner(props) {
  return (
    <div>
      {props.loadVisible && (
        <div className="Spinner">
          <div className="spinnerMover d-flex justify-content-center">
            <div className="spinner-border text-danger"></div>
          </div>
        </div>
      )}
    </div>
  );
}
