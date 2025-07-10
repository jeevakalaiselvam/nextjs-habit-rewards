import clientPromise from "../../../lib/db";

export default async function handler(req, res) {
  const { id, total } = req.query;

  if (req.method === "GET") {
    try {
      const client = await clientPromise;
      const db = client.db("habittracker");
      const result = await db.collection(id).updateMany(
        {},
        {
          $set: {
            total: total,
          },
        }
      );

      res.status(200).json({ message: "Achievement updated successfully" });
    } catch (error) {
      res.status(500).json({ error: "Failed to update Achievement" });
    }
  } else {
    res.setHeader("Allow", ["PUT", "DELETE"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
