import React, { Component } from "react";
import {
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Input,
  Alert,
  Button
} from "reactstrap";
import axios from "axios";

class ForgetPassword extends Component {
  state = {
    modal: false,
    email: "",
    msg: "",
    d1: false,
    otp: "",
    pwd: "",
    cpwd: "",
    modal2: false,
    msg2: ""
  };

  componentDidMount() {
    this.setState({
      modal: true
    });
  }
  //toogle handler for creating a new password
  toogleHandler2 = () => {
    this.setState({
      modal2: !this.state.modal2
    });
  };

  //toogle handler
  toogleHandler = () => {
    this.setState({
      modal: !this.state.modal
    });
  };

  //input handler
  inputHandler = e => {
    let target = e.target;
    let value = target.type === "checkbox" ? target.checked : target.value;
    let name = target.name;
    this.setState({
      [name]: value
    });
  };

  //email verify
  sendHandler = e => {
    e.preventDefault();
    const mail = this.state.email;
    axios.post(`/sendemail/${mail}`).then(res => {
      if (res.data.msg === "otp send to ur email") {
        this.setState({
          msg: "otp send to your email ID",
          d1: true
        });
      } else if (res.data.msg === "Email doesn't exists") {
        this.setState({
          msg: "Entered Email ID doesnot exists"
        });
      } else if (
        res.data.msg === "network error please try again after some time"
      ) {
        this.setState({
          msg: "network error please try again after 20 Minutes"
        });
      } else {
        this.setState({ msg: "" });
      }
    });
  };

  //otp verification
  otpHandler = e => {
    e.preventDefault();
    console.log([this.state.otp, this.state.email]);
    axios
      .post("/otpverify", [this.state.otp, this.state.email])
      .then(res => {
        if (res.data.msg === "success") {
          this.setState({
            modal: !this.state.modal,
            modal2: true
          });
        } else if (res.data.msg === "invalid OTP") {
          this.setState({
            msg: "Invalid OTP",
            modal2: false
          });
        } else {
          this.setState({
            msg: ""
          });
        }
      })
      .catch(err => {
        console.log(err);
      });
  };

  //confirm password handler
  confirmHandler = e => {
    e.preventDefault();
    if (this.state.pwd === "") {
      this.setState({
        msg2: "Please Enter Password"
      });
    } else if (this.state.cpwd === "") {
      this.setState({
        msg2: "Please Enter Confirm Password"
      });
    } else if (this.state.pwd !== this.state.cpwd) {
      this.setState({
        msg2: "Password and Confirm Password or not same"
      });
    } else if (this.state.pwd === this.state.cpwd) {
      axios
        .post("/newpwd", [this.state.email, this.state.pwd])
        .then(res => {
          if (res.data.msg === "pwd updated")
            this.setState({
              msg2: "Password Updated successfully"
            });
          this.props.history.push("/");
        })
        .catch(err => {
          console.log(err);
        });
    } else {
      this.setState({
        msg: ""
      });
    }
  };

  //password validation
  passwordValidation = () => {
    var pattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,32}$/;
    if (!this.state.pwd.match(pattern)) {
      this.setState({
        msg2: "Password like Xyz@123 and length min 8"
      });
    }
  };

  render() {
    return (
      <div>
        <Modal isOpen={this.state.modal} toggle={this.toogleHandler}>
          <ModalHeader toggle={this.toogleHandler}>Forget Password</ModalHeader>
          <ModalBody>
            {this.state.msg ? (
              <Alert color="warning">{this.state.msg}</Alert>
            ) : (
              ""
            )}
            <br />
            <Input
              placeholder="Enter Email ID"
              onChange={this.inputHandler}
              name="email"
              value={this.state.email}
              id="mailID"
              disabled={this.state.d1}
            />
            <br />
            {this.state.d1 ? (
              <Input
                placeholder="Enter OTP"
                onChange={this.inputHandler}
                name="otp"
                value={this.state.otp}
                id="mailID"
              />
            ) : (
              ""
            )}
          </ModalBody>
          <ModalFooter>
            {this.state.d1 ? (
              <Button onClick={this.otpHandler}>Submit</Button>
            ) : (
              <Button onClick={this.sendHandler}>Send</Button>
            )}
          </ModalFooter>
        </Modal>
        {/* modal for creating a new password */}
        <Modal isOpen={this.state.modal2} toggle={this.toogleHandler2}>
          <ModalHeader toggle={this.toogleHandler2}>New Password</ModalHeader>
          <ModalBody>
            {this.state.msg2 ? (
              <Alert color="warning">{this.state.msg2}</Alert>
            ) : (
              ""
            )}
            <Input
              placeholder="Enter New Password"
              type="password"
              value={this.state.pwd}
              name="pwd"
              onChange={this.inputHandler}
              onBlur={this.passwordValidation}
            />
            <br />
            <Input
              placeholder="Enter Confirm Password"
              type="password"
              name="cpwd"
              value={this.state.cpwd}
              onChange={this.inputHandler}
              onBlur={this.passwordValidation}
            />
          </ModalBody>
          <ModalFooter>
            <Button onClick={this.confirmHandler}> Confirm</Button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}

export default ForgetPassword;
