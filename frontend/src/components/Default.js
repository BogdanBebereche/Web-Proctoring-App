import React, { Fragment } from "react";
import { Helmet } from "react-helmet";
import Button from "@material-ui/core/Button";
import Box from "@material-ui/core/Box";
const API = process.env.REACT_APP_API_BASEURL;
const Default = () => (
  <Fragment>
    <Helmet>
      <title>Not authenticated</title>
    </Helmet>
    <div className="instructions container">
      {/* <h1 href={`${API}login`}>Please log in!</h1> */}
      <h1>Please log in</h1>
      <br />
      <Box textAlign="center">
        <Button variant="contained" color="primary" href={`${API}login`}>
          Log in
        </Button>
      </Box>
    </div>
  </Fragment>
);

export default Default;
