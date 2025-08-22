import clientPromise from "../../../lib/db";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { shelfName, type, _id } = req.body;

    try {
      const client = await clientPromise;
      const db = client.db("habittracker");

      // 1. Find the existing shelf to get its old name
      const existingShelf = await db
        .collection("allshelf")
        .findOne({ _id: new ObjectId(_id) });

      if (!existingShelf) {
        return res.status(404).json({ error: "Shelf not found" });
      }

      const oldShelfName = existingShelf.shelfName;

      // 2. Update the shelf
      const result = await db.collection("allshelf").updateOne(
        { _id: new ObjectId(_id) },
        {
          $set: {
            shelfName,
            type,
            created: new Date(),
          },
        }
      );

      if (result.matchedCount === 0) {
        return res.status(404).json({ error: "Shelf not updated" });
      }

      // 3. Update all related games with new shelfName
      await db
        .collection("alllibrary")
        .updateMany(
          { shelfName: oldShelfName },
          { $set: { shelfName: shelfName } }
        );

      res
        .status(200)
        .json({ message: "Shelf and linked games updated successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to update shelf and games" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
