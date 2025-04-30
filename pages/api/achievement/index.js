// pages/api/achievement.js
import clientPromise from "../../../lib/db";

export default async function handler(req, res) {
  const client = await clientPromise;
  const db = client.db("habittracker"); // replace with your DB name
  const collection = db.collection("achievements");

  if (req.method === "POST") {
    const { gameId, achievementId } = req.body;

    if (!gameId || !achievementId) {
      return res
        .status(400)
        .json({ message: "Missing gameId or achievementId" });
    }

    try {
      await collection.updateOne(
        { _id: "gameAchievements" },
        { $addToSet: { [gameId]: achievementId } },
        { upsert: true }
      );
      return res
        .status(200)
        .json({ message: "Achievement saved successfully" });
    } catch (error) {
      console.error("MongoDB POST error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  if (req.method === "GET") {
    const { gameId } = req.query;

    if (!gameId) {
      return res.status(400).json({ message: "Missing gameId" });
    }

    try {
      const doc = await collection.findOne({ _id: "gameAchievements" });
      const achievements = doc?.[gameId] || [];
      return res.status(200).json({ gameId, achievements });
    } catch (error) {
      console.error("MongoDB GET error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  return res.status(405).json({ message: "Method not allowed" });
}
