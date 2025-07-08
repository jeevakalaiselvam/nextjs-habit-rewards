import clientPromise from "../../../lib/db";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method === "PUT") {
    const { title, desc, type, _id, status } = req.body;

    if (!title || !desc || !type || !status) {
      return res
        .status(400)
        .json({ error: "Title, Description, Type required" });
    }

    try {
      const client = await clientPromise;
      const db = client.db("habittracker");
      const result = await db.collection("verizontracker").updateOne(
        { _id: new ObjectId(_id) },
        {
          $set: {
            title,
            desc,
            type,
            status,
          },
        }
      );

      if (result.matchedCount === 0) {
        return res.status(404).json({ error: "Backlog Item not found" });
      }
      res.status(200).json({ message: "Backlog Item updated successfully" });
    } catch (error) {
      res.status(500).json({ error: "Failed to update Backlog Item", error });
    }
  } else if (req.method === "DELETE") {
    try {
      const client = await clientPromise;
      const db = client.db("habittracker");

      const { value } = req.query;

      const result = await db
        .collection("verizontracker")
        .deleteOne({ _id: new ObjectId(id) });

      if (result.deletedCount === 1) {
        res.status(200).json({ message: "Backlog Item deleted successfully" });
      } else {
        res.status(404).json({ error: "Backlog Item not found" });
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Failed to delete Backlog Item" });
    }
  } else {
    res.setHeader("Allow", ["PUT", "DELETE"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
