var express = require("express");
var app = express();
var cors = require("cors");
const bodyParser = require("body-parser");
var mongoose = require("mongoose");
var MongoClient = require("mongodb").MongoClient;
var multer = require("multer");
var upload = multer({
  dest: "uploads/",
  limits: { fieldSize: 4 * 1024 * 1024 }
});
var config = require("./config.json");
var Mailchimp = require("mailchimp-api-v3");
const ObjectId = mongoose.Types.ObjectId;
var mailchimp = new Mailchimp(config.mailchimpAPI);

var db;

//michaelxiayili
//dp2019
var db_uri =
  "mongodb://" +
  config.db_username +
  ":" +
  config.db_password +
  "@ds151076.mlab.com:51076/dinnerparty-db";
//MongoClient.connect('mongodb://localhost:27017', (err,database) => {

MongoClient.connect(db_uri, (err, database) => {
  if (err) return console.log(err);
  db = database.db("dinnerparty-db");
  db.createCollection("guests", function(err, res) {
    if (err) throw err;
  });
  db.createCollection("parties", function(err, res) {
    if (err) throw err;
  });
});

//e-mail capabilities
/////////////////////////////////////////////////////////////////
var nodemailer = require("nodemailer");

var transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: config.email_username,
    pass: config.email_password
  }
});

///////////////////////////////////////////////////////////////////

app.use(
  bodyParser.urlencoded({
    extended: true
  })
);

app.use(bodyParser.json());



app.post("/postForm", (req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");

  var oid = req.body.id;

  db.collection("parties").findOne({ _id: ObjectId(oid) }, function(
    err,
    result
  ) {
    if (err) console.log(err);

    if (result.GuestNumber >= result.GuestLimit) {
      console.log("guests at capcity");
      email_rejection(req, res);
    } else {
      email_and_add_to_mailchimp(req, res);
      db.collection("guests").insertOne(req.body);
      db.collection("parties").findOneAndUpdate(
        { _id: ObjectId(oid) },
        { $inc: { GuestNumber: 1 } },
        function(error, result) {
          if (error) return console.log(error);
        }
      );
    }
  });

  res.sendStatus(200);
});

