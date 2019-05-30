import React, { Component } from "react";
import Button from "@material-ui/core/Button";
import axios from "axios";
import {
  BrowserRouter as Router,
  Link,
  Route,
  Redirect
} from "react-router-dom";

class SubmitButton extends Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }
  handleClick = () => {
    var information = document.getElementsByClassName("Form Entry");
    var bodyFormData = {};
    for (var i = 0; i < information.length; i++) {
      var element = information[i];
      var inputLabel = element.getElementsByClassName("FormInputLabel")[0];
      var inputText = element.getElementsByClassName("FormData")[0];

      var inputLabelCategory = inputLabel.innerHTML.slice(0, -1);
      var inputTextResponse = inputText.children[0].children[0].value;

      bodyFormData[inputLabelCategory] = inputTextResponse;
    }

    bodyFormData["id"] = this.props.id;
    console.log(bodyFormData);

    axios
      .post("http://localhost:3001/postForm", bodyFormData)
      .then(function(response) {
        console.log("received");
        console.log(response);
      })
      .catch(function(error) {
        console.log(error);
      });
  };

  render() {
    return (
      <Router>
        <Link to="/gp">
          <Button onClick={this.handleClick}>Submit</Button>
        </Link>
      </Router>
    );
  }
}

export default SubmitButton;
