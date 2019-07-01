import React, { Component } from "react";
import {
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Input,
  // Alert,
  Button
} from "reactstrap";

class ForgetPassword extends Component {
  state = {
    modal: false,
    email: "",
    msg: ""
  };

  componentDidMount() {
    this.setState({
      modal: true
    });
  }
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
  render() {
    return (
      <div>
        <Modal isOpen={this.state.modal} toggle={this.toogleHandler}>
          <ModalHeader toggle={this.toogleHandler}>Forget Password</ModalHeader>
          <ModalBody>
            <Input
              placeholder="Enter Email ID"
              onChange={this.inputHandler}
              name="email"
              value={this.state.email}
            />
            <br />
          </ModalBody>
          <ModalFooter>
            <Button>Send</Button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}

export default ForgetPassword;
