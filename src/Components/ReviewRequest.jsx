import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Spinner from "./Symbols/Spinner";

export const ReviewRequest = () => {
  const [requestData, setRequestData] = useState([]);
  const [btnDisable, setBtnDisable] = useState(true);
  const [DocumentsBtn, setDocumentsBtn] = useState({ display: "none" });
  const [Documentstext, setDocumentstext] = useState({ display: "none" });

  const [alertComp, setalertComp] = useState(false);
  const [Rejecttext, setRejecttext] = useState();

  const [loadVisible, setloadVisible] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const requestId = searchParams.get("requestId");

  useEffect(() => {
    const storedUsername = localStorage.getItem("Catering Approver Username");
    const storedPassword = localStorage.getItem("Catering Approver Password");

    if (!storedUsername && !storedPassword) {
      navigate("/approver-login");
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
        if (response.data.data[0].ButtonType === "Enable") {
          setBtnDisable(false);
        } else {
          setBtnDisable(true);
        }

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

  const ApproveBtnResponse = async () => {
    try {
      setloadVisible(true);
      const response = await axios.post(
        `${window.location.origin}/api/responseLeaveRequest.php`,
        requestData[0],
        {
          params: {
            requestId,
            Response: "Approve",
          },
        }
      );
      setloadVisible(false);
      if (response.data.status === 1) {
        setBtnDisable(true);
        window.location.href = `${window.location.origin}/approver-panel`;
      } else {
        console.log("Failed to update");
      }
    } catch (error) {
      console.error("Error updating data:", error);
    }
  };

  const DeclineBtnResponse = () => {
    setalertComp(true);
  };

  const SubmitResponse = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${window.location.origin}/api/responseLeaveRequest.php`,
        {
          Rejecttext: Rejecttext,
          FirstName: requestData[0].FirstName,
          Email: requestData[0].Email,
        },
        {
          params: {
            requestId: requestId,
            Response: "Decline",
          },
        }
      );
      setalertComp(false);
      if (response.data.status === 1) {
        setBtnDisable(true);
        console.log("Successfully updated");
        window.location.href = `${window.location.origin}/approver-panel`;
      } else {
        console.log("Failed to update");
      }
    } catch (error) {
      console.error("Error updating data:", error);
    }
  };

  const handlePreviewClick = (e) => {
    e.preventDefault();
    const previewUrl = `${window.location.origin}/api/uploads/${requestData[0].DocumentImg}`;
    window.open(previewUrl, "_blank");
  };

  return (
    <div className="LeaveRequest">
      <Spinner loadVisible={loadVisible} />
      {alertComp && (
        <div className="alert alert-light reviewalertComp" role="alert">
          <form onSubmit={SubmitResponse}>
            <h3>Reason of Rejection</h3>
            <textarea
              className="form-control mt-3"
              placeholder="Please enter the reason of rejection"
              value={Rejecttext}
              onChange={(e) => {
                setRejecttext(e.target.value);
              }}
              required
            ></textarea>
            <input
              type="submit"
              className="btn btn-danger mt-2 w-100"
              value="Submit"
            />
          </form>
        </div>
      )}
      <div className="head">
        <h1 className="mb-3">Review Request</h1>
        <p className="mb-3">
          Kindly review the request and indicate your decision by selecting the
          "Approve" or "Decline" button.
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
                value={data.TDate}
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
            {data.Comments !== "" ? (
              <div className="col-12">
                <label className="form-label">Comments</label>
                <textarea
                  className="form-control"
                  rows="3"
                  value={data.Comments}
                  disabled
                />
              </div>
            ) : (
              ""
            )}
            <div className="col-12 mt-4">
              <button
                type="button"
                className="btn btn-success p-2 w-50"
                onClick={ApproveBtnResponse}
                disabled={btnDisable}
              >
                Approve
              </button>
              <button
                type="button"
                className="btn btn-danger p-2 w-50"
                onClick={DeclineBtnResponse}
                disabled={btnDisable}
              >
                Decline
              </button>
            </div>
          </form>
        ))}
    </div>
  );
};
