import React from "react";

export default function Spinner(props) {
  return (
    <div className="Spinner">
      {props.loadVisible && (
        <div className="d-flex justify-content-center">
          <div className="spinner-border text-danger"></div>
        </div>
      )}
    </div>
  );
}
