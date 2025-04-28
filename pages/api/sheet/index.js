import { google } from "googleapis";
import path from "path";
import { promises as fs } from "fs";

export default async function handler(req, res) {
  // Load your service account key file
  const keyFilePath = path.join(process.cwd(), "jeeva.json");
  const keyFile = await fs.readFile(keyFilePath, "utf-8");
  const auth = new google.auth.GoogleAuth({
    credentials: JSON.parse(keyFile),
    scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
  });

  console.log(path.join(process.cwd(), "jeeva.json"));
  const sheets = google.sheets({ version: "v4", auth });

  const spreadsheetId = "1YsthWPBobu38pwyXJEAt0PXbuNgB1Mzpq55gg_AHf8Q"; // From your sheet URL
  const range = "Games"; // Adjust based on your sheet

  const response = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range,
  });

  const rows = response.data.values;

  res.status(200).json({ rows });
}
