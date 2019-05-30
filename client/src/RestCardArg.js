import React, { Component } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import {
  BrowserRouter as Router,
  Link,
  Route,
  Redirect
} from "react-router-dom";
import { withStyles } from "@material-ui/core/styles";
import GuestForm from "./GuestForm.js";
import Card from "@material-ui/core/Card";
import GuestInput from "./GuestInput.js";
import SheetButton from "./SheetButton.js";
import Button from "@material-ui/core/Button";
import ResponsiveContainer from "recharts/lib/component/ResponsiveContainer";
import Modal from "react-modal";
import AdminButton from "./AdminButton.js";
import SignIn from "./SignIn.js";

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

const styles = theme => ({
  leftButton: {
    display: "inline-block",
    marginLeft: "0%",
    marginTop: "1%",
    borderRadius: "4px",
    backgroundColor: "white"
  },
  rsvpButton: {
    display: "inline-block",
    marginLeft: "30%",
    marginTop: "1%",
    borderRadius: "4px",
    backgroundColor: "white"
  },
  rightButton: {
    display: "inline-block",
    marginLeft: "30%",
    marginTop: "1%",
    borderRadius: "4px",
    backgroundColor: "white"
  }
});

class RestCardArg extends Component {
  constructor(props) {
    super(props);

    this.state = {
      modalIsOpen: false
    };

    this.openModal = this.openModal.bind(this);
    this.afterOpenModal = this.afterOpenModal.bind(this);
    this.closeModal = this.closeModal.bind(this);

    this.leftUpdate = this.leftUpdate.bind(this);
    this.rightUpdate = this.rightUpdate.bind(this);
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

  leftUpdate() {
    this.props.updateIndex(-1);
  }

  rightUpdate() {
    this.props.updateIndex(1);
  }

  render() {
    const { classes } = this.props;
    return (
      <ResponsiveContainer width={500} height={320}>
        <div>
          <Card className="CenterCard">
            <img src={this.props.cardInfo.image} className="RestImage" />

            <row className="CardText"> {this.props.cardInfo.Description}</row>

            <row className="CardText"> {this.props.cardInfo.Date} </row>

            <Button className={classes.leftButton} onClick={this.leftUpdate}>
              {" "}
              Left{" "}
            </Button>
            <Button className={classes.rsvpButton} onClick={this.openModal}>
              {" "}
              RSVP{" "}
            </Button>

            <Modal
              isOpen={this.state.modalIsOpen}
              onAfterOpen={this.afterOpenModal}
              onRequestClose={this.closeModal}
              style={customStyles}
            >
              <GuestForm
                _id={this.props.cardInfo._id}
                close={this.closeModal}
              />
            </Modal>
            <Button className={classes.rightButton} onClick={this.rightUpdate}>
              {" "}
              Right{" "}
            </Button>
          </Card>
        </div>
      </ResponsiveContainer>
    );
  }
}

RestCardArg.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(RestCardArg);
