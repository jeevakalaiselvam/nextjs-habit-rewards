import clientPromise from "../../../lib/db";

export default async function handler(req, res) {
  const client = await clientPromise;
  const db = client.db("habittracker");
  const collection = db.collection("learntAchs");

  if (req.method === "POST") {
    const { achName } = req.body;

    if (!achName) {
      return res.status(400).json({ error: "Achievement name is required" });
    }

    // Formatting: 5 Jan @ 3:30am
    const now = new Date();
    const day = now.getDate();
    const month = now.toLocaleDateString("en-US", { month: "short" });
    const time = now
      .toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      })
      .toLowerCase()
      .replace(" ", "");

    const newAchievement = {
      name: achName,
      unlockedAt: `${day} ${month} @ ${time}`,
      unlocktime: new Date(),
    };

    try {
      // 1. Check if the achievement name already exists in the document
      const existing = await collection.findOne({ "achs.name": achName });

      if (!existing) {
        // 2. If it doesn't exist, push it. Upsert handles the very first document creation.
        await collection.updateOne(
          {},
          { $push: { achs: newAchievement } },
          { upsert: true }
        );
      }

      // 3. Always return the latest full list
      const finalDoc = await collection.findOne({});
      return res.status(201).json(finalDoc ? finalDoc.achs : []);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to update achievements" });
    }
  } else if (req.method === "GET") {
    try {
      const doc = await collection.findOne({});
      res.status(200).json(doc ? doc.achs : []);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch" });
    }
  }
}
