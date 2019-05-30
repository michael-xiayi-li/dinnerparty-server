import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { withStyles } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import Drawer from "@material-ui/core/Drawer";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import List from "@material-ui/core/List";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import Badge from "@material-ui/core/Badge";
import MenuIcon from "@material-ui/icons/Menu";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import NotificationsIcon from "@material-ui/icons/Notifications";
import { mainListItems, secondaryListItems } from "./listItems";
import SimpleLineChart from "./SimpleLineChart";
import SimpleTable from "./SimpleTable";
import RestCardArg from "./RestCardArg.js";
import { Router, Redirect, Route, Link } from "react-router-dom";
import axios from "axios";
import CreateButton from "./CreateButton.js";
import ProfileButton from "./ProfileButton.js";
import ListItem from "@material-ui/core/ListItem";
import SheetButton from "./SheetButton.js";
import AdminButton from "./AdminButton.js";
import GuestForm from "./GuestForm.js";
import InvitationButton from "./InvitationButton.js";
import SignIn from "./SignIn.js";

const drawerWidth = 240;

const styles = theme => ({
  root: {
    display: "flex"
  },
  toolbar: {
    paddingRight: 24 // keep right padding when drawer closed
  },
  toolbarIcon: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: "0 8px",
    ...theme.mixins.toolbar
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    })
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen
    })
  },
  menuButton: {
    marginLeft: 12,
    marginRight: 36
  },
  menuButtonHidden: {
    display: "none"
  },
  title: {
    flexGrow: 1
  },
  drawerPaper: {
    position: "relative",
    whiteSpace: "nowrap",
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen
    })
  },
  drawerPaperClose: {
    overflowX: "hidden",
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    }),
    width: theme.spacing.unit * 7,
    [theme.breakpoints.up("sm")]: {
      width: theme.spacing.unit * 9
    }
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    padding: theme.spacing.unit * 3,
    height: "100vh",
    overflow: "auto"
  },
  chartContainer: {
    marginLeft: 220
  },
  tableContainer: {
    height: 320
  },
  h5: {
    marginBottom: theme.spacing.unit * 2
  }
});

class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      cardInfo: "",
      index: 0
    };
    this.onCardIndexUpdate = this.onCardIndexUpdate.bind(this);
    this.setCardDetails = this.setCardDetails.bind(this);
    this.setCardDetails();
  }

  setCardDetails() {
    var self = this;
    var index = this.state.index;
    var requestIndex = { index: index };
    axios
      .post("http://localhost:3001/invitationList", requestIndex)
      .then(function(response) {
        console.log(response);
        if (response.data != null) {
          self.setState({ cardInfo: response.data, index: index });
          //update getButton component here
        }
      })
      .catch(function(error) {
        console.log(error);
      });
  }

  onCardIndexUpdate(indexChange) {
    var self = this;
    var index = this.state.index;
    var newIndex = Math.max(index + indexChange, 0);
    var requestIndex = { index: newIndex };
    axios
      .post("http://localhost:3001/invitationList", requestIndex)
      .then(function(response) {
        console.log(response);
        if (response.data != null) {
          self.setState({ cardInfo: response.data, index: newIndex });
          //update getButton component here
        }
      })
      .catch(function(error) {
        console.log(error);
      });
  }

  render() {
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <CssBaseline />
        <AppBar
          position="absolute"
          className={classNames(classes.appBar, classes.appBarShift)}
        >
          <Toolbar className={classes.toolbar}>
            <Typography
              component="h1"
              variant="h6"
              color="inherit"
              noWrap
              className={classes.title}
            >
              Dashboard
            </Typography>
            <IconButton color="inherit">
              <Badge badgeContent={4} color="secondary">
                <NotificationsIcon />
              </Badge>
            </IconButton>
          </Toolbar>
        </AppBar>
        <Drawer
          variant="permanent"
          classes={{
            paper: classNames(classes.drawerPaper, false)
          }}
        >
          <div className={classes.toolbarIcon} />
          <Divider />
          <List>
            <div>
              <InvitationButton />
              <ProfileButton />
              <SheetButton cardInfo={this.state.cardInfo} />
              <AdminButton />
            </div>
          </List>
          <Divider />
          <List>{secondaryListItems}</List>
        </Drawer>
        <main className={classes.content}>
          <div className={classes.appBarSpacer} />
          <Typography component="div" className={classes.chartContainer}>
            <Route
              path="/invitations"
              component={() => (
                <RestCardArg
                  cardInfo={this.state.cardInfo}
                  updateIndex={this.onCardIndexUpdate}
                />
              )}
            />
            <Route path="/admin" component={SignIn} />
          </Typography>
        </main>
      </div>
    );
  }
}

/*
            <RestCardArg
              cardInfo={this.state.cardInfo}
              updateIndex={this.onCardIndexUpdate}
            />
            */
//replace "SimpleLineChart" with RestCard when formatting is found
Dashboard.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Dashboard);
