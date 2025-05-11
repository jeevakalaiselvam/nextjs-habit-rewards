import clientPromise from "../../../lib/db";

const COLLECTION_NAME = "game_data";
const DOC_ID = "ach_tracker"; // single document to track all achievements

export default async function handler(req, res) {
  const client = await clientPromise;
  const db = client.db("habittracker");
  const collection = db.collection("completedAchievements");

  if (req.method === "POST") {
    const { title } = req.body;
    if (!title) return res.status(400).json({ error: "Missing title" });

    const newAch = {
      title,
      createdAt: new Date(),
    };

    await collection.updateOne(
      { _id: DOC_ID },
      { $push: { achievements: newAch } },
      { upsert: true }
    );

    res.status(201).json({ success: true, data: newAch });
  } else if (req.method === "GET") {
    const doc = await collection.findOne({ _id: DOC_ID });
    res.status(200).json({ achievements: doc?.achievements || [] });
  } else if (req.method === "DELETE") {
    const { title } = req.body;
    if (!title) return res.status(400).json({ error: "Missing title" });

    const result = await collection.updateOne(
      { _id: DOC_ID },
      { $pull: { achievements: { title } } }
    );

    if (result.modifiedCount === 0) {
      return res.status(404).json({ error: "Achievement not found" });
    }

    res
      .status(200)
      .json({ success: true, message: `Deleted achievement: ${title}` });
  } else {
    res.setHeader("Allow", ["POST", "GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
