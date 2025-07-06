import clientPromise from "../../../lib/db";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { achievements, value } = req.body;

    const validAchievements = achievements;

    try {
      const client = await clientPromise;
      const db = client.db("habittracker");

      // 🔥 Delete existing achievements in the collection
      await db.collection(value).deleteMany({});

      // 🚀 Insert new achievements
      await db.collection(value).insertMany(validAchievements);

      res.status(201).json({
        message: `Replaced with ${validAchievements.length} new achievements successfully`,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to update achievements" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
