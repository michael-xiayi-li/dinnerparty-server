




/*

key=AIzaSyC1rV4FPt4r47C75pFhkjjZkv6uUcIyXQM


client_id=347313223605-t41c61fltpq2mr9m1bp5nbb2o5g274c2.apps.googleusercontent.com



client secret = IQbq4dXntvjvx35E7NLo8qZ_


NOde:

client_id=1001308905487-trfjoul27s7gv838enimo51c0eotv73a.apps.googleusercontent.com

client_secret=pimsAxVTvIBQJgLxs1X7V8cG

*/

const fs = require('fs');
const readline = require('readline');
const {google} = require('googleapis');

// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = 'token.json';







app.get("/createGuestSheet", (req,res,next) => {
  // Load client secrets from a local file.
  fs.readFile('credentials.json', (err, content) => {
    if (err) return console.log('Error loading client secret file:', err);
    // Authorize a client with credentials, then call the Google Sheets API.
    authorizeRes(JSON.parse(content), createGuestList,res);
  });




});



/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorizeRes(credentials, callback,res) {
  const {client_secret, client_id, redirect_uris} = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(
      client_id, client_secret, redirect_uris[0]);

  // Check if we have previously stored a token.
  fs.readFile(TOKEN_PATH, (err, token) => {
    if (err) return getNewToken(oAuth2Client, callback);
    oAuth2Client.setCredentials(JSON.parse(token));
    callback(oAuth2Client,res);
  });
}




/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials, callback) {
  const {client_secret, client_id, redirect_uris} = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(
      client_id, client_secret, redirect_uris[0]);

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
    access_type: 'offline',
    scope: SCOPES,
  });
  console.log('Authorize this app by visiting this url:', authUrl);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question('Enter the code from that page here: ', (code) => {
    rl.close();
    oAuth2Client.getToken(code, (err, token) => {
      if (err) return console.error('Error while trying to retrieve access token', err);
      oAuth2Client.setCredentials(token);
      // Store the token to disk for later program executions
      fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
        if (err) console.error(err);
        console.log('Token stored to', TOKEN_PATH);
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
  const sheets = google.sheets({version: 'v4', auth});
  sheets.spreadsheets.values.get({
    spreadsheetId: '1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms',
    range: 'Class Data!A2:E',
  }, (err, res) => {
    if (err) return console.log('The API returned an error: ' + err);
    const rows = res.data.values;
    if (rows.length) {
      console.log('Name, Major:');
      // Print columns A and E, which correspond to indices 0 and 4.
      rows.map((row) => {
        console.log(`${row[0]}, ${row[4]}`);
      });
    } else {
      console.log('No data found.');
    }
  });
}






function createGuestList(auth,res){
  


  const resource = {
  properties: {
    title: 'guestList',
  },
  };

  const sheets = google.sheets({version: 'v4', auth});
  sheets.spreadsheets.create({
      resource,
        fields: 'spreadsheetId',
  },(err, spreadsheet) =>{
    
    if (err){
      
      console.log(err);
    }
  else{
    
    console.log(spreadsheet.data.spreadsheetId);
    var spreadsheetID = spreadsheet.data.spreadsheetId;

    populateGuestList(spreadsheetID,auth,res);

    //console.log(JSON.stringify(spreadsheet, null, 2));
  }
});
}


function populateGuestList(spreadsheetID,auth,res){


  const sheets = google.sheets({version: 'v4', auth});



  let values = [
  [
    // Cell values ...

    "Name", "E-mail","Dietary Restrictions", "ID",
  ],
  // Additional rows ...
  ];

  const resource = {
  values,
  };


  sheets.spreadsheets.values.update({
  spreadsheetId: spreadsheetID,
  range: "Sheet1",
  valueInputOption: 'RAW',
  resource,
    }, (err, result) => {
  if (err) {
    // Handle error
    console.log(err);
  } else {
    
    db.collection("guests").find({}).toArray(function(err, result) {
    if (err) throw err;
  
  
      for (var i=0;i<result.length;i++){
        

          guest = [result[i]['Name'], result[i]['E-mail'], result[i]['Dietary Restrictions'], result[i]['id']];
          addGuestRow(guest,spreadsheetID,auth,i+2);

      }


      var sheetURL = {
        'spreadsheetID' : spreadsheetID,
      }
      res.json(sheetURL);
    });
  }
});





}

function addSheetRow(guest,spreadsheetID,auth){
  


  const sheets = google.sheets({version: 'v4', auth});
  console.log(guest);

  sheets.spreadsheets.values.get({
  spreadsheetId: spreadsheetID,
  range: "Sheet1!A:A",
//  valueInputOption: 'RAW',
  }, (err, result)=>{
    if(err){
        console.log(err);
    }
    else{
      var guestRow = result.data.values.length +1;

      addGuestRow(guest,spreadsheetID,auth,guestRow);


    }
  });

}

function addGuestRow(guest,spreadsheetID,auth, row){

    const sheets = google.sheets({version: 'v4', auth});
    let values = [
    // Cell values ...
    guest,
  // Additional rows ...
  ];
  const resource = {
  values,
  };

   sheets.spreadsheets.values.update({

  spreadsheetId: spreadsheetID,
  range: "Sheet1!A"+row,
  valueInputOption: 'RAW',
  resource,

    }), (err,result)=>{
          if(err){
            console.log(err);
          }
        }


}