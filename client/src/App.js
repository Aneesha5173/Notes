import React from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import AppNavBar from "./components/AppNavBar";
import Register from "./components/Register";
import Login from "./components/login";
import { Switch, Route, BrowserRouter } from "react-router-dom";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Switch>
          <Route path="/register" component={Register} />
          <Route path="/home" component={AppNavBar} />
          <Route path="/" component={Login} exact />
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
