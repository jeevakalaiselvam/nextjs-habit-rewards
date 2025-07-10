import clientPromise from "../../../lib/db";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method === "PUT") {
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
    } = req.body;

    let parsedPlatinum;
    let parseddlc1Trophies;
    let parseddlc2Trophies;
    let parseddlc3Trophies;
    let parseddlc4Trophies;
    let parseddlc5Trophies;
    try {
      parsedPlatinum = JSON.parse(platinum);
      parseddlc1Trophies = JSON.parse(dlc1Trophies);
      parseddlc2Trophies = JSON.parse(dlc2Trophies);
      parseddlc3Trophies = JSON.parse(dlc3Trophies);
      parseddlc4Trophies = JSON.parse(dlc4Trophies);
      parseddlc5Trophies = JSON.parse(dlc5Trophies);
    } catch (e) {
      console.error("JEEVA", e);
      return res.status(400).json({ error: "Invalid platinum JSON" });
    }

    try {
      const client = await clientPromise;
      const db = client.db("habittracker");

      const result = await db.collection("platinum").updateOne(
        { id: id }, // match document where id equals provided id
        {
          $set: {
            cover: cover,
            platinum: parsedPlatinum,
            dlc1Name,
            dlc1Trophies: parseddlc1Trophies,
            dlc2Name,
            dlc2Trophies: parseddlc2Trophies,
            dlc3Name,
            dlc3Trophies: parseddlc3Trophies,
            dlc4Name,
            dlc4Trophies: parseddlc4Trophies,
            dlc5Name,
            dlc5Trophies: parseddlc5Trophies,
          },
        },
        { upsert: true }
      );

      if (result.upsertedCount > 0) {
        return res
          .status(201)
          .json({ message: "Document created successfully" });
      } else {
        return res
          .status(200)
          .json({ message: "Document updated successfully" });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to update or create document" });
    }
  } else {
    res.setHeader("Allow", ["PUT", "DELETE"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
