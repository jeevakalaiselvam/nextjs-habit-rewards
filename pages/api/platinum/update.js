import { supabase } from "../../../lib/supabase";

export default async function handler(req, res) {
  if (req.method === "PUT") {
    const {
      id, cover, platinum,
      dlc1Name, dlc1Trophies, dlc2Name, dlc2Trophies,
      dlc3Name, dlc3Trophies, dlc4Name, dlc4Trophies,
      dlc5Name, dlc5Trophies,
      dlc1Image, dlc2Image, dlc3Image, dlc4Image, dlc5Image,
      price,
    } = req.body;

    let parsedPlatinum, parseddlc1Trophies, parseddlc2Trophies,
      parseddlc3Trophies, parseddlc4Trophies, parseddlc5Trophies;
    try {
      parsedPlatinum = JSON.parse(platinum);
      parseddlc1Trophies = JSON.parse(dlc1Trophies);
      parseddlc2Trophies = JSON.parse(dlc2Trophies);
      parseddlc3Trophies = JSON.parse(dlc3Trophies);
      parseddlc4Trophies = JSON.parse(dlc4Trophies);
      parseddlc5Trophies = JSON.parse(dlc5Trophies);
    } catch (e) {
      console.error("JEEVA", e);
      return res.status(400).json({ error: "Invalid platinum JSON" });
    }

    try {
      const { data, error } = await supabase
        .from("platinum")
        .upsert({
          id,
          cover,
          platinum: parsedPlatinum,
          dlc1_name: dlc1Name, dlc1_trophies: parseddlc1Trophies,
          dlc2_name: dlc2Name, dlc2_trophies: parseddlc2Trophies,
          dlc3_name: dlc3Name, dlc3_trophies: parseddlc3Trophies,
          dlc4_name: dlc4Name, dlc4_trophies: parseddlc4Trophies,
          dlc5_name: dlc5Name, dlc5_trophies: parseddlc5Trophies,
          dlc1_image: dlc1Image, dlc2_image: dlc2Image,
          dlc3_image: dlc3Image, dlc4_image: dlc4Image,
          dlc5_image: dlc5Image,
          price,
        }, { onConflict: "id" })
        .select();

      if (error) throw error;

      const wasInserted = data?.[0] && !data[0].updated_at;
      res
        .status(wasInserted ? 201 : 200)
        .json({ message: wasInserted ? "Document created successfully" : "Document updated successfully" });
    } catch (error) {
      console.error("platinum update error:", error.message);
      res.status(500).json({ error: "Failed to update or create document" });
    }
  } else {
    res.setHeader("Allow", ["PUT"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