function email_rejection(req, res) {
  var mailOptions = {
    from: "michaelxiayili@gmail.com",
    to: req.body["E-mail"],
    subject: "Sorry, dinner is full!",
    text:
      "Hey, \nSo it looks like we're currently full right now, if you have any questions, e-mail me back!"
  };
  transporter.sendMail(mailOptions, function(error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
}
function email_and_add_to_mailchimp(req, res) {
  var mailOptions = {
    from: "michaelxiayili@gmail.com",
    to: req.body["E-mail"],
    subject: "Save the Date!",
    text: "Vishnu is a walking mouth with a narcissistic complex"
  };

  transporter.sendMail(mailOptions, function(error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });

  mailchimp
    .get("/lists")
    .then(function(results) {
      console.log(results);
    })
    .catch(function(err) {
      console.log(err);
    });

  mailchimp
    .post("/lists/" + config.mailchimpListID + "/members", {
      email_address: req.body["E-mail"],
      status: "subscribed"
    })
    .then(function(results) {
      console.log("success");
    })
    .catch(function(err) {
      console.log(err);
    });

  mailchimp
    .get("/lists/" + config.mailchimpListID + "/segments")
    .then(function(results) {
      var segments = results["segments"];
      for (var i = 0; i < segments.length; i++) {
        console.log("segments");
        var segment = segments[i];
        if (segment["name"] == req.body["id"]) {
          mailchimp
            .post(
              "/lists/" +
                config.mailchimpListID +
                "/segments/" +
                segment["id"] +
                "/members",
              {
                email_address: req.body["E-mail"]
              }
            )
            .then(function(results) {
              console.log("successtag");
            })
            .catch(function(err) {
              console.log(err);
            });
        }
      }
    })
    .catch(function(err) {
      console.log(err);
    });
}

app.post(
  "/postRestCardCreator",
  upload.single("fileHandler"),
  (req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");

    db.collection("parties").insertOne(req.body, function(err, result) {
      var insertedID = result["ops"][0]["_id"];

      mailchimp
        .post("/lists/" + config.mailchimpListID + "/segments", {
          name: insertedID,
          static_segment: []
        })
        .then(function(results) {
          console.log("success");
        })
        .catch(function(err) {
          console.log(err);
        });

      //convert strings in db to int
      db.collection("parties")
        .find({ _id: ObjectId(insertedID) })
        .forEach(function(data) {
          db.collection("parties").updateOne(
            {
              _id: data._id,
              Date: data.Date,
              Description: data.Description,
              image: data.image
            },
            {
              $set: {
                GuestLimit: parseInt(data.GuestLimit),
                GuestNumber: parseInt(data.GuestNumber)
              }
            }
          );
        });
    });
    res.sendStatus(200);
  }
);

app.post("/login", (req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  console.log("verifying");
  var email = req.body.email;
  var password = req.body.password;

  var auth = email == config.admin_email && password == config.admin_password;

  var response = { authenticated: auth };
  res.jsonp(response);
});
app.get("/invitationCard", (req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  db.collection("parties").findOne({}, function(err, result) {
    if (err) return console.log(err);
    res.jsonp(result);
  });
});

app.post("/invitationList", (req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  console.log("registered");

  console.log(req.body["index"]);
  var index = req.body["index"];
  console.log(req.body);

  var partyQuery = db
    .collection("parties")
    .find()
    .sort({ Date: 1 });

  var track = 0;

  partyQuery.each(function(err, doc) {
    if (track == index) {
      res.jsonp(doc);
    }
    if (doc != null) {
      console.log(doc["Date"]);
    }
    track = track + 1;
  });
});

app.use(cors());

app.listen(3001, () => {
  console.log("Server running on port 3001");
});

const fs = require("fs");
const readline = require("readline");
const { google } = require("googleapis");

// If modifying these scopes, delete token.json.
const SCOPES = ["https://www.googleapis.com/auth/spreadsheets"];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = "token.json";

app.get("/guestList/:invitationId", (req, res) => {});

app.get("/createGuestSheet", (req, res, next) => {
  // Load client secrets from a local file.
  console.log("sheet");
  console.log(req.query);
  fs.readFile("credentials.json", (err, content) => {
    if (err) return console.log("Error loading client secret file:", err);
    // Authorize a client with credentials, then call the Google Sheets API.
    authorizeRes(JSON.parse(content), createGuestList, req, res);
  });
});

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorizeRes(credentials, callback, req, res) {
  const { client_secret, client_id, redirect_uris } = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(
    client_id,
    client_secret,
    redirect_uris[0]
  );

  // Check if we have previously stored a token.
  fs.readFile(TOKEN_PATH, (err, token) => {
    if (err) return getNewToken(oAuth2Client, callback);
    oAuth2Client.setCredentials(JSON.parse(token));
    callback(oAuth2Client, req, res);
  });
}

/**
 e* Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials, callback) {
  const { client_secret, client_id, redirect_uris } = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(
    client_id,
    client_secret,
    redirect_uris[0]
  );

  // Check if we have previously stored a token.
  fs.readFile(TOKEN_PATH, (err, token) => {
    if (err) return getNewToken(oAuth2Client, callback);
    oAuth2Client.setCredentials(JSON.parse(token));
    callback(oAuth2Client);
  });
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback for the authorized client.
 */
function getNewToken(oAuth2Client, callback) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: "offline",
    scope: SCOPES
  });
  console.log("Authorize this app by visiting this url:", authUrl);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  rl.question("Enter the code from that page here: ", code => {
    rl.close();
    oAuth2Client.getToken(code, (err, token) => {
      if (err)
        return console.error(
          "Error while trying to retrieve access token",
          err
        );
      oAuth2Client.setCredentials(token);
      // Store the token to disk for later program executions
      fs.writeFile(TOKEN_PATH, JSON.stringify(token), err => {
        if (err) console.error(err);
        console.log("Token stored to", TOKEN_PATH);
      });
      callback(oAuth2Client);
    });
  });
}

