import { generateShortId } from "../../../helpers/taskHelper";
import clientPromise from "../../../lib/db";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { type, title, description, assignee, taskId, completedAt } =
      req.body;

    if (!type || !title || !description || !assignee) {
      return res.status(400).json({ error: "All Fields Required" });
    }

    try {
      const client = await clientPromise;
      const db = client.db("habittracker");
      await db.collection("alltasks").insertOne({
        type,
        title,
        description,
        assignee,
        createdAt: new Date(),
        taskId: generateShortId(type),
        completedAt,
        isCompleted: false,
      });

      res.status(201).json({ message: "Achievement added successfully" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Failed to add spends" });
    }
  } else if (req.method === "GET") {
    try {
      const client = await clientPromise;
      const db = client.db("habittracker");

      let allAchievements = [];

      const allTasks = await db.collection("alltasks").find({}).toArray();

      res.status(200).json(allTasks);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch Jeeva Achievements" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
