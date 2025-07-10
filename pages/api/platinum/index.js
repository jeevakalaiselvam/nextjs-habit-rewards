import clientPromise from "../../../lib/db";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const {
      id,
      cover,
      platinum,
      dlc1Name,
      dlc1Trophies,
      dlc2Name,
      dlc2Trophies,
      dlc3Name,
      dlc3Trophies,
      dlc4Name,
      dlc4Trophies,
      dlc5Name,
      dlc5Trophies,
      dlc1Image,
      dlc2Image,
      dlc3Image,
      dlc4Image,
      dlc5Image,
    } = req.body;

    if (!id || !cover || !platinum) {
      return res.status(400).json({ error: "Data is required" });
    }

    try {
      const client = await clientPromise;
      const db = client.db("habittracker");
      await db.collection("platinum").insertOne({
        id,
        cover,
        platinum,
        dlc1Name,
        dlc1Trophies,
        dlc2Name,
        dlc2Trophies,
        dlc3Name,
        dlc3Trophies,
        dlc4Name,
        dlc4Trophies,
        dlc5Name,
        dlc5Trophies,
        dlc1Image,
        dlc2Image,
        dlc3Image,
        dlc4Image,
        dlc5Image,
      });

      res.status(201).json({ message: "Game added successfully" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Failed to add spends" });
    }
  } else if (req.method === "GET") {
    try {
      const client = await clientPromise;
      const db = client.db("habittracker");
      const jeevagame = await db.collection("platinum").find({}).toArray();
      res.status(200).json(jeevagame);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch Jeeva Achievements" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
