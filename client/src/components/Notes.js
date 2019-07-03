import React, { Component } from "react";
import {
  Container,
  Button,
  InputGroup,
  InputGroupAddon,
  Input,
  Modal,
  ModalBody,
  ModalHeader,
  ModalFooter,
  Table,
  Alert
} from "reactstrap";
import axios from "axios";
import "./Register.css";

class Notes extends Component {
  state = {
    modal: false,
    modal1: false,
    email: "",
    title: "",
    content: "",
    items: [],
    _id: "",
    data: [],
    search: "",
    currentPage: 1,
    notesPerPage: 2
  };

  componentWillMount() {
    let user = JSON.parse(localStorage.getItem("user"));
    this.setState({
      email: user.user.email
    });

    axios.get(`/getnote/${user.user.email}`).then(res => {
      this.setState({
        items: res.data
      });
    });
  }

  //click event for page numbers
  pageHandler = e => {
    this.setState({
      currentPage: Number(e.target.id)
    });
  };

  //add note toogle
  toggle = () => {
    this.setState(prevState => ({
      modal: !prevState.modal,
      title: "",
      content: "",
      msg: ""
    }));
  };

  //updated toogle modal
  toggle1 = (_id, title, content) => {
    this.setState(prevState => ({
      modal1: !prevState.modal1,
      title: title,
      content: content,
      msg: "",
      _id: _id
    }));
  };

  //input handler for Title and Content
  titleChnageHandler = e => {
    let target = e.target;
    let value = target.type === "checkbox" ? target.checked : target.value;
    let name = target.name;
    this.setState({
      [name]: value
    });
  };

  //clear the data
  clearHandler = e => {
    this.setState({
      title: "",
      content: ""
    });
  };

  //save note
  saveHandler = e => {
    e.preventDefault();
    if (this.state.title === "") {
      this.setState({ msg: "Title is Required" });
    } else if (this.state.content === "") {
      this.setState({ msg: "Content is Required" });
    } else {
      axios
        .post("/addnote", this.state)
        .then(res => {
          this.setState({
            items: res.data
          });
          this.toggle();
        })
        .catch(err => {});
    }
  };

  //delete note
  deleteHandler = id => {
    console.log(id);
    axios
      .delete(`/deletenote/${id}`)
      .then(res => console.log("deleted a note"));
  };

  //updating note
  updateHandler = () => {
    this.setState(state => {
      state.items.map(item => {
        if (item._id === this.state._id) {
          console.log("hello");

          item.title = this.state.title;
          item.content = this.state.content;
          axios
            .post(`/updatedata`, [
              this.state._id,
              this.state.title,
              this.state.content,
              this.state.email
            ])
            .then(res => {
              console.log(res);
            })
            .catch(err => console.log(err));
          return item;
        } else {
          return item;
        }
      });
    });
    this.toggle1();
  };

  //search a note
  searchHandler = () => {
    const searchItem = this.state.search;
    const user = JSON.parse(localStorage.getItem("user"));
    const email = user.user.email;
    console.log(searchItem);
    axios
      .post(`/searchnote`, [searchItem, email])
      .then(res => {
        if (res.data.msg === "Item doesnot exist") {
          this.setState({
            msg: "Notes Not Found"
          });
        } else {
          this.setState({
            items: res.data,
            msg: ""
          });
        }
      })
      .catch(err => console.log(err));
  };

  //serach handler
  searchChnageHandler = e => {
    let target = e.target;
    let value = target.type === "checkbox" ? target.checked : target.value;
    let name = target.name;
    this.setState({
      [name]: value
    });
    if (value === "") {
      this.componentWillMount();
    }
  };

