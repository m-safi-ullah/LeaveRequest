import axios from "axios";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export const EmployeeReview = () => {
  const [requestData, setRequestData] = useState([]);
  const [DocumentsBtn, setDocumentsBtn] = useState({ display: "none" });
  const [Documentstext, setDocumentstext] = useState({ display: "none" });

  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const requestId = searchParams.get("requestId");

  useEffect(() => {
    const storedUsername = localStorage.getItem("Catering Employee Username");
    const storedPassword = localStorage.getItem("Catering Employee Password");

    if (!storedUsername && !storedPassword) {
      navigate("/employee-login");
    }
  }, [navigate]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${window.location.origin}/api/leaveRequestDatafromapi.php`,
          {
            params: {
              requestId,
              portal: "Approver",
            },
          }
        );
        setRequestData(response.data.data);

        if (response.data.data[0].DocumentImg === "Empty") {
          setDocumentsBtn({ display: "none" });
          setDocumentstext({ display: "block" });
        } else {
          setDocumentsBtn({ display: "block" });
          setDocumentstext({ display: "none" });
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [requestId]);

  const handlePreviewClick = (e) => {
    e.preventDefault();
    const previewUrl = `${window.location.origin}/api/uploads/${requestData[0].DocumentImg}`;
    window.open(previewUrl, "_blank");
  };

  return (
    <div className="LeaveRequest">
      <div className="head">
        <h1 className="mb-3">Review Request</h1>
        <p className="mb-3">
          Dear Employee, kindly review the response from management sent to your
          email.
        </p>
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
                First Day of Absence<span>*</span>
              </label>
              <input
                type="text"
                className="form-control"
                value={new Date(data.FDate).toLocaleDateString("en-US", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
                disabled
              />
            </div>
            <div className="col-md-6">
              <label className="form-label">
                Last Day of Absence<span>*</span>
              </label>
              <input
                type="text"
                className="form-control"
                value={new Date(data.LDate).toLocaleDateString("en-US", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
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
                      ) + " Days"
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
              <label className="form-label">Attached Documents</label>
              <br />
              <button
                className="btn btn-info w-100 DocumentsImg"
                style={DocumentsBtn}
                onClick={handlePreviewClick}
              >
                Preview Attached Document
              </button>

              <p style={Documentstext}>No Documents Attached</p>
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
          </form>
        ))}
    </div>
  );
};
