export default async function handler(req, res) {
  if (req.method === "POST") {
    const { name, exclude, count } = req.body;
    if (!name || !exclude || !count) {
      res.status(404).json({ status: "Error" });
    }

    try {
      const client = await clientPromise;
      const db = client.db("habittracker");
      await db.collection("saravana").insertOne({
        name,
        exclude,
        count: String(count),
      });

      res.status(201).json({ message: "Achievement added successfully" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error });
    }

    res.status(200).json({ message: "Create Success" });
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
}
