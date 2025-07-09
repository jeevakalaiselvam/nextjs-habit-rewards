import clientPromise from "../../../lib/db";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method === "PUT") {
    const { id, cover, platinum } = req.body;

    let parsedPlatinum;
    try {
      parsedPlatinum = JSON.parse(platinum);
    } catch (e) {
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
