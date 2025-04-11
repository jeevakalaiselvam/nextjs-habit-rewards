import { getMongoCollectionForPackage } from "../../../components/helpers/apiHelper";
import clientPromise from "../../../lib/db";

export default async function handler(req, res) {
  const { user } = req.query;

  if (req.method === "POST") {
    const { amountYearly, date } = req.body;

    if (!amountYearly || !date) {
      return res
        .status(400)
        .json({ error: "Yearly Amount and Date are required" });
    }

    try {
      const client = await clientPromise;
      const db = client.db("habittracker");
      const result = await db
        .collection(getMongoCollectionForPackage())
        .insertOne({ amountYearly, date });

      res.status(201).json({ message: "Package added successfully" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Failed to add packages" });
    }
  } else if (req.method === "GET") {
    try {
      const client = await clientPromise;
      const db = client.db("habittracker");
      const packages = await db
        .collection(getMongoCollectionForPackage())
        .find({})
        .toArray();
      res.status(200).json(packages);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch packages" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
