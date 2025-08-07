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

      const result = await db.collection("allgames").updateOne(
        { id: id }, // <--- id is a field in the document
        {
          $set: {
            cover: cover,
            platinum: parsedPlatinum,
          },
        }
      );

      if (result.matchedCount === 0) {
        return res.status(404).json({ error: "Document not found" });
      }

      res.status(200).json({ message: "Document updated successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to update document" });
    }
  } else if (req.method === "DELETE") {
    try {
      const client = await clientPromise;
      const db = client.db("habittracker");

      const { value } = req.query;

      const result = await db
        .collection("allgames")
        .deleteOne({ _id: new ObjectId(id) });

      if (result.deletedCount === 1) {
        res.status(200).json({ message: "Achievement deleted successfully" });
      } else {
        res.status(404).json({ error: "Achievement not found" });
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Failed to delete Achievement" });
    }
  } else {
    res.setHeader("Allow", ["PUT", "DELETE"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
