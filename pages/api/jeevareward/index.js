import clientPromise from '../../../lib/db';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { title, reward, category, multi } = req.body;

    if (!title || !reward || !category || !multi) {
      return res.status(400).json({ error: 'Title and reward are required' });
    }

    try {
      const client = await clientPromise;
      const db = client.db('habittracker');
      const result = await db
        .collection('jeevareward')
        .insertOne({ title, reward, category, multi });

      res.status(201).json({ message: 'Habit added successfully' });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: 'Failed to add habit' });
    }
  } else if (req.method === 'GET') {
    try {
      const client = await clientPromise;
      const db = client.db('habittracker');
      const habits = await db.collection('jeevareward').find({}).toArray();
      res.status(200).json(habits);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch habits' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
