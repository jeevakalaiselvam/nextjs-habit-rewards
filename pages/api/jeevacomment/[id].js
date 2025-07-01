import clientPromise from "../../../lib/db";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method === "POST") {
    const { comment, taskId } = req.body;

    if (!comment || !taskId) {
      return res.status(400).json({ error: "All Fields Required" });
    }

    try {
      const client = await clientPromise;
      const db = client.db("habittracker");
      await db.collection("alltaskcomments").insertOne({
        comment,
        taskId,
        dateTime: new Date(),
      });

      res.status(201).json({ message: "Task added successfully" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Failed to add spends" });
    }
  } else if (req.method === "DELETE") {
    try {
      const client = await clientPromise;
      const db = client.db("habittracker");

      const { value } = req.query;

      const result = await db
        .collection("alltaskcomments")
        .deleteOne({ _id: new ObjectId(id) });

      if (result.deletedCount === 1) {
        res.status(200).json({ message: "Task deleted successfully" });
      } else {
        res.status(404).json({ error: "Task not found" });
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Failed to delete Task" });
    }
  } else if (req.method === "GET") {
    try {
      const client = await clientPromise;
      const db = client.db("habittracker");

      let allAchievements = [];

      const allTasks = await db
        .collection("alltaskcomments")
        .find({ taskId: id })
        .toArray();

      res.status(200).json(allTasks);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch Jeeva Task" });
    }
  } else {
    res.setHeader("Allow", ["PUT", "DELETE"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
