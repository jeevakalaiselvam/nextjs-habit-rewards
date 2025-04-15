import { getMongoHabitsForUser } from '../../../components/helpers/apiHelper';
import clientPromise from '../../../lib/db';

export default async function handler(req, res) {
  const { user } = req.query;

  if (req.method === 'POST') {
    const { habits } = req.body;

    if (!habits || !user) {
      return res.status(400).json({ error: 'Habits' });
    }

    try {
      const client = await clientPromise;
      const db = client.db('habittracker');
      const result = await db
        .collection(getMongoHabitsForUser(user))
        .insertMany(habits);

      res.status(201).json({ message: 'Habits added successfully' });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: 'Failed to add habit' });
    }
  }
}
