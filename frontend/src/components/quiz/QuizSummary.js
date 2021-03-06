import React, { Component, Fragment } from "react";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import Default from "../Default";
import axios from "axios";
const API = process.env.REACT_APP_API_BASEURL;
const config = {
  baseURL: `${API}`,
  withCredentials: true,
};

class QuizSummary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      score: 0,
      numberOfQuestions: 0,
      numberOfAnsweredQuestions: 0,
      correctAnswers: 0,
      wrongAnswers: 0,
      user: false,
      noCopyPaste: 0,
      noSpeech: 0,
      noTabSwitch: 0,
      noFace: 0,
      noTimeOut: 0,
      identification: false,
      faceMovement: false,
    };
  }

  async checkAuth() {
    try {
      let response = await axios.get(`/status`, config);
      console.log(response);
      if (response.status === 200) {
        this.setState({
          user: true,
        });
      } else if (response.status === 401) {
        this.setState({
          user: false,
        });
      }
    } catch (error) {
      console.log(error);
    }
  }

  componentDidMount() {
    const { state } = this.props.location;
    if (state) {
      this.setState({
        score: (state.score / state.numberOfQuestions) * 100,
        numberOfQuestions: state.numberOfQuestions,
        numberOfAnsweredQuestions: state.numberOfAnsweredQuestions,
        correctAnswers: state.correctAnswers,
        wrongAnswers: state.wrongAnswers,
        noCopyPaste: state.noCopyPaste,
        noSpeech: state.noSpeech,
        noTabSwitch: state.noTabSwitch,
        noFace: state.noFace,
        noTimeOut: state.noTimeOut,
        identification: state.identification,
        faceMovement: state.faceMovement,
      });
    }
  }

  componentWillMount() {
    this.checkAuth();
  }

  render() {
    const { state } = this.props.location;
    let stats, remark;
    const userScore = this.state.score;

    if (userScore <= 30) {
      remark = "You need more practice!";
    } else if (userScore > 30 && userScore <= 50) {
      remark = "Better luck next time!";
    } else if (userScore <= 70 && userScore > 50) {
      remark = "You can do better!";
    } else if (userScore >= 71 && userScore <= 84) {
      remark = "You did great!";
    } else {
      remark = "You're an absolute genius!";
    }

    if (state !== undefined) {
      stats = (
        <Fragment>
          <div style={{ textAlign: "center" }}>
            <span className="mdi mdi-check-circle-outline success-icon"></span>
          </div>
          <h1>Quiz finished</h1>
          <div className="container stats">
            <h4>{remark}</h4>
            <h2>Your Score: {this.state.score.toFixed(0)}&#37;</h2>
            <br />
            {/* <span className="stat left">Quiz results: </span>
            <br />
            <span className="stat left">Total number of questions: </span>
            <span className="right">{this.state.numberOfQuestions}</span>
            <br />
            <span className="stat left">Number of attempted questions: </span>
            <span className="right">
              {this.state.numberOfAnsweredQuestions}
            </span>
            <br />
            <span className="stat left">Number of Correct Answers: </span>
            <span className="right">{this.state.correctAnswers}</span> <br />
            <span className="stat left">Number of Wrong Answers: </span>
            <span className="right">{this.state.wrongAnswers}</span>
            <br />
            <br /> */}
            <span className="stat left">Proctoring results: </span>
            <br />
            <span className="stat left">Number of copy-paste attempts: </span>
            {this.state.noCopyPaste > 0 ? (
              <span className="right" style={{ color: "red" }}>
                {this.state.noCopyPaste}
              </span>
            ) : (
              <span className="right">{this.state.noCopyPaste}</span>
            )}
            <br />

            <span className="stat left">Number of words spoken </span>
            {this.state.noSpeech > 0 ? (
              <span className="right" style={{ color: "red" }}>
                {">0"}
              </span>
            ) : (
              <span className="right">{"0"}</span>
            )}
            <br />
            <span className="stat left">
              Number of times you switched tabs{" "}
            </span>
            {this.state.noTabSwitch > 0 ? (
              <span className="right" style={{ color: "red" }}>
                {this.state.noTabSwitch}
              </span>
            ) : (
              <span className="right">{this.state.noTabSwitch}</span>
            )}
            <br />
            <span className="stat left">Number of seconds out of tab </span>
            {this.state.noTimeOut > 0 ? (
              <span className="right" style={{ color: "red" }}>
                {this.state.noTimeOut}
              </span>
            ) : (
              <span className="right">{this.state.noTimeOut}</span>
            )}
            <br />
            <span className="stat left">Identification </span>
            {this.state.identification === false ? (
              <span className="right" style={{ color: "red" }}>
                {this.state.identification.toString()}
              </span>
            ) : (
              <span className="right">
                {this.state.identification.toString()}
              </span>
            )}
            <br />
            <span className="stat left">Face movement </span>
            {this.state.faceMovement === true ? (
              <span className="right" style={{ color: "red" }}>
                {this.state.faceMovement.toString()}
              </span>
            ) : (
              <span className="right">
                {this.state.faceMovement.toString()}
              </span>
            )}
            <br />
          </div>
          <section>
            <ul>
              <li>
                <Link to="/play/quiz">Play Again</Link>
              </li>
              <li>
                <Link to="/">Back to Home</Link>
              </li>
            </ul>
          </section>
        </Fragment>
      );
    } else {
      stats = (
        <section>
          <h1 className="no-stats">No Statistics Available</h1>
          <ul>
            <li>
              <Link to="/play/quiz">Take a Quiz</Link>
            </li>
            <li>
              <Link to="/">Back to Home</Link>
            </li>
          </ul>
        </section>
      );
    }
    return this.state.user ? (
      <Fragment>
        <Helmet>
          <title>Exam App - Summary</title>
        </Helmet>
        <div className="quiz-summary">{stats}</div>
      </Fragment>
    ) : (
      <Default />
    );
  }
}

export default QuizSummary;
