import React from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import AppNavBar from "./components/AppNavBar";
import Register from "./components/Register";
import Login from "./components/login";
import axios from "axios";
import { Switch, Route, BrowserRouter } from "react-router-dom";
// import { BrowserRouter, Switch, Route } from "react-router";
import ForgetPassword from "./components/ForgetPassword";

class App extends React.Component {
  constructor(props) {
    super();
    //getting URL data by using "?" in URL
    var param_array = window.location.href.split("?")[1];
    if (param_array) {
      //spliting by using "=" operator in URL
      var data = param_array.split("=");
      var token = data[1];
      axios.post(`/validation/${token}`);
    }
  }
  render() {
    return (
      <div className="App">
        <BrowserRouter>
          <Switch>
            <Route path="/register" component={Register} />
            <Route path="/home" component={AppNavBar} />
            <Route path="/forgetPassword" component={ForgetPassword} />
            <Route path="/" component={Login} exact />
          </Switch>
        </BrowserRouter>
      </div>
    );
  }
}

export default App;
