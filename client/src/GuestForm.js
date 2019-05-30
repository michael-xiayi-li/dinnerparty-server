import React, { Component } from "react";
import FormLabel from "@material-ui/core/FormLabel";
import SubmitButton from "./SubmitButton.js";
import GuestInput from "./GuestInput.js";
import Card from "@material-ui/core/Card";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import axios from "axios";
class GuestForm extends Component {
  constructor(props) {
    super(props);
    this._handleFieldChange = this._handleFieldChange.bind(this);
    this.submitForm = this.submitForm.bind(this);
    this.state = {
      Name: null,
      "E-mail": null,
      "Dietary Restrictions": null,
      id: this.props._id
    };
  }

  renderInput(i) {
    return <GuestInput value={i} />;
  }

  submitForm() {
    var bodyFormData = this.state;
    axios
      .post("http://localhost:3001/postForm", bodyFormData)
      .then(function(response) {
        console.log("received");
        console.log(response);
      })
      .catch(function(error) {
        console.log(error);
      });

    this.props.close();
  }

  _handleFieldChange(e, label) {
    e.preventDefault();

    var nextState = this.state;
    nextState[label] = e.target.value;

    this.setState(nextState);
  }
  render() {
    return (
      <Card className="CenterCard">
        <div className="FormEntry">
          <FormLabel className="FormTitle">Test</FormLabel>

          <TextField
            label="Name"
            onChange={e => this._handleFieldChange(e, "Name")}
          />
          <TextField
            label="E-mail"
            onChange={e => this._handleFieldChange(e, "E-mail")}
          />
          <TextField
            label="Dietary Preferences"
            onChange={e => this._handleFieldChange(e, "Dietary Restrictions")}
          />
          <Button onClick={this.submitForm}> Submit </Button>
        </div>
      </Card>
    );
  }
}

export default GuestForm;
