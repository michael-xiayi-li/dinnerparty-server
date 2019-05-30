import React, { Component } from "react";
import {
  BrowserRouter as Router,
  Link,
  Route,
  Redirect
} from "react-router-dom";
import Button from "@material-ui/core/Button";
import axios from "axios";
import RestCardCreator from "./RestCardCreator.js";
import Modal from "react-modal";
import ListItem from "@material-ui/core/ListItem";

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)"
  }
};
class CreateButton extends Component {
  constructor(props) {
    super(props);
    this.state = { modalIsOpen: false };
    this.openModal = this.openModal.bind(this);
    this.afterOpenModal = this.afterOpenModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
  }
  openModal() {
    let nextState = this.state;
    nextState.modalIsOpen = true;
    this.setState(nextState);
  }
  afterOpenModal() {}
  closeModal() {
    let nextState = this.state;
    nextState.modalIsOpen = false;
    this.setState(nextState);
  }

  render() {
    return (
      <div>
        <ListItem button onClick={this.openModal}>
          Create Card
        </ListItem>
        <Modal
          isOpen={this.state.modalIsOpen}
          onAfterOpen={this.afterOpenModal}
          onRequestClose={this.closeModal}
          style={customStyles}
        >
          <RestCardCreator close={this.closeModal} />
        </Modal>
      </div>
    );
  }
}

export default CreateButton;
