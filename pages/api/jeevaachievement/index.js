import clientPromise from "../../../lib/db";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { name, title, color } = req.body;

    if (!name || !title || !color) {
      return res.status(400).json({ error: "Name, Title, Color required" });
    }

    // Determine which field to increment
    const validColors = ["platinum", "gold", "silver", "bronze"];
    if (!validColors.includes(color.toLowerCase())) {
      return res.status(400).json({ error: "Invalid trophy color" });
    }

    try {
      const client = await clientPromise;
      const db = client.db("habittracker");

      const collection = db.collection("allgames");

      const existingGame = await collection.findOne({ title });

      if (existingGame) {
        // Update the existing game by incrementing the appropriate trophy count
        await collection.updateOne(
          { title },
          {
            $inc: { [color.toLowerCase()]: 1 },
            $set: { updatedAt: new Date() },
          }
        );
      } else {
        // Create new game document with the appropriate color count
        const newGame = {
          name,
          title,
          color,
          platinum: 0,
          gold: 0,
          silver: 0,
          bronze: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        newGame[color.toLowerCase()] = 1;

        await collection.insertOne(newGame);
      }

      res.status(201).json({ message: "Achievement recorded successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to record achievement" });
    }
  } else if (req.method === "GET") {
    try {
      const client = await clientPromise;
      const db = client.db("habittracker");

      const achievements = await db.collection("allgames").find({}).toArray();
      res.status(200).json(achievements);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to fetch achievements" });
    }
  } else {
    res.setHeader("Allow", ["POST", "GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
