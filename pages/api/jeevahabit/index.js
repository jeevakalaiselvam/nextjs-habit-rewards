import clientPromise from '../../../lib/db';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { habitId, count, time } = req.body;

    if (!habitId || !count || !time) {
      return res
        .status(400)
        .json({ error: 'Count, Habit and Time are required' });
    }

    try {
      const client = await clientPromise;
      const db = client.db('habittracker');
      const result = await db
        .collection('jeevahabit')
        .insertOne({ habitId, count, time });

      res.status(201).json({ message: 'Habit added successfully' });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: 'Failed to add habit' });
    }
  } else if (req.method === 'GET') {
    try {
      const client = await clientPromise;
      const db = client.db('habittracker');
      const habits = await db.collection('jeevahabit').find({}).toArray();
      res.status(200).json(habits);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch habits' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
