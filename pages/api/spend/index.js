import { getMongoCollectionForSpending } from "../../../components/helpers/apiHelper";
import clientPromise from "../../../lib/db";

export default async function handler(req, res) {
  const { user } = req.query;

  if (req.method === "POST") {
    const { amount, date, category, type } = req.body;

    if (!amount || !date || !category || !type) {
      return res
        .status(400)
        .json({ error: "Amount, Date, Category, Type are required" });
    }

    try {
      const client = await clientPromise;
      const db = client.db("habittracker");
      await db
        .collection(getMongoCollectionForSpending())
        .insertOne({ amount, date, category, type });

      res.status(201).json({ message: "Spend added successfully" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Failed to add spends" });
    }
  } else if (req.method === "GET") {
    try {
      const client = await clientPromise;
      const db = client.db("habittracker");
      const spends = await db
        .collection(getMongoCollectionForSpending())
        .find({})
        .toArray();
      res.status(200).json(spends);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch spends" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
