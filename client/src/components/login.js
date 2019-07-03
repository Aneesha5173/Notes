import React, { Component } from "react";
import "./Register.css";
import { Redirect } from "react-router";
import axios from "axios";
class LoginPage extends Component {
  state = {
    email: "",
    password: "",
    msg: "",
    profile: ""
  };

  //submit button
  submitHandler = () => {
    axios.post("/login", this.state).then(res => {
      console.log("hhhh", res);
      if (res.data.msg === "User Does not exists") {
        this.setState({
          msg: "User Does not exists"
        });
      } else if (res.data.msg === "Password Does not Match") {
        this.setState({
          msg: "Password Does not Match"
        });
      } else if (res.data.msg === "please enter all fields") {
        this.setState({
          msg: "please enter all fields"
        });
      } else if (res.data.msg === "Please Verify your email") {
        this.setState({
          msg: "Please Verify your email"
        });
      } else {
        this.setState({
          msg: ""
        });
        const data = JSON.stringify(res.data);
        localStorage.setItem("user", data);
        this.props.history.push("/home");
      }
    });
  };

  //input field change handler
  fieldHandler = e => {
    let target = e.target;
    let value = target.type === "checkbox" ? target.checked : target.value;
    let name = target.name;
    this.setState({
      [name]: value
    });
  };

  render() {
    const data = JSON.parse(localStorage.getItem("user"));
    if (!data) {
      return (
        <div className="class1">
          <div className="class2">
            {/* {this.state.msg ? msg : ""} */}
            <form>
              <h3>Login Page</h3>
              {this.state.msg ? (
                <p style={{ color: "yellow" }}>{this.state.msg}</p>
              ) : (
                ""
              )}
              <input
                type="text"
                placeholder="Enter Email"
                name="email"
                value={this.state.email}
                onChange={this.fieldHandler}
              />
              <br />
              <input
                type="password"
                name="password"
                value={this.state.password}
                placeholder="Enter Password"
                onChange={this.fieldHandler}
              />
              <br />
              <button
                type="button"
                className="btnsubmit"
                onClick={this.submitHandler}
              >
                Submit
              </button>
              <br />
              <a
                className="btn btn-link"
                href="/forgetPassword"
                style={{ color: "beige" }}
              >
                Forget Password
              </a>
              {/* <button className="btn btn-link">HELLO</button> */}
              <br />
              <a
                className="btn btn-link"
                href="/register"
                style={{ color: "honeydew" }}
              >
                create a New Account
              </a>
            </form>
          </div>
        </div>
      );
    } else {
      return <Redirect to="/home" />;
    }
  }
}

export default LoginPage;
