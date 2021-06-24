import React, { Fragment } from "react";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
const API = process.env.REACT_APP_API_BASEURL;
const Home = () => (
  <Fragment>
    <Helmet>
      <title>Home - Exam</title>
    </Helmet>
    <div id="home">
      <section>
        <br />
        <br />
        <br />
        <br />
        <h1>Exam App</h1>
        <br />
        <br />
        <div className="play-button-container">
          <ul>
            <li>
              <Link className="play-button" to="/play/instructions">
                Play
              </Link>
            </li>
          </ul>
        </div>
      </section>
    </div>
  </Fragment>
);

export default Home;
