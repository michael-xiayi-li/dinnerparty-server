import React, { Component } from "react";
import {
	BrowserRouter as Router,
	Link,
	Route,
	Redirect
} from "react-router-dom";
import ListItem from "@material-ui/core/ListItem";

class InvitationButton extends Component {
	render() {
		return (
			<Link
				to="/invitations"
				style={{ textDecoration: "none", color: "#000" }}
			>
				<ListItem button> Invitations </ListItem>
			</Link>
		);
	}
}
export default InvitationButton;
