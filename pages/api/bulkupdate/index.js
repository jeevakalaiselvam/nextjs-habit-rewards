import { supabase } from "../../../lib/supabase";

export default async function handler(req, res) {
  const { id, total } = req.query;

  if (req.method === "GET") {
    try {
      const { error } = await supabase
        .from("achievements")
        .update({ total })
        .eq("game_id", id);

      if (error) throw error;

      res.status(200).json({ message: "Achievement updated successfully" });
    } catch (error) {
      console.error("bulkupdate error:", error.message);
      res.status(500).json({ error: "Failed to update achievement" });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
