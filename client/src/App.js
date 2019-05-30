import React, { Component } from "react";
import RestCard from "./RestCard.js";
import SheetButton from "./SheetButton.js";
import ProfileButton from "./ProfileButton.js";
import CreateButton from "./CreateButton.js";
import GetButton from "./GetButton.js";
import ramen from "./ramen.jpg";
import "./Board.css";
import Dashboard from "./Dashboard.js";
import { Router } from "react-router-dom";
import RestCardCreator from "./RestCardCreator.js";
import { createBrowserHistory } from "history";

/*
class HomePage extends Component {
    render() {
        return (
            <div>
                <RestCard />
                <div className="MenuBar">
                    <ProfileButton />
                    <CreateButton />
                    <GetButton />
                </div>
            </div>
        );
    }
}
*/
const hist = createBrowserHistory();
class HomePage extends Component {
    render() {
        return (
            <Router history={hist}>
                <Dashboard />
            </Router>
        );
    }
}
//export default RestCardCreator;
export default HomePage;
