export default async function handler(req, res) {
  if (req.method === "POST") {
    const { name, exclude, count } = req.body;

    if (!name || !exclude || !count) {
      return res
        .status(400)
        .json({ status: "Error", message: "Missing required fields" });
    }

    try {
      const client = await clientPromise;
      const db = client.db("habittracker");

      await db.collection("saravana").insertOne({
        name,
        exclude,
        count: String(count),
      });

      return res
        .status(201)
        .json({ message: "Achievement added successfully" });
    } catch (error) {
      console.error("DB Insert Error:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  } else {
    return res.status(405).json({ message: "Method Not Allowed" });
  }
}
