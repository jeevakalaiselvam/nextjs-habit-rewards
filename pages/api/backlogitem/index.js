import clientPromise from "../../../lib/db";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { title, desc, type } = req.body;

    if (!title || !desc || !type) {
      return res
        .status(400)
        .json({ error: "Title, Description, Type required" });
    }

    try {
      const client = await clientPromise;
      const db = client.db("habittracker");
      await db.collection("verizontracker").insertOne({
        title,
        desc,
        type,
        isCompleted: "false",
        created: new Date(),
        reward: "500",
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

      let backlogItems = [];

      backlogItems = await db.collection("verizontracker").find({}).toArray();

      res.status(200).json(backlogItems);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch Backlog Items" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
