import clientPromise from "../../../lib/db";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { games } = req.body;

    if (!games) {
      return res.status(400).json({ error: "Data is required" });
    }

    try {
      const client = await clientPromise;
      const db = client.db("habittracker");

      await db.collection("includedGames").updateOne(
        {}, // no filter → update the single doc
        { $set: { games } }, // replace array with new list
        { upsert: true } // create if not exist
      );

      res.status(201).json({ message: "Games updated successfully" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Failed to update games" });
    }
  } else if (req.method === "GET") {
    try {
      const client = await clientPromise;
      const db = client.db("habittracker");

      const jeevagame = await db.collection("includedGames").find({}).toArray();
      res.status(200).json(jeevagame);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch Jeeva Achievements" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
