import React, { Fragment } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";

import Home from "./components/Home";
import QuizInstructions from "./components/quiz/QuizInstructions";
import Play from "./components/quiz/Play";
import QuizSummary from "./components/quiz/QuizSummary";
import CheckID from "./components/quiz/CheckID";

const API = process.env.REACT_APP_API_BASEURL;

function App() {
  return (
    <Router>
      <Route path="/" exact component={Home} />
      <Route path="/play/instructions" exact component={QuizInstructions} />
      <Route path="/play/quizSummary" exact component={QuizSummary} />
      <Route path="/play/quiz" exact component={Play} />
      <Route path="/play/checkid" exact component={CheckID} />
    </Router>
  );
}

export default App;
