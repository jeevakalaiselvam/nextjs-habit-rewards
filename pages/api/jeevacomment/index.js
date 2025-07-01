import { generateShortId } from "../../../helpers/taskHelper";
import clientPromise from "../../../lib/db";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { comment, taskId, dateTime } = req.body;

    if (!comment || !taskId || !dateTime) {
      return res.status(400).json({ error: "All Fields Required" });
    }

    try {
      const client = await clientPromise;
      const db = client.db("habittracker");
      await db.collection("alltaskcomments").insertOne({
        comment,
        taskId,
        dateTime,
      });

      res.status(201).json({ message: "Task added successfully" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Failed to add spends" });
    }
  } else if (req.method === "GET") {
    try {
      const client = await clientPromise;
      const db = client.db("habittracker");

      let allAchievements = [];

      const allTasks = await db
        .collection("alltaskcomments")
        .find({})
        .toArray();

      res.status(200).json(allTasks);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch Jeeva Task" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
