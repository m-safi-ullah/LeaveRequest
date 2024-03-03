import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

export const CheckRequest = () => {
  const [requestData, setRequestData] = useState([]);

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const requestId = searchParams.get("requestID");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://localhost/api/submitLeaveRequest.php",
          {
            params: {
              requestId,
            },
          }
        );
        setRequestData(response.data.data);
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [requestId]);

  return (
    <div className="LeaveRequest">
      <div className="head">
        <h1 className="mb-3">Leave Request</h1>
      </div>
      <hr />
      {requestData &&
        requestData.map((data, index) => (
          <form className="row g-3 mt-1 leaveForm" key={index}>
            <div className="col-md-6">
              <label className="form-label">
                First Name<span>*</span>
              </label>
              <input
                type="text"
                value={data.FirstName}
                className="form-control"
                disabled
              />
            </div>
            <div className="col-md-6">
              <label className="form-label">
                Last Name<span>*</span>
              </label>
              <input
                type="text"
                className="form-control"
                value={data.LastName}
                disabled
              />
            </div>
            <div className="col-md-6">
              <label className="form-label">
                Email<span>*</span>
              </label>
              <input
                type="email"
                className="form-control"
                value={data.Email}
                disabled
              />
            </div>
            <div className="col-md-6">
              <label className="form-label">
                Leave Type<span>*</span>
              </label>
              <input
                type="text"
                className="form-control"
                value={data.LeaveType}
                disabled
              />
            </div>
            <div className="col-md-6">
              <label className="form-label">
                First day of absence<span>*</span>
              </label>
              <input
                type="text"
                className="form-control"
                value={data.FDate}
                disabled
              />
            </div>
            <div className="col-md-6">
              <label className="form-label">
                Last day of absence<span>*</span>
              </label>
              <input
                type="text"
                className="form-control"
                value={data.LDate}
                disabled
              />
            </div>
            <div className="col-12">
              <label className="form-label">No. of days requested</label>
              <input
                type="text"
                disabled
                className="form-control"
                value={
                  data.LDate && data.FDate
                    ? Math.ceil(
                        (new Date(data.LDate) - new Date(data.FDate)) /
                          (1000 * 60 * 60 * 24) +
                          1
                      )
                    : ""
                }
              />
            </div>
            <div className="col-md-6">
              <label className="form-label">
                Leave Approver<span>*</span>
              </label>
              <input
                type="text"
                disabled
                className="form-control"
                value={data.LeaveApprover}
              />
            </div>
            <div className="col-md-6">
              <label className="form-label">Attach Documents</label>
              <br />
              <Link to="/" target="_blank">
                <button className="btn btn-info w-100">Preview Document</button>
              </Link>
              <p>No Documents Attached</p>
            </div>
            <div className="col-12">
              <label className="form-label">Comments (optional)</label>
              <textarea
                className="form-control"
                rows="3"
                value={data.Comments}
                disabled
              />
            </div>
            <div className="col-12 mt-4">
              <button type="submit" className="btn btn-success p-2 w-50">
                Approve
              </button>
              <button type="submit" className="btn btn-danger p-2 w-50">
                Decline
              </button>
            </div>
          </form>
        ))}
    </div>
  );
};
