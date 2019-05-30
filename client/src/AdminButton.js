import React, { Component } from "react";
import {
	BrowserRouter as Router,
	Link,
	Route,
	Redirect
} from "react-router-dom";
import ListItem from "@material-ui/core/ListItem";
import GuestForm from "./GuestForm.js";

class AdminButton extends Component {
	render() {
		return (
			<Link to="/admin" style={{ textDecoration: "none", color: "#000" }}>
				<ListItem button> Admin </ListItem>
			</Link>
		);
	}
}
export default AdminButton;
