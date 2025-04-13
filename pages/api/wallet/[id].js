import {
  getMon,
  getMongoCollectionForWallet,
  getMongoCollectionForWalletgoCollectionForPackage,
} from "../../../components/helpers/apiHelper";
import clientPromise from "../../../lib/db";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method === "PUT") {
    const { wallet, id } = req.body;
    console.log(wallet, id?.toString());

    if (!wallet || !id) {
      return res
        .status(400)
        .json({ error: "Yearly Amount and id are required" });
    }

    try {
      const client = await clientPromise;
      const db = client.db("habittracker");

      const result = await db
        .collection(getMongoCollectionForWallet())
        .updateOne({ _id: new ObjectId(id) }, { $set: { wallet, id } });

      if (result.matchedCount === 0) {
        return res.status(404).json({ error: "wallet not found" });
      }

      res.status(200).json({ message: "wallet updated successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to update habit" });
    }
  } else if (req.method === "DELETE") {
    try {
      const client = await clientPromise;
      const db = client.db("habittracker");

      const result = await db
        .collection(getMongoCollectionForWallet())
        .deleteOne({ _id: new ObjectId(id) });

      if (result.deletedCount === 1) {
        res.status(200).json({ message: "wallet deleted successfully" });
      } else {
        res.status(404).json({ error: "wallet not found" });
      }
    } catch (error) {
      res.status(500).json({ error: "Failed to delete habit" });
    }
  } else {
    res.setHeader("Allow", ["PUT", "DELETE"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
