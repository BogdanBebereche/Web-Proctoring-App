import React, { Fragment } from "react";
import { Helmet } from "react-helmet";

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
