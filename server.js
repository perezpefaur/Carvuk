const express = require("express");
const { google } = require("googleapis");
const middleware = require('./middleware');

const app = express();
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
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

app.post("/", async (req, res) => {
  const { request, name } = req.body;

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
    range: "Sheet1!A:A",
  });

  // Write row(s) to spreadsheet
  await googleSheets.spreadsheets.values.append({
    auth,
    spreadsheetId,
    range: "Sheet1!A:B",
    valueInputOption: "USER_ENTERED",
    resource: {
      values: [[request, name]],
    },
  });

  res.send("Successfully submitted! Thank you!");
});

app.listen(1337, (req, res) => console.log("running on 1337"));