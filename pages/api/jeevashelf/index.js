import clientPromise from "../../../lib/db";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { shelfName, type } = req.body;

    if (!shelfName) {
      return res.status(400).json({ error: "Field are required" });
    }

    try {
      const client = await clientPromise;
      const db = client.db("habittracker");
      await db.collection("allshelf").insertOne({
        shelfName,
        type,
        created: new Date(),
      });

      res.status(201).json({ message: "Item added successfully" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Failed to add spends" });
    }
  } else if (req.method === "GET") {
    try {
      const client = await clientPromise;
      const db = client.db("habittracker");

      let allAchievements = [];

      const alllibrary = await db.collection("allshelf").find({}).toArray();

      res.status(200).json(alllibrary);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch Jeeva Achievements" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
