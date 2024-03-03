import React from "react";
import { Link } from "react-router-dom";
import homeBanner from "C:/Users/M Safi Ullah/Desktop/LeaveRequest/LeaveRequest/src/Images/homeBanner.png";

export const Home = () => {
  return (
    <div className="HomeBg">
      <div className="container ">
        <div className="row">
          <div className="col-6 content">
            <h1 className="mb-5">Seeking to Request a Leave.</h1>
            <Link to="/leave-request">
              <button className="btn btn-danger btn-lg">Request a Leave</button>
            </Link>
          </div>
          <div className="col-6 banner">
            <img src={homeBanner} />
          </div>
        </div>
      </div>
    </div>
  );
};
