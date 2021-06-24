import React, { Fragment } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import Home from "./components/Home";
import QuizInstructions from "./components/quiz/QuizInstructions";
import Play from "./components/quiz/Play";
import QuizSummary from "./components/quiz/QuizSummary";
import CheckID from "./components/quiz/CheckID";
import Default from "./components/Default";
import NotFound from "./components/NotFound";

const API = process.env.REACT_APP_API_BASEURL;

function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/" exact component={Home} />
        <Route
          exact
          path="/play/instructions"
          exact
          component={QuizInstructions}
        />
        <Route exact path="/play/quizSummary" exact component={QuizSummary} />
        <Route exact path="/play/quiz" exact component={Play} />
        <Route exact path="/play/checkid" exact component={CheckID} />
        <Route exact path="/default" exact component={Default} />
        <Route exact path="*" exact component={NotFound} />
      </Switch>
    </Router>
  );
}

export default App;
