import React, { Component } from "react";
import Notes from "./Notes";
// import Pagination from "./pagination";
import { Redirect } from "react-router";
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Container,
  Nav
} from "reactstrap";

class AppNavBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
      profile: ""
    };
    // console.log("from state");
  }

  //toogle function
  toggle = () => {
    this.setState({
      isOpen: !this.state.isOpen
    });
  };

  //logout function
  Logout = () => {
    localStorage.removeItem("user");
    this.props.history.push("/");
  };
  render() {
    let user = JSON.parse(localStorage.getItem("user"));

    let result;
    if (user) {
      result = (
        <div>
          <Navbar color="dark" dark expand="sm" className="mb-5">
            <Container>
              <NavbarBrand href="/home">
                <i className="fa fa-pencil-square-o" aria-hidden="true" /> Notes
              </NavbarBrand>
              <NavbarToggler onClick={this.toggle} />
              <Collapse isOpen={this.state.isOpen} navbar>
                <Nav className="ml-auto" navbar>
                  <NavbarBrand href="#">
                    <i className="fa fa-user"> Welcome {user.user.name}</i>
                  </NavbarBrand>
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  <NavbarBrand href="#" onClick={this.Logout}>
                    <i className="fa fa-sign-out">Logout</i>
                  </NavbarBrand>
                </Nav>
              </Collapse>
            </Container>
          </Navbar>
          <Notes />
          {/* <Pagination /> */}
        </div>
      );
    } else {
      return <Redirect to="/" />;
    }
    return result;
  }
}

export default AppNavBar;
