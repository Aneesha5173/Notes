import React, { Component } from "react";
import { Alert } from "reactstrap";
import "./Register.css";
import { Redirect } from "react-router";
import axios from "axios";

class RegisterPage extends Component {
  state = {
    name: "",
    email: "",
    password: "",
    phone: "",
    msg: "",
    Auth: "",
    profile: ""
  };

  fieldHandler = e => {
    let target = e.target;
    let value = target.type === "checkbox" ? target.checked : target.value;
    let name = target.name;
    this.setState({
      [name]: value
    });
  };
  //Name validation
  nameValidation = () => {
    var pattern = /^[a-zA-Z ]*$/;
    var name = this.state.name;
    if (!name) {
      this.setState({
        msg: "Please enter name",
        Auth: false
      });
    } else if (!pattern.test(name)) {
      this.setState({
        msg: "Please enter valid name(only alphabets)",
        Auth: false
      });
    } else {
      this.setState({
        msg: "",
        Auth: true
      });
    }
  };
  //validation for email
  emailValidation = () => {
    var pattern = new RegExp(
      /^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i
    );
    var email = this.state.email;
    if (!email) {
      this.setState({
        msg: "Please enter email",
        Auth: false
      });
    } else if (!pattern.test(email)) {
      this.setState({
        msg: "Please enter email like xyz@gmail.com",
        Auth: false
      });
    } else {
      this.setState({
        msg: "",
        Auth: true
      });
    }
  };
  //Phone Number Validation
  phoneValidation = () => {
    var pattern = /^[0-9]{10}$/;
    var phone = this.state.phone;
    if (!phone) {
      this.setState({
        msg: "Please enter phone number",
        Auth: false
      });
    } else if (!pattern.test(phone)) {
      this.setState({
        msg: "Phone only numbers and 10digits",
        Auth: false
      });
    } else {
      this.setState({
        msg: "",
        Auth: true
      });
    }
  };
  //Password validation
  passwordValidation = () => {
    var pattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,32}$/;
    var password = this.state.password;
    if (!password) {
      this.setState({
        msg: "Please enter Password",
        Auth: false
      });
    } else if (!password.match(pattern)) {
      this.setState({
        msg: "Password length minimum 8",
        Auth: false
      });
    } else {
      this.setState({
        msg: "",
        Auth: true
      });
    }
  };

  formHandler = e => {
    e.preventDefault();
    if (this.state.Auth) {
      axios
        .post("/register", this.state)
        .then(res => {
          console.log("hello aneesha", res);
          if (res.data.msg === "email already exists") {
            this.setState({
              msg: "email already exists"
            });
          } else if (res.data.msg === "phone already exists") {
            this.setState({
              msg: "Phone already exists"
            });
          } else {
            this.props.history.push("/");
          }
        })
        .catch(err => {
          console.log(err);
        });
    }
  };

  render() {
    let user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      return (
        <div className="class1">
          <div className="class2">
            <form onSubmit={this.formHandler}>
              <h3>REGISTRATION</h3>
              {this.state.msg ? (
                <Alert color="warning">{this.state.msg}</Alert>
              ) : (
                ""
              )}
              <br />
              <input
                type="text"
                name="name"
                value={this.state.name}
                placeholder="Enter Name"
                onChange={this.fieldHandler}
                onBlur={this.nameValidation}
              />
              <br />
              <input
                type="text"
                name="email"
                value={this.state.email}
                placeholder="Enter Email ID"
                onChange={this.fieldHandler}
                onBlur={this.emailValidation}
              />
              <br />
              <input
                type="text"
                name="phone"
                value={this.state.phone}
                placeholder="Enter Mobile Number"
                onChange={this.fieldHandler}
                onBlur={this.phoneValidation}
              />
              <br />
              <input
                type="password"
                name="password"
                value={this.state.password}
                placeholder="Enter Password"
                onChange={this.fieldHandler}
                onBlur={this.passwordValidation}
              />
              <br />
              <br />
              <button type="submit" className="btnsubmit">
                Submit
              </button>
              <br />
              <a
                href="/"
                className="btn btn-link"
                style={{ color: "honeydew" }}
              >
                Already a Member
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

export default RegisterPage;
