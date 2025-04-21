import {
  getMon,
  getMongoCollectionForSpending,
  getMongoCollectionForSpendinggoCollectionForSpending,
} from "../../../components/helpers/apiHelper";
import clientPromise from "../../../lib/db";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method === "PUT") {
    const {
      amount,
      date,
      category,
      recurring,
      type,
      title,
      startDate,
      endDate,
    } = req.body;

    if (!amount || !date || !category || !recurring || !type || !title) {
      return res
        .status(400)
        .json({ error: "Amount, Date, Category, Recurring are required" });
    }

    try {
      const client = await clientPromise;
      const db = client.db("habittracker");

      const result = await db
        .collection(getMongoCollectionForSpending())
        .updateOne(
          { _id: new ObjectId(id) },
          {
            $set: {
              amount,
              date,
              category,
              recurring,
              type,
              title,
              startDate,
              endDate,
            },
          }
        );

      if (result.matchedCount === 0) {
        return res.status(404).json({ error: "Spending not found" });
      }
      res.status(200).json({ message: "Spending updated successfully" });
    } catch (error) {
      res.status(500).json({ error: "Failed to update Spending" });
    }
  } else if (req.method === "DELETE") {
    try {
      const client = await clientPromise;
      const db = client.db("habittracker");

      const result = await db
        .collection(getMongoCollectionForSpending())
        .deleteOne({ _id: new ObjectId(id) });

      if (result.deletedCount === 1) {
        res.status(200).json({ message: "Habit deleted successfully" });
      } else {
        res.status(404).json({ error: "Habit not found" });
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Failed to delete habit" });
    }
  } else {
    res.setHeader("Allow", ["PUT", "DELETE"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
