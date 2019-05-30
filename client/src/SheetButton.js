import React, { Component } from "react";
import axios from "axios";
import ListItem from "@material-ui/core/ListItem";

class SheetButton extends Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    var cardId = this.props.cardInfo._id;
    axios
      .get("http://localhost:3001/createGuestSheet", {
        params: {
          cardId: cardId
        }
      })
      .then(function(response) {
        console.log("received");
        var sheetURL = response["data"]["spreadsheetID"];
        console.log(response["data"]["spreadsheetID"]);

        window.open("https://docs.google.com/spreadsheets/d/" + sheetURL);
      })
      .catch(function(error) {
        console.log(error);
      });
  }
  render() {
    return (
      <ListItem button onClick={this.handleClick}>
        Get Guest List
      </ListItem>
    );
  }
}

export default SheetButton;
