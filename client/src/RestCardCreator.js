import React, { Component } from "react";
import axios from "axios";
import {
  BrowserRouter as Router,
  Link,
  Route,
  Redirect
} from "react-router-dom";
import GuestForm from "./GuestForm.js";
import GuestInput from "./GuestInput.js";
import Card from "@material-ui/core/Card";
import FormData from "form-data";
import TextField from "@material-ui/core/TextField";
import FormControl from "@material-ui/core/FormControl";
import Button from "@material-ui/core/Button";
import { withStyles } from "@material-ui/core/styles";

class RestCardCreator extends Component {
  constructor(props) {
    super(props);
    this.state = {
      Date: null,
      Description: null,
      GuestLimit: null,
      GuestNumber: "0",
      image: ""
    };

    this._handleFieldChange = this._handleFieldChange.bind(this);
    this._handleImageChange = this._handleImageChange.bind(this);
    this.uploadRestCard = this.uploadRestCard.bind(this);
  }

  renderInput(i) {
    return <GuestInput value={i} />;
  }

  uploadInvitationCard() {
    let bodyFormData = new FormData();
    var information = document.getElementsByClassName("Form Entry");

    for (var i = 0; i < information.length; i++) {
      var element = information[i];
      var inputLabel = element.getElementsByClassName("FormInputLabel")[0];
      var inputText = element.getElementsByClassName("FormData")[0];

      var inputLabelCategory = inputLabel.innerHTML.slice(0, -1);
      var inputTextResponse = inputText.children[0].children[0].value;

      if (inputLabelCategory == "GuestLimit") {
        bodyFormData.append(inputLabelCategory, inputTextResponse);
        bodyFormData.append("GuestNumber", 0);
      } else {
        bodyFormData.append(inputLabelCategory, inputTextResponse);
      }
    }

    //bodyFormData['image']=this.state.imagePreviewUrl;
    bodyFormData.append("image", this.state.imagePreviewUrl);
    //bodyFormData['file']=this.state.file;
    console.log("xxxxx");
    console.log(bodyFormData);
    console.log("xxxxx");

    const config = { headers: { "Content-Type": "multipart/form-data" } };
    axios
      .post("http://localhost:3001/postRestCardCreator", bodyFormData, config)
      .then(function(response) {
        console.log("received");
        console.log(response);
      })
      .catch(function(error) {
        console.log(error);
      });
  }

  uploadRestCard() {
    let bodyFormData = new FormData();

    for (var key in this.state) {
      bodyFormData.append(key, this.state[key]);
    }
    const config = { headers: { "Content-Type": "multipart/form-data" } };
    axios
      .post("http://localhost:3001/postRestCardCreator", bodyFormData, config)
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

  _handleSubmit(e) {
    e.preventDefault();
    console.log("handle uploading-", this.state.file);
  }

  _handleImageChange(e) {
    e.preventDefault();

    let reader = new FileReader();
    let file = e.target.files[0];

    reader.onloadend = () => {
      var nextState = this.state;
      nextState.image = reader.result;

      this.setState(nextState);

      /*
      this.setState(() => ({
        ["file"]: file,
        ["image"]: reader.result
      }));
      */
    };

    reader.readAsDataURL(file);
  }

  render() {
    let { imagePreviewUrl } = this.state;
    let $imagePreview = null;
    if (imagePreviewUrl) {
      $imagePreview = <img src={imagePreviewUrl} />;
    } else {
      $imagePreview = (
        <div className="previewText">Please select an Image for Preview</div>
      );
    }

    return (
      <Card className="CenterCard">
        <FormControl
          onSubmit={e => this._handleSubmit(e)}
          className="FormEntry"
        >
          <input
            className="fileInput"
            type="file"
            onChange={e => this._handleImageChange(e)}
          />

          <TextField
            label="Date"
            onChange={e => this._handleFieldChange(e, "Date")}
          />
          <TextField
            label="Description"
            onChange={e => this._handleFieldChange(e, "Description")}
          />
          <TextField
            label="GuestLimit"
            onChange={e => this._handleFieldChange(e, "GuestLimit")}
          />

          <Button
            className="submitButton"
            type="submit"
            //onClick={(e)=>this._handleSubmit(e)}>Upload Invitation</button>
            onClick={e => this.uploadRestCard()}
          >
            Upload Invitation
          </Button>
        </FormControl>
      </Card>
    );
  }
}

export default RestCardCreator;
