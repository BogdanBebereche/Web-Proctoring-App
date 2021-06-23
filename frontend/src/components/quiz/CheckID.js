import React, { Fragment } from "react";
import Webcam from "react-webcam";
import { Helmet } from "react-helmet";
import { BrowserRouter, Link as RouteLink } from "react-router-dom";
import { Link } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import PhotoIcon from "@material-ui/icons/Photo";
import axios from "axios";

const API = process.env.REACT_APP_API_BASEURL;
const FLASK_API_PHOTO = "http://localhost:5000/photo";
const TakePhoto = () => {
  axios.get(`${FLASK_API_PHOTO}`);
};

const CheckID = () => (
  <Fragment>
    <Helmet>
      <title>Check ID</title>
    </Helmet>
    <div className="instructions container">
      <h1>Check your ID</h1>
      <br />
      <div className="camera">
        <Webcam width="400px" />
        <br />
        <br />
        <Button
          variant="contained"
          color="primary"
          size="small"
          startIcon={<PhotoIcon />}
          onClick={TakePhoto}
        >
          Take photo
        </Button>
      </div>
      <br />
      <br />
      <br />
      <div>
        <span className="left">
          <RouteLink to="/">Go back to the Home Page</RouteLink>
        </span>

        <span className="right">
          <BrowserRouter>
            <Link button href={`${API}login`}>
              Start exam
            </Link>
          </BrowserRouter>
        </span>
      </div>
    </div>
  </Fragment>
);

export default CheckID;
