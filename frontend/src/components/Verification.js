import React, { Fragment, useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { Link as RouteLink } from "react-router-dom";
import Box from "@material-ui/core/Box";
import { makeStyles } from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress";
import axios from "axios";

const FLASK_API = "http://localhost:5000/";

const API = process.env.REACT_APP_API_BASEURL;

function Verification() {
  const verifyid = async () => {
    try {
      const response = await axios.get(`${FLASK_API}verifyid`);
      console.log(response.status);
      console.log(response.data);
      if (response.data === "IDENTIFIED") {
        // proctoringData.identification = true;
        // console.log(proctoringData.identification);
        alert("Identity confirmed");
      }
    } catch (error) {
      console.log(error);
      verifyid();
    }
  };
  verifyid();
  return (
    <div>
      <Fragment>
        <Helmet>
          <title>ID verification</title>
        </Helmet>
        <div className="instructions container">
          {/* <h1 href={`${API}login`}>Please log in!</h1> */}
          <h1>Verifying your ID...</h1>
          <br />
          <br />
          <br />
          <Box textAlign="center">
            <CircularProgress />
          </Box>
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <div>
            <span className="left">
              <RouteLink to="/">Go back to the Home Page</RouteLink>
            </span>

            <span className="right">
              <RouteLink to="/play/quiz">Start Exam</RouteLink>
            </span>
          </div>
        </div>
      </Fragment>
    </div>
  );
}

export default Verification;
