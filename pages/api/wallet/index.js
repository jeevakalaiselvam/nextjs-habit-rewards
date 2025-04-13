import { getMongoCollectionForWallet } from "../../../components/helpers/apiHelper";
import clientPromise from "../../../lib/db";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { id, wallet } = req.body;

    if (!id) {
      return res
        .status(400)
        .json({ error: "Yearly Amount and id are required" });
    }

    try {
      const client = await clientPromise;
      const db = client.db("habittracker");
      await db
        .collection(getMongoCollectionForWallet())
        .replaceOne({ id: id }, { wallet, id }, { upsert: true });

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
        .collection(getMongoCollectionForWallet())
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
