const express = require("express");
const cors = require('cors');
const { google } = require("googleapis");
const middleware = require('./middleware');
const bodyParser = require('body-parser')

const app = express();
app.set("view engine", "ejs");
// create application/json parser
var jsonParser = bodyParser.json()
 
// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false })
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(middleware.decodeToken);

app.get("/", async (req, res) => {
    const auth = new google.auth.GoogleAuth({
    keyFile: "credentials.json",
    scopes: "https://www.googleapis.com/auth/spreadsheets",
    });

    // Create client instance for auth
    const client = await auth.getClient();

    // Instance of Google Sheets API
    const googleSheets = google.sheets({ version: "v4", auth: client });

    const spreadsheetId = "1tKGznqnMPUxH0P53WOQ-Ckdz1hlL4H298uE7vu0b6yc";

    // Read rows from spreadsheet
    const getRows = await googleSheets.spreadsheets.values.get({
    auth,
    spreadsheetId,
    range: "Hoja 1",
  });

    res.send(getRows.data);
});

app.post("/", jsonParser, async (req, res) => {
  const { estado, ubicacion} = req.body;
  console.log(req.body)

  const auth = new google.auth.GoogleAuth({
    keyFile: "credentials.json",
    scopes: "https://www.googleapis.com/auth/spreadsheets",
  });

  // Create client instance for auth
  const client = await auth.getClient();

  // Instance of Google Sheets API
  const googleSheets = google.sheets({ version: "v4", auth: client });

  const spreadsheetId = "1tKGznqnMPUxH0P53WOQ-Ckdz1hlL4H298uE7vu0b6yc";

  // Write row(s) to spreadsheet
  await googleSheets.spreadsheets.values.update({
    auth,
    spreadsheetId,
    range: `Hoja 1!A${ubicacion}`,
    valueInputOption: "USER_ENTERED",
    resource: {
      values: [[estado]],
    },
  }).then((response) => {
    console.log(response);
  });

  res.send("Successfully submitted! Thank you!");
});

app.listen(3000, (req, res) => console.log("running on 3000"));