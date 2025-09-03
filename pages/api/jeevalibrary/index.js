import { ObjectId } from "mongodb";
import clientPromise from "../../../lib/db";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { title, type, image } = req.body;

    if (!title || !image || !type) {
      return res.status(400).json({ error: "Field are required" });
    }

    try {
      const client = await clientPromise;
      const db = client.db("habittracker");
      await db.collection("alllibrary").insertOne({
        title,
        type: "GAME",
        image,
        created: new Date(),
        updated: new Date(),
      });

      res.status(201).json({ message: "Item added successfully" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Failed to add spends" });
    }
  } else if (req.method === "GET") {
    try {
      const client = await clientPromise;
      const db = client.db("habittracker");

      let allAchievements = [];

      const alllibrary = await db.collection("alllibrary").find({}).toArray();

      res.status(200).json(alllibrary);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch Jeeva Achievements" });
    }
  } else if (req.method === "DELETE") {
    const { id } = req.query;
    try {
      const client = await clientPromise;
      const db = client.db("habittracker");

      const result = await db.collection("alllibrary").deleteOne({
        _id: new ObjectId(id),
      });

      if (result.deletedCount === 1) {
        res.status(200).json({ message: "Deleted successfully" });
      } else {
        res.status(404).json({ error: "Document not found" });
      }
    } catch (error) {
      console.error("Error deleting document:", error);
      res.status(500).json({ error: "Failed to delete achievement" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
