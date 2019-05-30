import React from "react";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Link from "@material-ui/core/Link";
import Grid from "@material-ui/core/Grid";
import { withStyles } from "@material-ui/core/styles";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Modal from "react-modal";
import axios from "axios";
import RestCardCreator from "./RestCardCreator.js";

function MadeWithLove() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {"Built with love by the "}
      <Link color="inherit" href="https://material-ui.com/">
        Material-UI
      </Link>
      {" team."}
    </Typography>
  );
}

const useStyles = makeStyles(theme => ({
  "@global": {
    body: {
      backgroundColor: theme.palette.common.white
    }
  },
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1)
  },
  submit: {
    margin: theme.spacing(3, 0, 2)
  },
  modalForm: {
    zIndex: 2000
  }
}));

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

class SignIn extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      modalIsOpen: false
    };

    this.openModal = this.openModal.bind(this);
    this.afterOpenModal = this.afterOpenModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.submitInfo = this.submitInfo.bind(this);
  }

  openModal() {
    let nextState = this.state;
    nextState.modalIsOpen = true;
    this.setState(nextState);
  }
  afterOpenModal() {}
  closeModal() {
    let nextState = this.state;
    nextState.modalIsOpen = false;
    this.setState(nextState);
  }

  _handleFieldChange(e, label) {
    e.preventDefault();

    var nextState = this.state;
    nextState[label] = e.target.value;

    this.setState(nextState);
  }

  submitInfo() {
    var self = this;
    var bodyFormData = {
      email: this.state.email,
      password: this.state.password
    };
    axios
      .post("http://localhost:3001/login", bodyFormData)
      .then(function(response) {
        console.log(response.data);
        if (response.data.authenticated) {
          self.openModal();
        }
      })
      .catch(function(err) {
        if (err) console.log(err);
      });
  }

  render() {
    const classes = this.props;
    return (
      <div component="main" maxWidth="xs">
        <CssBaseline />
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <form className={classes.form}>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="email"
              onChange={e => this._handleFieldChange(e, "email")}
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              onChange={e => this._handleFieldChange(e, "password")}
              autoComplete="current-password"
            />
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            />
            <Button
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
              onClick={this.submitInfo}
            >
              Sign In
            </Button>
            <Grid container>
              <Grid item xs />
              <Grid item />
            </Grid>
          </form>
        </div>
        <div mt={5}>
          <MadeWithLove />
        </div>

        <Modal
          isOpen={this.state.modalIsOpen}
          onAfterOpen={this.afterOpenModal}
          onRequestClose={this.closeModal}
          style={customStyles}
        >
          <RestCardCreator
            close={this.closeModal}
            className={classes.modalForm}
          />
        </Modal>
      </div>
    );
  }
}

export default withStyles(useStyles)(SignIn);
