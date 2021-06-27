import React, { Component, Fragment, useReducer } from "react";
import { Helmet } from "react-helmet";
import classnames from "classnames";
import M, { toast } from "materialize-css";
import questions from "../../questions.json";
import isEmpty from "../../utils/is-empty";
import Default from "../Default";
import axios from "axios";
const API = "http://localhost:3002/";
const FLASK_API = "http://localhost:5000/";

const config = {
  baseURL: `${API}`,
  withCredentials: true,
};

const config_FLASK = {
  baseURL: `${FLASK_API}`,
  withCredentials: true,
};

const proctoringData = {
  noCopyPaste: 0,
  noSpeech: 0,
  noTabSwitch: 0,
  noFace: 0,
  noTimeOut: 0,
  score: 0,
  identification: false,
};

class Play extends Component {
  constructor(props) {
    super(props);
    this.state = {
      questions,
      currentQuestion: {},
      nextQuestion: {},
      previousQuestion: {},
      answer: "",
      numberOfQuestions: 0,
      numberOfAnsweredQuestions: 0,
      currentQuestionIndex: 0,
      score: 0,
      correctAnswers: 0,
      wrongAnswers: 0,
      nextButtonDisabled: false,
      previousButtonDisabled: true,
      previousRandomNumbers: [],
      time: {},
      user: false,
      form: proctoringData,
      functionHandler: true,
    };
    this.interval = null;
    this.focus = this.focus.bind(this);
    this.handlerCopy = this.handlerCopy.bind(this);
    this.record = this.record.bind(this);
  }

  handlerCopy(e) {
    e.preventDefault();
    e.nativeEvent.stopImmediatePropagation();
    proctoringData.noCopyPaste = proctoringData.noCopyPaste + 1;
    alert("You cannot copy exam's content!");
  }

  focusListener() {
    // document.title = document.visibilityState;
    // console.log(document.visibilityState);

    if (document.hidden) {
      proctoringData.noTabSwitch = proctoringData.noTabSwitch + 1;
      alert("The exam is not focused, this is a warning!");

      let checkInterval = setInterval(() => {
        if (document.hidden) {
          proctoringData.noTimeOut = proctoringData.noTimeOut + 1;
        }
      }, 1000);
    }
  }

  focus() {
    document.addEventListener("visibilitychange", this.focusListener);
  }

  recordListener(e) {
    var text = Array.from(e.results)
      .map((result) => result[0])
      .map((result) => result.transcript)
      .join("");
    console.log(text);
    var noWords = text.split(" ").length;
    if (noWords > 0) {
      M.toast({
        html: "You are not allowed to talk during the quiz!",
        classes: "toast-invalid",
        displayLength: 1500,
      });
    }
    let checkRecord = setInterval(() => {
      if (noWords > 0) {
        proctoringData.noSpeech = text.split(" ").length;
      }
    }, 3000);
  }

  record() {
    window.SpeechRecognition =
      window.speechRecognition || window.webkitSpeechRecognition;
    const recognition = new window.SpeechRecognition();
    recognition.interimResults = true;
    recognition.continuous = true;
    recognition.addEventListener("result", this.recordListener);
    recognition.start();
    return recognition;
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

  //TODO Do not forget I put the focus check functionality here, may need to move
  componentDidMount() {
    const { questions, currentQuestion, nextQuestion, previousQuestion } =
      this.state;
    this.displayQuestions(
      questions,
      currentQuestion,
      nextQuestion,
      previousQuestion
    );
    this.startTimer();
    this.focus();
    this.record();

    const verifyid = async () => {
      try {
        const response = await axios.get(`${FLASK_API}verifyid`);
        console.log(response.status);
        console.log(response.data);
        if (response.data === "IDENTIFIED") {
          proctoringData.identification = true;
          console.log(proctoringData.identification);
          alert("Identity confirmed");
          verifyExam();
        }
      } catch (error) {
        console.log(error);
        verifyid();
      }
    };
    verifyid();

    console.log("NOW VERIFY EXAM");
    const verifyExam = async () => {
      try {
        const res = await axios.get(`${FLASK_API}`);
      } catch (error) {
        console.log(error);
      }
    };
  }

