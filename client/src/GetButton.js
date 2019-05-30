import React, { Component } from "react";
import {
  BrowserRouter as Router,
  Link,
  Route,
  Redirect
} from "react-router-dom";
import Button from "@material-ui/core/Button";
import axios from "axios";
import RestCardArg from "./RestCardArg.js";

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

class GetButton extends Component {
  constructor(props) {
    super(props);
    this.state = { description: null, img: null, date: null };

    this.handleClick = this.handleClick.bind(this);
    this.setCardDetails = this.setCardDetails.bind(this);
  }

  handleClick() {
    var self = this;
    axios
      .get("http://localhost:3001/invitationCard")
      .then(function(response) {
        console.log(response);
        self.setState(response.data);
      })
      .catch(function(error) {
        console.log(error);
      });

    axios
      .get("http://localhost:3001/invitationList")
      .then(function(response) {})
      .catch(function(error) {
        console.log(error);
      });
  }

  setCardDetails() {
    var self = this;
    axios
      .get("http://localhost:3001/invitationCard")
      .then(function(response) {
        console.log(response);
        self.setState(response.data);
      })
      .catch(function(error) {
        console.log(error);
      });
  }
  render() {
    return (
      <Router>
        <Link to="/gp">
          <Button onClick={this.handleClick}>Get Test</Button>
        </Link>
        <Route
          path="/gp"
          component={() => (
            <RestCardArg
              description={this.state.Description}
              date={this.state.Date}
              image={this.state.image}
            />
          )}
        />
      </Router>
    );
  }
}

export default GetButton;
