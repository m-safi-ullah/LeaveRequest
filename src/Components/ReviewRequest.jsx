import axios from "axios";
import React, { useEffect, useState } from "react";
import Modal from "./Modal";
import { Form, Link, useLocation } from "react-router-dom";
import Spinner from "./Spinner";

export const ReviewRequest = () => {
  const [requestData, setRequestData] = useState([]);
  const [btnDisable, setBtnDisable] = useState(true);
  const [DocumentsBtn, setDocumentsBtn] = useState({ display: "none" });
  const [Documents, setDocuments] = useState({ display: "none" });

  const [isModalVisible, setisModalVisible] = useState();
  const [alertComp, setalertComp] = useState({ display: "none" });
  const [Rejecttext, setRejecttext] = useState();

  const [loadVisible, setloadVisible] = useState(false);

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const requestId = searchParams.get("requestId");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${window.location.origin}/api/leaveRequestDatafromapi.php`,
          {
            params: {
              requestId,
            },
          }
        );
        setRequestData(response.data.data);
        if (response.data.data[0].ButtonType === "Enable") {
          setBtnDisable(false);
        } else {
          setBtnDisable(true);
        }

        if (response.data.data[0].DocumentImg) {
          setDocumentsBtn({ display: "block" });
          setDocuments({ display: "none" });
        } else {
          setDocumentsBtn({ display: "none" });
          setDocuments({ display: "block" });
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
        `${window.location.origin}/api/approveLeaveRequestDatafromapi.php`,
        {
          FirstName: requestData[0].FirstName,
          Email: requestData[0].Email,
        },
        {
          params: {
            requestId,
          },
        }
      );
      setloadVisible(false);
      if (response.data.status === 1) {
        setisModalVisible(true);
        setBtnDisable(true);
        console.log("Successfully updated");
      } else {
        console.log("Failed to update");
      }
    } catch (error) {
      console.error("Error updating data:", error);
    }
  };

  const DeclineBtnResponse = () => {
    setalertComp({ display: "block" });
  };

  const handlePreviewClick = (e) => {
    e.preventDefault();
    const previewUrl = `${window.location.origin}/api/uploads/${requestData[0].DocumentImg}`;
    window.open(previewUrl, "_blank");
  };

  const SubmitResponse = async (e) => {
    e.preventDefault();
    console.log("Safi:::", Rejecttext);
    try {
      const response = await axios.post(
        `${window.location.origin}/api/declineLeaveRequestDatafromapi.php`,
        {
          Rejecttext: Rejecttext,
          FirstName: requestData[0].FirstName,
          Email: requestData[0].Email,
        },
        {
          params: {
            requestId: requestId,
          },
        }
      );

      setalertComp({ display: "none" });
      if (response.data.status === 1) {
        setisModalVisible(true);
        setBtnDisable(true);
        console.log("Successfully updated");
      } else {
        console.log("Failed to update");
      }
    } catch (error) {
      console.error("Error updating data:", error);
    }
  };

  return (
    <div className="LeaveRequest">
      <Spinner loadVisible={loadVisible} />
      <Modal
        show={isModalVisible}
        bgColor={"bg-success"}
        TitleMsg={"Success"}
        ModalDesc={"Thanks for Sharing Your Response!"}
      />
      <div
        className="alert alert-light reviewalertComp"
        role="alert"
        style={alertComp}
      >
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
      <div className="head">
        <h1 className="mb-3">Leave Request</h1>
        <p className="mb-3">
          Kindly review the request and indicate your decision by selecting the
          "Approve" or "Reject" button.
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
              {/* <img
                src={`${window.location.origin}/api/uploads/${requestData[0].DocumentImg}`}
                className="DocumentsImg"
                alt="Documents"
                onClick={handlePreviewClick}
              /> */}
              {/* <div onClick={handlePreviewClick}>
                <iframe
                  src={`${window.location.origin}/api/uploads/${requestData[0].DocumentImg}`}
                  className="DocumentsImg"
                />
              </div> */}
              <p style={Documents}>No Documents Attached</p>
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
                Reject
              </button>
            </div>
          </form>
        ))}
    </div>
  );
};
