import { supabase } from "../../../lib/supabase";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const {
      id, cover, platinum,
      dlc1Name, dlc1Trophies, dlc2Name, dlc2Trophies,
      dlc3Name, dlc3Trophies, dlc4Name, dlc4Trophies,
      dlc5Name, dlc5Trophies,
      dlc1Image, dlc2Image, dlc3Image, dlc4Image, dlc5Image,
      price,
    } = req.body;

    if (!id || !cover || !platinum) {
      return res.status(400).json({ error: "Data is required" });
    }

    try {
      const { error } = await supabase.from("platinum").insert({
        id,
        cover,
        platinum,
        dlc1_name: dlc1Name, dlc1_trophies: dlc1Trophies,
        dlc2_name: dlc2Name, dlc2_trophies: dlc2Trophies,
        dlc3_name: dlc3Name, dlc3_trophies: dlc3Trophies,
        dlc4_name: dlc4Name, dlc4_trophies: dlc4Trophies,
        dlc5_name: dlc5Name, dlc5_trophies: dlc5Trophies,
        dlc1_image: dlc1Image, dlc2_image: dlc2Image,
        dlc3_image: dlc3Image, dlc4_image: dlc4Image,
        dlc5_image: dlc5Image,
        price,
      });

      if (error) throw error;

      res.status(201).json({ message: "Game added successfully" });
    } catch (error) {
      console.error("platinum POST error:", error.message);
      res.status(500).json({ error: "Failed to add game" });
    }
  } else if (req.method === "GET") {
    try {
      const { data, error } = await supabase.from("platinum").select("*");

      if (error) throw error;

      // Map snake_case columns back to camelCase for frontend compatibility
      const mapped = data.map((row) => ({
        ...row,
        dlc1Name: row.dlc1_name, dlc1Trophies: row.dlc1_trophies,
        dlc2Name: row.dlc2_name, dlc2Trophies: row.dlc2_trophies,
        dlc3Name: row.dlc3_name, dlc3Trophies: row.dlc3_trophies,
        dlc4Name: row.dlc4_name, dlc4Trophies: row.dlc4_trophies,
        dlc5Name: row.dlc5_name, dlc5Trophies: row.dlc5_trophies,
        dlc1Image: row.dlc1_image, dlc2Image: row.dlc2_image,
        dlc3Image: row.dlc3_image, dlc4Image: row.dlc4_image,
        dlc5Image: row.dlc5_image,
      }));

      res.status(200).json(mapped);
    } catch (error) {
      console.error("platinum GET error:", error.message);
      res.status(500).json({ error: "Failed to fetch platinum data" });
    }
  } else {
    res.setHeader("Allow", ["GET", "POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
