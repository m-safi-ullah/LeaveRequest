import React from "react";
import { Link } from "react-router-dom";

export const Tabs = () => {
  return (
    <div className="container">
      <div className="row">
        <div className="col-12">
          <div>
            <ul className="nav nav-tabs">
              <li className="nav-item">
                <Link
                  className="nav-link active"
                  to="#all"
                  data-bs-toggle="tab"
                >
                  All Products
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="#latest" data-bs-toggle="tab">
                  Latest
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="#popular" data-bs-toggle="tab">
                  popular
                </Link>
              </li>
            </ul>
            <div className="tab-content">
              <div id="all" className="active tab-pane fade in show">
                <h1>products</h1>
              </div>
              <div id="latest" className="tab-pane fade">
                <h1>products1</h1>
              </div>
              <div id="popular" className="tab-pane fade">
                <h1>products2</h1>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
