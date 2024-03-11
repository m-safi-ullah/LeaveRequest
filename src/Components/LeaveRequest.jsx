import React, { useEffect, useState } from "react";
import axios from "axios";
import Spinner from "./Spinner";
import Modal from "./Modal";
import { useNavigate } from "react-router-dom";

export const LeaveRequest = () => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [empEmail, setempEmail] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [approverData, setApproverData] = useState([]);
  const [loadVisible, setloadVisible] = useState(false);
  const navigate = useNavigate();

  const UploadDocumentImg = (e) => {
    e.target.files[0];
  };

  const requestLeave = async (e) => {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);

    setloadVisible(true);

    await axios
      .post(
        `${window.location.origin}/api/leaveRequestDatafromapi.php`,
        formData
      )
      .then((response) => {
        setloadVisible(false);
        if (response.data.message === "Successfully") {
          setIsModalVisible(true);
        } else {
          setloadVisible(true);
        }
      });
  };

  useEffect(() => {
    const storedUsername = localStorage.getItem("Catering Employee Username");
    const storedPassword = localStorage.getItem("Catering Employee Password");
    setempEmail(storedUsername);
    if (!storedUsername && !storedPassword) {
      navigate("/employee-login");
    }
  }, [navigate]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${window.location.origin}/api/addapprover.php`
        );
        setApproverData(response.data.data);
      } catch (error) {
        console.error("Error fetching approvers:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="LeaveRequest">
      <Spinner loadVisible={loadVisible} />
      <Modal
        show={isModalVisible}
        bgColor={"bg-success"}
        TitleMsg={"Success"}
        ModalDesc={
          "Your leave request has been successfully submitted. We have received your information and will review it shortly."
        }
      />
      <div className="head">
        <h1 className="mb-3">Leave Application Form</h1>
        <p className="mb-3">
          Please fill out the form with all the necessary information. We will
          contact you shortly regarding the status of your leave request.
        </p>
      </div>
      <hr />

      <form
        className="row g-3 mt-1 leaveForm"
        onSubmit={requestLeave}
        encType="multipart/form-data"
      >
        <div className="col-md-6">
          <label className="form-label">
            First Name<span>*</span>
          </label>
          <input
            type="text"
            name="FirstName"
            className="form-control"
            placeholder="Enter first name"
            required
          />
        </div>
        <div className="col-md-6">
          <label className="form-label">
            Last Name<span>*</span>
          </label>
          <input
            type="text"
            name="LastName"
            className="form-control"
            placeholder="Enter last name"
            required
          />
        </div>
        <div className="col-md-6">
          <label className="form-label">
            Email<span>*</span>
          </label>
          <input
            type="email"
            name="Email"
            value={empEmail}
            readOnly
            className="form-control"
            placeholder="Enter email"
            required
          />
        </div>
        <div className="col-md-6">
          <label className="form-label">
            Leave Type<span>*</span>
          </label>
          <select className="form-select" name="LeaveType">
            <option value="Annual Leave">Annual Leave</option>
            <option value="Sick Leave">Sick Leave</option>
            <option value="Carers Leave">Carers Leave</option>
            <option value="Compassionate Leave">Compassionate Leave</option>
            <option value="Unpaid Parental Leave">Unpaid Parental Leave</option>
          </select>
        </div>
        <div className="col-md-6">
          <label className="form-label">
            First Day of Absence<span>*</span>
          </label>
          <input
            type="date"
            name="FDate"
            className="form-control"
            value={startDate}
            onChange={(e) => {
              setStartDate(e.target.value);
            }}
            required
          />
        </div>
        <div className="col-md-6">
          <label className="form-label">
            Last Day of Absence<span>*</span>
          </label>
          <input
            type="date"
            className="form-control"
            name="LDate"
            value={endDate}
            onChange={(e) => {
              setEndDate(e.target.value);
            }}
            required
          />
        </div>
        <div className="col-12">
          <label className="form-label">No. of days requested</label>
          <input
            type="text"
            disabled
            name="TDate"
            className="form-control"
            placeholder="Automatically populated upon date selection."
            value={
              endDate && startDate
                ? Math.ceil(
                    (new Date(endDate) - new Date(startDate)) /
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
          <select className="form-select" name="LeaveApprover">
            {approverData.map((element, index) => (
              <option key={index} value={element.approverEmail}>
                {element.approverName}
              </option>
            ))}
          </select>
        </div>
        <div className="col-md-6">
          <label className="form-label">Attach Documents</label>
          <input
            type="file"
            onChange={UploadDocumentImg}
            className="form-control"
            name="DocumentImg"
          />
        </div>
        <div className="col-12">
          <label className="form-label">Comments (optional)</label>
          <textarea
            className="form-control"
            rows="3"
            placeholder="Add reason here"
            name="Comments"
          />
        </div>
        <div className="col-12 mt-4">
          <button type="submit" className="btn btn-danger p-2 w-100">
            Submit Request
          </button>
        </div>
      </form>
    </div>
  );
};