/**
 * Prints the names and majors of students in a sample spreadsheet:
 * @see https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit
 * @param {google.auth.OAuth2} auth The authenticated Google OAuth client.
 */
function listMajors(auth) {
  const sheets = google.sheets({ version: "v4", auth });
  sheets.spreadsheets.values.get(
    {
      spreadsheetId: "1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms",
      range: "Class Data!A2:E"
    },
    (err, res) => {
      if (err) return console.log("The API returned an error: " + err);
      const rows = res.data.values;
      if (rows.length) {
        console.log("Name, Major:");
        // Print columns A and E, which correspond to indices 0 and 4.
        rows.map(row => {
          console.log(`${row[0]}, ${row[4]}`);
        });
      } else {
        console.log("No data found.");
      }
    }
  );
}

function createGuestList(auth, req, res) {
  const resource = {
    properties: {
      title: "guestList"
    }
  };

  const sheets = google.sheets({ version: "v4", auth });
  sheets.spreadsheets.create(
    {
      resource,
      fields: "spreadsheetId"
    },
    (err, spreadsheet) => {
      if (err) {
        console.log(err);
      } else {
        console.log(spreadsheet.data.spreadsheetId);
        var spreadsheetID = spreadsheet.data.spreadsheetId;

        populateGuestList(spreadsheetID, auth, req, res);

        //console.log(JSON.stringify(spreadsheet, null, 2));
      }
    }
  );
}

function populateGuestList(spreadsheetID, auth, req, res) {
  const sheets = google.sheets({ version: "v4", auth });

  let values = [
    [
      // Cell values ...

      "Name",
      "E-mail",
      "Dietary Restrictions"
    ]
    // Additional rows ...
  ];

  const resource = {
    values
  };

  sheets.spreadsheets.values.update(
    {
      spreadsheetId: spreadsheetID,
      range: "Sheet1",
      valueInputOption: "RAW",
      resource
    },
    (err, result) => {
      if (err) {
        // Handle error
        console.log(err);
      } else {
        db.collection("guests")
          .find({})
          .toArray(function(err, result) {
            if (err) throw err;
            var row = 0;
            for (var i = 0; i < result.length; i++) {
              if (result[i]["id"] == req.query.cardId) {
                guest = [
                  result[i]["Name"],
                  result[i]["E-mail"],
                  result[i]["Dietary Restrictions"]
                  // result[i]["id"]
                ];
                addGuestRow(guest, spreadsheetID, auth, row + 2);
                row = row + 1;
              }
            }

            var sheetURL = {
              spreadsheetID: spreadsheetID
            };
            res.json(sheetURL);
          });
      }
    }
  );
}

function addSheetRow(guest, spreadsheetID, auth) {
  const sheets = google.sheets({ version: "v4", auth });
  console.log(guest);

  sheets.spreadsheets.values.get(
    {
      spreadsheetId: spreadsheetID,
      range: "Sheet1!A:A"
      //  valueInputOption: 'RAW',
    },
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        var guestRow = result.data.values.length + 1;

        addGuestRow(guest, spreadsheetID, auth, guestRow);
      }
    }
  );
}

function addGuestRow(guest, spreadsheetID, auth, row) {
  const sheets = google.sheets({ version: "v4", auth });
  let values = [
    // Cell values ...
    guest
    // Additional rows ...
  ];
  const resource = {
    values
  };

  sheets.spreadsheets.values.update({
    spreadsheetId: spreadsheetID,
    range: "Sheet1!A" + row,
    valueInputOption: "RAW",
    resource
  }),
    (err, result) => {
      if (err) {
        console.log(err);
      }
    };
}
