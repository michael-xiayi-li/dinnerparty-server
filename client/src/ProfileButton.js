import React, { Component } from "react";
import TypeFormInvite from "./TypeFormInvite.js";
import ListItem from "@material-ui/core/ListItem";
import {
	BrowserRouter as Router,
	Link,
	Route,
	Redirect
} from "react-router-dom";
import Button from "@material-ui/core/Button";

class ProfileButton extends Component {
	constructor(props) {
		super(props);
		this.handleClick = this.handleClick.bind(this);
	}
	handleClick = () => {
		window.open("https://michaelli050007.typeform.com/to/axIBzW");
	};

	render() {
		return (
			<ListItem button onClick={this.handleClick}>
				Make A Profile
			</ListItem>
		);
	}
}

export default ProfileButton;