  render() {
    const { items, currentPage, notesPerPage } = this.state;

    //logic for displaying the notes
    const indexOfLastNote = currentPage * notesPerPage;
    const indexOfFirstNote = indexOfLastNote - notesPerPage;
    const currentItems = items.slice(indexOfFirstNote, indexOfLastNote);

    const renderNotes = currentItems.map(ele => {
      return (
        <tr key={ele._id}>
          <td>
            <Button
              color="warning"
              onClick={() => this.toggle1(ele._id, ele.title, ele.content)}
            >
              <i className="fa fa-pencil" aria-hidden="true" />
            </Button>
            &nbsp;&nbsp;&nbsp;
            <Button
              color="danger"
              onClick={() => {
                this.setState(
                  state => ({
                    items: state.items.filter(item => item._id !== ele._id)
                  }),
                  this.deleteHandler(ele._id)
                );
              }}
            >
              <i className="fa fa-trash-o" aria-hidden="true" />
            </Button>
          </td>
          <td>{ele.title}</td>
          <td className="dumy">
            <div className="scrollable">{ele.content}</div>
          </td>
          <td>{ele.date}</td>
          <td>{ele.updatedDate}</td>
        </tr>
      );
    });
    const pageNumber = [];
    for (let i = 1; i <= Math.ceil(items.length / notesPerPage); i++) {
      pageNumber.push(i);
    }
    const renderPageNumber = pageNumber.map(number => {
      return (
        <li
          key={number}
          id={number}
          onClick={this.pageHandler}
          className="pagenumbers"
        >
          {number}
        </li>
      );
    });
    return (
      <div>
        <Container>
          <InputGroup>
            <InputGroupAddon addonType="prepend">
              <Button
                color="primary"
                style={{ marginBottom: "2rem" }}
                onClick={this.toggle}
              >
                <i className="fa fa-pencil-square-o" aria-hidden="true" />
              </Button>
              <Modal
                isOpen={this.state.modal}
                fade={false}
                toggle={this.toggle}
              >
                <ModalHeader toggle={this.toggle}>Add New Note</ModalHeader>
                <ModalBody>
                  {this.state.msg ? (
                    <Alert color="warning">{this.state.msg}</Alert>
                  ) : (
                    ""
                  )}
                  <h6>Title</h6>
                  <Input
                    type="text"
                    placeholder="Enter Title"
                    value={this.state.title}
                    name="title"
                    onChange={this.titleChnageHandler}
                  />
                  <br />
                  <h6>Content</h6>
                  <Input
                    type="textarea"
                    placeholder="Enter Content"
                    value={this.state.content}
                    name="content"
                    onChange={this.titleChnageHandler}
                  />
                </ModalBody>
                <ModalFooter>
                  <Button color="success" onClick={this.saveHandler}>
                    Save
                  </Button>
                  <Button color="danger" onClick={this.clearHandler}>
                    Clear
                  </Button>
                </ModalFooter>
              </Modal>
            </InputGroupAddon>
            <Input
              placeholder="search title"
              name="search"
              type="text"
              value={this.state.search}
              onChange={this.searchChnageHandler}
            />
            <InputGroupAddon addonType="append">
              <Button
                color="secondary"
                style={{ marginBottom: "2rem" }}
                onClick={this.searchHandler}
              >
                Search
              </Button>
            </InputGroupAddon>
          </InputGroup>
        </Container>
        {this.state.msg ? <Alert color="warning">{this.state.msg}</Alert> : ""}
        {this.state.items.length !== 0 ? (
          <Table bordered>
            <thead>
              <tr>
                <th />
                <th>Title</th>
                <th>Content</th>
                <th>Created Date</th>
                <th>Updated Date</th>
              </tr>
            </thead>
            <tbody>{renderNotes}</tbody>
          </Table>
        ) : (
          ""
        )}
        <ul id="page-numbers">{renderPageNumber}</ul>
        {/* new toggel model for edit */}
        <Modal isOpen={this.state.modal1} fade={false} toggle={this.toggle1}>
          <ModalHeader toggle={this.toggle1}>Update Note</ModalHeader>
          <ModalBody>
            {this.state.msg ? (
              <Alert color="warning">{this.state.msg}</Alert>
            ) : (
              ""
            )}
            <h6>Title</h6>
            <Input
              type="text"
              placeholder="Enter Title"
              value={this.state.title}
              name="title"
              onChange={this.titleChnageHandler}
            />
            <br />
            <h6>Content</h6>
            <Input
              type="textarea"
              placeholder="Enter Content"
              value={this.state.content}
              name="content"
              onChange={this.titleChnageHandler}
            />
          </ModalBody>
          <ModalFooter>
            <Button color="success" onClick={this.updateHandler}>
              Update
            </Button>
          </ModalFooter>
        </Modal>
        {/* endingof toggel edit */}
      </div>
    );
  }
}

export default Notes;

// uuid generates random id for each and every element

// delete
// this.setState(state => ({
//   items: state.items.filter(item => item.id !== ele.id)
// }));

//save function
// this.setState(state => ({
//   items: [
//     ...state.items,
//     { id: uuid(), title: this.state.title, content: this.state.content }
//   ],
//   msg: ""
// }));

// {this.state.items.map(ele => {
//   return (
//     <tr key={ele._id}>
//       <td>
//         <Button
//           color="warning"
//           onClick={() =>
//             this.toggle1(ele._id, ele.title, ele.content)
//           }
//         >
//           <i className="fa fa-pencil" aria-hidden="true" />
//         </Button>
//         &nbsp;&nbsp;&nbsp;
//         <Button
//           color="danger"
//           onClick={() => {
//             this.setState(
//               state => ({
//                 items: state.items.filter(
//                   item => item._id !== ele._id
//                 )
//               }),
//               this.deleteHandler(ele._id)
//             );
//           }}
//         >
//           <i className="fa fa-trash-o" aria-hidden="true" />
//         </Button>
//       </td>
//       <td>{ele.title}</td>
//       <td>{ele.content}</td>
//       <td>{ele.date}</td>
//     </tr>
//   );
// })}
