import { supabase } from "../../../lib/supabase";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { games } = req.body;

    if (!games) {
      return res.status(400).json({ error: "Data is required" });
    }

    try {
      // Upsert the single row (id=1 is the singleton)
      const { error } = await supabase
        .from("included_games")
        .upsert({ id: 1, games }, { onConflict: "id" });

      if (error) throw error;

      res.status(201).json({ message: "Games updated successfully" });
    } catch (error) {
      console.error("include POST error:", error.message);
      res.status(500).json({ error: "Failed to update games" });
    }
  } else if (req.method === "GET") {
    try {
      const { data, error } = await supabase
        .from("included_games")
        .select("*");

      if (error) throw error;

      res.status(200).json(data);
    } catch (error) {
      console.error("include GET error:", error.message);
      res.status(500).json({ error: "Failed to fetch included games" });
    }
  } else {
    res.setHeader("Allow", ["GET", "POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
