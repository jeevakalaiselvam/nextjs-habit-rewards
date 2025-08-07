import clientPromise from "../../../lib/db";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { name, title, description, color, header } = req.body;

    if (!name || !title || !description || !color || !header) {
      return res
        .status(400)
        .json({ error: "Name, Title, Description, Type required" });
    }

    try {
      const client = await clientPromise;
      const db = client.db("habittracker");
      await db.collection("allgames").insertOne({
        name,
        title,
        description,
        color,
        header,
        unlocked: new Date(),
      });

      res.status(201).json({ message: "Achievement added successfully" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Failed to add spends" });
    }
  } else if (req.method === "GET") {
    try {
      const client = await clientPromise;
      const db = client.db("habittracker");

      let allAchievements = [];

      const jeevagames = await db.collection("allgames").find({}).toArray();

      res.status(200).json(jeevagames);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch Jeeva Achievements" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
