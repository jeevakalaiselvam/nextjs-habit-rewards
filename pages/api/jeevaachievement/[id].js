import { supabase } from "../../../lib/supabase";

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method === "PUT") {
    const { id: gameId, cover, platinum } = req.body;

    let parsedPlatinum;
    try {
      parsedPlatinum = JSON.parse(platinum);
    } catch (e) {
      return res.status(400).json({ error: "Invalid platinum JSON" });
    }

    try {
      const { error, count } = await supabase
        .from("all_games")
        .update({ cover, platinum: parsedPlatinum })
        .eq("id", gameId);

      if (error) throw error;
      if (count === 0) return res.status(404).json({ error: "Document not found" });

      res.status(200).json({ message: "Document updated successfully" });
    } catch (error) {
      console.error("jeevaachievement PUT error:", error.message);
      res.status(500).json({ error: "Failed to update document" });
    }
  } else if (req.method === "DELETE") {
    try {
      const { error, count } = await supabase
        .from("achievements")
        .delete()
        .eq("id", id);

      if (error) throw error;
      if (count === 0) return res.status(404).json({ error: "Achievement not found" });

      res.status(200).json({ message: "Achievement deleted successfully" });
    } catch (error) {
      console.error("jeevaachievement DELETE error:", error.message);
      res.status(500).json({ error: "Failed to delete achievement" });
    }
  } else {
    res.setHeader("Allow", ["PUT", "DELETE"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
