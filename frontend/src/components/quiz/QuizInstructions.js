import React, { Fragment } from "react";

import { Helmet } from "react-helmet";
import { BrowserRouter, Link as RouteLink } from "react-router-dom"; // TODO: routing links
import { Link } from "@material-ui/core";

const REACT_API = process.env.REACT_APP_BASEURL;

const QuizInstructions = () => (
  <Fragment>
    <Helmet>
      <title>Exam Instructions</title>
    </Helmet>
    <div className="instructions container">
      <h1>Instructions for the Exam</h1>
      <br />
      <ul className="browser-default" id="main-list">
        <li>The exam has a duration of maximum 15 minutes.</li>

        <li>The timer starts as soon as the game loads.</li>
        <li>The grade will be revealed at the end.</li>
      </ul>
      <br />
      <h1>The student must have:</h1>
      <ul className="browser-default" id="main-list">
        <li>Any type of ID</li>
        <li>A front facing camera</li>
        <li>A microphone</li>
      </ul>

      <p>
        The student must make sure he is visible on the camera and must be in a
        quiet enviroment
      </p>
      <br />
      <br />
      <div>
        <span className="left">
          <RouteLink to="/">Go back to the Home Page</RouteLink>
        </span>

        <span className="right">
          <RouteLink to="/play/checkid">Check ID</RouteLink>
        </span>
      </div>
    </div>
  </Fragment>
);

export default QuizInstructions;
