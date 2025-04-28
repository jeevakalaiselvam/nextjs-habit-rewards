import { google } from "googleapis";
import path from "path";
import { promises as fs } from "fs";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST requests allowed" });
  }

  const keyFilePath = path.join(process.cwd(), "jeeva.json");
  const keyFile = await fs.readFile(keyFilePath, "utf-8");

  const auth = new google.auth.GoogleAuth({
    credentials: JSON.parse(keyFile),
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  const sheets = google.sheets({ version: "v4", auth });

  const spreadsheetId = "1YsthWPBobu38pwyXJEAt0PXbuNgB1Mzpq55gg_AHf8Q";

  // You must send the row and data in the body
  const { range, values } = req.body;

  try {
    const response = await sheets.spreadsheets.values.update({
      spreadsheetId,
      range, // Example: "Games!A2:E2"
      valueInputOption: "RAW", // or "USER_ENTERED"
      requestBody: {
        values: [values],
      },
    });

    res.status(200).json({ updatedCells: response.data.updatedCells });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
}
