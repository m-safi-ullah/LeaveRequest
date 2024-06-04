import React from "react";

export default function LocalSpinner(props) {
  return (
    <div className="localSpinner">
      {props.loadVisible && (
        <div className="d-flex justify-content-center">
          <div className="text-danger"></div>
        </div>
      )}
    </div>
  );
}
