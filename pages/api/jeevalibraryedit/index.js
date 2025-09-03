import clientPromise from "../../../lib/db";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { title, type, image, _id } = req.body;

    try {
      const client = await clientPromise;
      const db = client.db("habittracker");

      const result = await db.collection("alllibrary").updateOne(
        { _id: new ObjectId(_id) }, // <--- id is a field in the document
        {
          $set: {
            title: title,
            type: type,
            image: image,
            updated: new Date(),
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
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
