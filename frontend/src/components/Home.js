import React, { Fragment } from "react";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";

const Home = () => (
  <Fragment>
    <Helmet>
      <title>Home - Exam</title>
    </Helmet>
    <div id="home">
      <section>
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
        <div className="auth-container">
          <Link to="/login" className="auth-buttons" id="login-button">
            Login
          </Link>
          <Link to="/register" className="auth-buttons" id="signup-button">
            Sign up
          </Link>
        </div>
      </section>
    </div>
  </Fragment>
);

export default Home;
