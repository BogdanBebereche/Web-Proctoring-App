import React, { Fragment } from "react";
import { Helmet } from "react-helmet";
import Button from "@material-ui/core/Button";
import Box from "@material-ui/core/Box";
import { BrowserRouter, Link } from "react-router-dom"; // TODO: routing links
const API = process.env.REACT_APP_API_BASEURL;
const Default = () => (
  <Fragment>
    <Helmet>
      <title>Not found</title>
    </Helmet>
    <div className="instructions container">
      <h1>This link does not exist</h1>
    </div>
  </Fragment>
);

export default Default;
