import { getMongoCollectionForWorkItem } from "../../../components/helpers/apiHelper";
import clientPromise from "../../../lib/db";

export default async function handler(req, res) {
  const { user } = req.query;

  if (req.method === "POST") {
    const { workItemId, time } = req.body;

    if (!workItemId || !time) {
      return res.status(400).json({ error: "Habit and Time are required" });
    }

    try {
      const client = await clientPromise;
      const db = client.db("habittracker");
      const result = await db
        .collection(getMongoCollectionForWorkItem(user))
        .insertOne({ workItemId, time });

      res.status(201).json({ message: "Habit added successfully" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Failed to add habit" });
    }
  } else if (req.method === "GET") {
    try {
      const client = await clientPromise;
      const db = client.db("habittracker");
      const habits = await db
        .collection(getMongoCollectionForWorkItem(user))
        .find({})
        .toArray();
      res.status(200).json(habits);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch habits" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
