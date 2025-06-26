import clientPromise from "../../../lib/db";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { achievements, value } = req.body;

    if (!Array.isArray(achievements) || achievements.length === 0 || !value) {
      return res.status(400).json({
        error: "Achievements array and value (collection name) are required",
      });
    }

    const validAchievements = achievements
      .filter(
        (ach) =>
          ach.name && ach.title && ach.description && ach.type && ach.priority
      )
      .map((ach) => ({
        ...ach,
        total: ach.total ?? 1,
        completed: ach.completed ?? 0,
        unlocked: new Date(),
        achieved: false,
      }));

    if (validAchievements.length === 0) {
      return res
        .status(400)
        .json({ error: "No valid achievements found in request body" });
    }

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
