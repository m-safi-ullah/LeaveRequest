import React from "react";
import { Link } from "react-router-dom";
import homeBanner from "../Images/homeBanner.png";
import { Carousel } from "react-bootstrap";
import slider1 from "../Images/slider1.jpg";
import slider2 from "../Images/slider2.jpg";
import slider3 from "../Images/slider3.jpg";

const banners = [
  {
    src: slider1,
    title: "Food Services",
    alt: "Slider1",
  },
  {
    src: slider2,
    title: "Laundry Management",
    alt: "Slider2",
  },
  {
    src: slider3,
    title: "Aged Care Cleaning",
    alt: "Slider3",
  },
];
export default function Home() {
  return (
    <div className="HomeBg p-4">
      <div className="container d-flex">
        <div className="row align-items-center py-3">
          <div className="col-12 col-md-6 content text-center text-md-start">
            <h2>Leave Request Portal.</h2>
            <p>
              Easily apply and manage your leave requests with a few clicks.
            </p>
            <Link to="/leave-request">
              <button className="btn btn-danger mt-3">
                Request a Leave{" "}
                <i className="fa-solid fa-circle-arrow-right mx-2" />
              </button>
            </Link>
          </div>
          <div className="col-12 col-md-6 banner mt-5 mt-md-0">
            <img src={homeBanner} alt="Home Banner" className="img-fluid" />
          </div>
        </div>
      </div>
      <div className="container my-5">
        <h2 className="text-center my-3">Catering Industries</h2>
        <Carousel className="Slider carousel-fade">
          {banners.map((banner, index) => {
            return (
              <Carousel.Item key={index}>
                <div
                  className="d-block w-100 "
                  style={{
                    backgroundImage: `url(${banner.src})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    height: "400px",
                  }}
                  aria-label={banner.alt}
                >
                  <h2 className="sliderTitle">{banner.title}</h2>
                  <div className="sliderImg"></div>
                </div>
              </Carousel.Item>
            );
          })}
        </Carousel>
      </div>
    </div>
  );
}
