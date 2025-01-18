import { getMongoHabitsForUser } from '../../../components/helpers/apiHelper';
import clientPromise from '../../../lib/db';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { time, user, amount } = req.body;

    if (!time || !user) {
      return res
        .status(400)
        .json({ error: 'Time, Amount and User are required' });
    }

    try {
      const client = await clientPromise;
      const db = client.db('habittracker');
      const result = await db
        .collection('payout')
        .insertOne({ time, user, amount });

      res.status(201).json({ message: 'Payout added successfully' });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: 'Failed to add payout' });
    }
  } else if (req.method === 'GET') {
    try {
      const client = await clientPromise;
      const db = client.db('habittracker');
      const habits = await db.collection('payout').find({}).toArray();
      res.status(200).json(habits);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch habits' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