  componentWillUnmount() {
    clearInterval(this.interval);
    document.removeEventListener("visibilitychange", this.focusListener);
    //document.removeEventListener("result", this.recordListener);
    this.record().removeEventListener("result", this.recordListener);
  }

  componentWillMount() {
    this.checkAuth();
  }

  displayQuestions = (
    questions = this.state.questions,
    currentQuestion,
    nextQuestion,
    previousQuestion
  ) => {
    let { currentQuestionIndex } = this.state;
    if (!isEmpty(this.state.questions)) {
      questions = this.state.questions;
      currentQuestion = questions[currentQuestionIndex];
      nextQuestion = questions[currentQuestionIndex + 1];
      previousQuestion = questions[currentQuestionIndex - 1];
      const answer = currentQuestion.answer;
      this.setState(
        {
          currentQuestion,
          nextQuestion,
          previousQuestion,
          numberOfQuestions: questions.length,
          answer,
          previousRandomNumbers: [],
        },
        () => {
          this.showOptions();
          this.handleDisableButton();
        }
      );
    }
  };

  handleOptionClick = (e) => {
    if (e.target.innerHTML.toLowerCase() === this.state.answer.toLowerCase()) {
      this.correctAnswer();
    } else {
      this.wrongAnswer();
    }
  };

  handleNextButtonClick = () => {
    if (this.state.nextQuestion !== undefined) {
      this.setState(
        (prevState) => ({
          currentQuestionIndex: prevState.currentQuestionIndex + 1,
        }),
        () => {
          this.displayQuestions(
            this.state.state,
            this.state.currentQuestion,
            this.state.nextQuestion,
            this.state.previousQuestion
          );
        }
      );
    }
  };

  handlePreviousButtonClick = () => {
    if (this.state.previousQuestion !== undefined) {
      this.setState(
        (prevState) => ({
          currentQuestionIndex: prevState.currentQuestionIndex - 1,
        }),
        () => {
          this.displayQuestions(
            this.state.state,
            this.state.currentQuestion,
            this.state.nextQuestion,
            this.state.previousQuestion
          );
        }
      );
    }
  };

  handleQuitButtonClick = () => {
    if (window.confirm("Are you sure you want to quit?")) {
      this.props.history.push("/");
    }
  };

  handleButtonClick = (e) => {
    switch (e.target.id) {
      case "next-button":
        this.handleNextButtonClick();
        break;

      case "previous-button":
        this.handlePreviousButtonClick();
        break;

      case "quit-button":
        this.handleQuitButtonClick();
        break;

      default:
        break;
    }
  };

  correctAnswer = () => {
    this.setState(
      (prevState) => ({
        score: prevState.score + 1,
        correctAnswers: prevState.correctAnswers + 1,
        currentQuestionIndex: prevState.currentQuestionIndex + 1,
        numberOfAnsweredQuestions: prevState.numberOfAnsweredQuestions + 1,
      }),
      () => {
        if (this.state.nextQuestion === undefined) {
          this.endGame();
        } else {
          this.displayQuestions(
            this.state.questions,
            this.state.currentQuestion,
            this.state.nextQuestion,
            this.state.previousQuestion
          );
        }
      }
    );
  };

  wrongAnswer = () => {
    this.setState(
      (prevState) => ({
        wrongAnswers: prevState.wrongAnswers + 1,
        currentQuestionIndex: prevState.currentQuestionIndex + 1,
        numberOfAnsweredQuestions: prevState.numberOfAnsweredQuestions + 1,
      }),
      () => {
        if (this.state.nextQuestion === undefined) {
          this.endGame();
        } else {
          this.displayQuestions(
            this.state.questions,
            this.state.currentQuestion,
            this.state.nextQuestion,
            this.state.previousQuestion
          );
        }
      }
    );
  };

  showOptions = () => {
    const options = Array.from(document.querySelectorAll(".option"));

    options.forEach((option) => {
      option.style.visibility = "visible";
    });
  };

