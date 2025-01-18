import { getMongoHabitsForUser } from '../../../components/helpers/apiHelper';
import clientPromise from '../../../lib/db';
import { ObjectId } from 'mongodb';

export default async function handler(req, res) {
  const { id, user } = req.query;

  if (req.method === 'PUT') {
    const { time, amount, user } = req.body;

    // Validate input
    if (!user || !time || !amount) {
      return res
        .status(400)
        .json({ error: 'User, Time and Amount are required' });
    }

    try {
      const client = await clientPromise;
      const db = client.db('habittracker');

      const result = await db
        .collection('payout')
        .updateOne({ _id: new ObjectId(id) }, { $set: { time, amount, user } });

      if (result.matchedCount === 0) {
        return res.status(404).json({ error: 'Payout not found' });
      }

      res.status(200).json({ message: 'Payout updated successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to update payout' });
    }
  } else if (req.method === 'DELETE') {
    try {
      const client = await clientPromise;
      const db = client.db('habittracker');

      const result = await db
        .collection('payout')
        .deleteOne({ _id: new ObjectId(id) });

      if (result.deletedCount === 1) {
        res.status(200).json({ message: 'Payout deleted successfully' });
      } else {
        res.status(404).json({ error: 'Payout not found' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete payout' });
    }
  } else {
    res.setHeader('Allow', ['PUT', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
