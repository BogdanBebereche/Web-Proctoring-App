import React, { Fragment, useState } from "react";
import Webcam from "react-webcam";
import { Helmet } from "react-helmet";
import { BrowserRouter, Link as RouteLink } from "react-router-dom";
import { Link } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import CameraAlt from "@material-ui/icons/CameraAlt";
import ReplayIcon from "@material-ui/icons/Replay";
import axios from "axios";
const API = process.env.REACT_APP_API_BASEURL;
const FLASK_API_PHOTO = "http://localhost:5000/photo";

function CheckID() {
  const [webc, setWebc] = useState(true);
  const [next, setNext] = useState(false);
  const TakePhoto = () => {
    axios.get(`${FLASK_API_PHOTO}`);
    setWebc(!webc);
    setNext(!next);
  };
  const ResetPhoto = () => {
    setWebc(!webc);
    window.location.reload(false);
  };

  return (
    <Fragment>
      <Helmet>
        <title>Check ID</title>
      </Helmet>
      <div className="instructions container">
        <h1>Check your ID</h1>
        <br />
        <div className="camera">
          {webc ? (
            <Webcam width="400px" />
          ) : (
            <h1>You have succesfully taken a photo, please continue</h1>
          )}
          <br />
          <br />
          {webc ? (
            <Button
              variant="contained"
              color="primary"
              size="small"
              startIcon={<CameraAlt />}
              onClick={TakePhoto}
            >
              Take photo
            </Button>
          ) : (
            <Button
              variant="contained"
              color="primary"
              size="small"
              startIcon={<ReplayIcon />}
              onClick={ResetPhoto}
            >
              I want to retake the photo
            </Button>
          )}
        </div>
        <br />
        <br />
        <br />
        <div>
          <span className="left">
            <RouteLink to="/">Go back to the Home Page</RouteLink>
          </span>

          <span className="right">
            {next ? (
              <BrowserRouter>
                <Link button href={`${API}login`}>
                  Start exam
                </Link>
              </BrowserRouter>
            ) : (
              <p>Take a photo first</p>
            )}
          </span>
        </div>
      </div>
    </Fragment>
  );
}

export default CheckID;
