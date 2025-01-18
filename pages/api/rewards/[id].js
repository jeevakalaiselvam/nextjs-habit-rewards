import { getMongoRewardForUser } from '../../../components/helpers/apiHelper';
import clientPromise from '../../../lib/db';
import { ObjectId } from 'mongodb';

export default async function handler(req, res) {
  const { id, user } = req.query;

  if (req.method === 'PUT') {
    const { title, reward, category, multi } = req.body;

    // Validate input
    if (!title || !reward || !category || !multi || !user) {
      return res.status(400).json({ error: 'Title and reward are required' });
    }

    try {
      const client = await clientPromise;
      const db = client.db('habittracker');

      const result = await db
        .collection(getMongoRewardForUser(user))
        .updateOne(
          { _id: new ObjectId(id) },
          { $set: { title, reward, category, multi } }
        );

      if (result.matchedCount === 0) {
        return res.status(404).json({ error: 'Habit not found' });
      }

      res.status(200).json({ message: 'Habit updated successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to update habit' });
    }
  } else if (req.method === 'DELETE') {
    const { user } = req.query;
    try {
      const client = await clientPromise;
      const db = client.db('habittracker');

      const result = await db
        .collection(getMongoRewardForUser(user))
        .deleteOne({ _id: new ObjectId(id) });

      if (result.deletedCount === 1) {
        res.status(200).json({ message: 'Habit deleted successfully' });
      } else {
        res.status(404).json({ error: 'Habit not found' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete habit' });
    }
  } else {
    res.setHeader('Allow', ['PUT', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
