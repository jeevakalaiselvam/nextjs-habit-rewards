import clientPromise from "../../../lib/db";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method === "PUT") {
    const {
      type,
      title,
      description,
      assignee,
      taskId,
      completedAt,
      createdAt,
      isCompleted,
      priority,
      status,
      ticket,
      _id,
    } = req.body;

    if (!type || !title || !description || !assignee) {
      return res.status(400).json({ error: "All Fields Required" });
    }

    try {
      const client = await clientPromise;
      const db = client.db("habittracker");
      const result = await db.collection("alltasks").updateOne(
        { _id: new ObjectId(id) },
        {
          $set: {
            type,
            title,
            description,
            assignee,
            createdAt,
            taskId,
            completedAt,
            isCompleted,
            priority,
            status,
            ticket,
          },
        }
      );

      if (result.matchedCount === 0) {
        return res.status(404).json({ error: "Task not found" });
      }
      res.status(200).json({ message: "Task updated successfully" });
    } catch (error) {
      res.status(500).json({ error: "Failed to update Task" });
    }
  } else if (req.method === "DELETE") {
    try {
      const client = await clientPromise;
      const db = client.db("habittracker");

      const { value } = req.query;

      const result = await db
        .collection("alltasks")
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
  } else {
    res.setHeader("Allow", ["PUT", "DELETE"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
