import clientPromise from "../../../lib/db";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { userId, courseId } = req.body;

    if (!userId || !courseId) {
      return res
        .status(400)
        .json({ status: "Error", message: "Missing required fields" });
    }

    try {
      const client = await clientPromise;
      const db = client.db("habittracker");

      await db.collection("saravanaregistered").insertOne({
        userId,
        courseId,
      });

      return res
        .status(201)
        .json({ message: "Achievement added successfully" });
    } catch (error) {
      console.error("DB Insert Error:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }
  if (req.method === "GET") {
    try {
      const client = await clientPromise;
      const db = client.db("habittracker");

      let allCourse = [];

      const jeevagames = await db
        .collection("saravanaregistered")
        .find({})
        .toArray();

      res.status(200).json(jeevagames);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch Jeeva Achievements" });
    }
    res.status(200).json({ message: "Create Success" });
  } else {
    return res.status(405).json({ message: "Method Not Allowed" });
  }
}
