import clientPromise from "../../../lib/db";

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const client = await clientPromise;
      const db = client.db("habittracker");

      let allCourse = [];

      const jeevagames = await db.collection("saravana").find({}).toArray();

      res.status(200).json(jeevagames);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch Jeeva Achievements" });
    }
    res.status(200).json({ message: "Create Success" });
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
}
