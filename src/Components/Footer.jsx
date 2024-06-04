import React from "react";
import logo from "../Images/logo.png";
import { Link } from "react-router-dom";

export const Footer = () => {
  return (
    <footer className="bg-dark text-white position-relative bottom-0 footer p-3">
      <div className="text-center">
        <Link to="/">
          <img src={logo} className="footerLogo" />
        </Link>
      </div>
      <hr />
      <div className="container position-relative p-2">
        <div className="row">
          <div className="col-6">CIHO © 2022. All Rights Reserved.</div>
          <div className="col-6 text-end">
            <span>Follow Us: </span>
            <Link to="https://www.instagram.com/catering_industries/?hl=en">
              <i className="fa-brands fa-instagram"></i>
            </Link>
            <Link to="https://www.linkedin.com/company/catering-industries/">
              <i className="fa-brands fa-linkedin-in"></i>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
