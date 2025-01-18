import clientPromise from '../../../lib/db';
import { ObjectId } from 'mongodb';

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method === 'PUT') {
    const { time, habitId, count } = req.body;

    // Validate input
    if (!time || !habitId || !count) {
      return res.status(400).json({ error: 'Title and reward are required' });
    }

    try {
      const client = await clientPromise;
      const db = client.db('habittracker');

      const result = await db
        .collection('jeevahabit')
        .updateOne(
          { _id: new ObjectId(id) },
          { $set: { time, habitId, count } }
        );

      if (result.matchedCount === 0) {
        return res.status(404).json({ error: 'Habit not found' });
      }

      res.status(200).json({ message: 'Habit updated successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to update habit' });
    }
  } else if (req.method === 'DELETE') {
    try {
      const client = await clientPromise;
      const db = client.db('habittracker');

      const result = await db
        .collection('jeevahabit')
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
