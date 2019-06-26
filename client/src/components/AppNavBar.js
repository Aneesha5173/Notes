import React, { Component } from "react";
import Notes from "./Notes";
// import Pagination from "./pagination";
import { Redirect } from "react-router";
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Container
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
  componentWillMount() {
    // console.log("from render");
    let user = JSON.parse(localStorage.getItem("user"));
    this.setState({
      profile: user.name
    });
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
    const styles = {
      right: 140,
      left: "auto",
      position: "fixed"
    };
    const styles1 = {
      right: 10,
      left: "auto",
      position: "fixed"
    };

    let result;
    if (this.state.profile) {
      result = (
        <div>
          <Navbar color="dark" dark expand="sm" className="mb-5">
            <Container>
              <NavbarBrand href="/home">
                <i className="fa fa-pencil-square-o" aria-hidden="true" /> Notes
              </NavbarBrand>
              <NavbarToggler onClick={this.toggle} />
              <Collapse isOpen={this.state.isOpen} navbar>
                <NavbarBrand href="#" style={styles}>
                  <i className="fa fa-user"> Welcome {this.state.profile}</i>
                </NavbarBrand>
                <NavbarBrand href="#" onClick={this.Logout} style={styles1}>
                  <i className="fa fa-sign-out">Logout</i>
                </NavbarBrand>
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