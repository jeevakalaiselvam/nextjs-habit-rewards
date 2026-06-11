import { supabase } from "../../../lib/supabase";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { achievements, value } = req.body;

    try {
      // Delete all existing achievements for this game then insert the new set
      const { error: deleteError } = await supabase
        .from("achievements")
        .delete()
        .eq("game_id", value);

      if (deleteError) throw deleteError;

      const rows = achievements.map((ach) => ({ ...ach, game_id: value }));
      const { error: insertError } = await supabase
        .from("achievements")
        .insert(rows);

      if (insertError) throw insertError;

      res.status(201).json({
        message: `Replaced with ${achievements.length} new achievements successfully`,
      });
    } catch (error) {
      console.error("onboard POST error:", error.message);
      res.status(500).json({ error: "Failed to update achievements" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
