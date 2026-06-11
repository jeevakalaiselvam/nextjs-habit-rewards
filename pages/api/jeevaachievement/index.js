import { supabase } from "../../../lib/supabase";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { name, title, description, type, value, priority, total, completed } = req.body;

    if (!name || !title || !description || !type || !value || !priority) {
      return res.status(400).json({ error: "Name, Title, Description, Type required" });
    }

    try {
      const { error } = await supabase.from("achievements").insert({
        game_id: value,
        name,
        title,
        description,
        type,
        priority,
        total: total ?? 1,
        completed: completed ?? 0,
        unlocked: new Date().toISOString(),
        achieved: false,
      });

      if (error) throw error;

      res.status(201).json({ message: "Achievement added successfully" });
    } catch (error) {
      console.error("jeevaachievement POST error:", error.message);
      res.status(500).json({ error: "Failed to add achievement" });
    }
  } else if (req.method === "GET") {
    try {
      const { data, error } = await supabase.from("achievements").select("*");

      if (error) throw error;

      res.status(200).json(data);
    } catch (error) {
      console.error("jeevaachievement GET error:", error.message);
      res.status(500).json({ error: "Failed to fetch achievements" });
    }
  } else {
    res.setHeader("Allow", ["GET", "POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