  startTimer = () => {
    //15 minutes
    const countDownTime = Date.now() + 900000;
    this.interval = setInterval(() => {
      const now = new Date();
      const distance = countDownTime - now;
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      if (distance < 0) {
        clearInterval(this.interval);
        this.setState(
          {
            time: {
              minutes: 0,
              seconds: 0,
            },
          },
          () => {
            this.endGame();
          }
        );
      } else {
        this.setState({
          time: {
            minutes,
            seconds,
            distance,
          },
        });
      }
    }, 1000);
  };

  handleDisableButton = () => {
    if (
      this.state.previousQuestion === undefined ||
      this.state.currentQuestionIndex === 0
    ) {
      this.setState({
        previousButtonDisabled: true,
      });
    } else {
      this.setState({
        previousButtonDisabled: false,
      });
    }

    if (
      this.state.nextQuestion === undefined ||
      this.state.currentQuestionIndex + 1 === this.state.numberOfQuestions
    ) {
      this.setState({
        nextButtonDisabled: true,
      });
    } else {
      this.setState({
        nextButtonDisabled: false,
      });
    }
  };

  async endGame() {
    alert("Quiz has eneded!");
    const { state } = this;
    const playerStats = {
      score: state.score,
      numberOfQuestions: state.numberOfQuestions,
      numberOfAnsweredQuestions: state.correctAnswers + state.wrongAnswers,
      correctAnswers: state.correctAnswers,
      wrongAnswers: state.wrongAnswers,
      noCopyPaste: state.form.noCopyPaste,
      noSpeech: state.form.noSpeech,
      noTabSwitch: state.form.noTabSwitch,
      noTimeOut: state.form.noTimeOut,
      identification: state.form.identification,
    };

    proctoringData.score = (state.score / state.numberOfQuestions) * 10;
    // this.setState({
    //   initialFormState,
    // });
    await axios.post(`${API}report/`, this.state.form, config);
    //this.props.handleSuccess("Report added successfully!");
    //await axios.put(, );
    // await axios.put(`user/${props.id}`, score);

    setTimeout(() => {
      this.props.history.push("/play/quizSummary", playerStats);
    }, 1000);
  }

  render() {
    const { currentQuestion, currentQuestionIndex, numberOfQuestions, time } =
      this.state;

    return this.state.user ? (
      <Fragment>
        <Helmet>
          <title>Exam Page</title>
        </Helmet>

        <div
          className="questions"
          onCopy={this.handlerCopy}
          onLoad={this.record}
        >
          <h2>Quiz Mode</h2>
          <div className="timer-container">
            <p>
              <span className="left" style={{ float: "left" }}>
                {currentQuestionIndex + 1} of {numberOfQuestions}
              </span>
              <span
                className={classnames("right valid", {
                  warning: time.distance <= 120000,
                  invalid: time.distance < 30000,
                })}
              >
                {time.minutes}:{time.seconds}
                <span className="mdi mdi-clock-outline mdi-24px"></span>
              </span>
            </p>
          </div>
          <h5>{currentQuestion.question}</h5>
          <div className="options-container">
            <p onClick={this.handleOptionClick} className="option">
              {currentQuestion.optionA}
            </p>
            <p onClick={this.handleOptionClick} className="option">
              {currentQuestion.optionB}
            </p>
          </div>
          <div className="options-container">
            <p onClick={this.handleOptionClick} className="option">
              {currentQuestion.optionC}
            </p>
            <p onClick={this.handleOptionClick} className="option">
              {currentQuestion.optionD}
            </p>
          </div>

          <div className="button-container">
            <button
              className={classnames("", {
                disable: this.state.previousButtonDisabled,
              })}
              id="previous-button"
              onClick={this.handleButtonClick}
            >
              Previous
            </button>
            <button
              className={classnames("", {
                disable: this.state.nextButtonDisabled,
              })}
              id="next-button"
              onClick={this.handleButtonClick}
            >
              Next
            </button>
            <button id="quit-button" onClick={this.handleButtonClick}>
              Quit
            </button>
          </div>
        </div>
      </Fragment>
    ) : (
      <Default></Default>
    );
  }
}

export default Play;
